import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";
import { verifyWebhook } from "@clerk/backend/webhooks";
import {
  deleteUserConsumers,
  updateUserConsumers,
} from "./consumer-ops";

// --- Event type groupings ---
const SUBSCRIPTION_TERMINATE_EVENTS = new Set([
  "subscriptionItem.canceled",
  "subscriptionItem.abandoned",
  "subscriptionItem.ended",
]);

const SUBSCRIPTION_ACTIVE_EVENTS = new Set([
  "subscription.active",
  "subscription.created",
  "subscription.updated",
  "subscriptionItem.active",
  "subscriptionItem.created",
  "subscriptionItem.updated",
]);

const SUBSCRIPTION_PASTDUE_EVENTS = new Set([
  "subscription.pastDue",
  "subscriptionItem.pastDue",
]);

// --- Payload helpers ---

interface SubscriptionPlan {
  name: string;
  slug: string;
}

/**
 * Extracts user ID and plan info from subscription / subscriptionItem payloads.
 *
 * - `subscription.*` events: plan at `data.items[0].plan`, user at `data.payer.user_id`
 * - `subscriptionItem.*` events: plan at `data.plan`, user at `data.payer.user_id`
 */
function extractSubscriptionInfo(evt: { type: string; data: Record<string, unknown> }) {
  const data = evt.data as Record<string, unknown>;
  const payer = data.payer as { user_id: string; email?: string } | undefined;
  const userId = payer?.user_id as string;
  const email = payer?.email as string | undefined;

  let plan: SubscriptionPlan | undefined;

  if (evt.type.startsWith("subscriptionItem.")) {
    plan = data.plan as SubscriptionPlan | undefined;
  } else {
    // subscription.* events — plan is inside items[0]
    const items = data.items as { plan: SubscriptionPlan }[] | undefined;
    plan = items?.[0]?.plan;
  }

  return {
    userId,
    email,
    planName: plan?.name ?? "free",
    planSlug: plan?.slug ?? "free",
  };
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
) {
  // --- Verify the webhook signature using Clerk's official SDK ---
  let evt;
  try {
    evt = await verifyWebhook(request, {
      signingSecret: environment.CLERK_WEBHOOK_SIGNING_SECRET,
    });
  } catch (err) {
    context.log.error("Clerk webhook verification failed:", err);
    return jsonResponse({ error: "Webhook verification failed" }, 400);
  }

  const eventType = evt.type;
  context.log.info(`Clerk webhook received: type=${eventType}`);

  // =====================
  // User lifecycle events
  // =====================

  // --- User deleted: remove all API key consumers ---
  if (eventType === "user.deleted") {
    const userId = evt.data.id as string;
    const result = await deleteUserConsumers(userId, context);
    return jsonResponse({ ok: true, event: eventType, ...result });
  }

  // --- User updated: sync subscription_plan, subscription_status, and email ---
  if (eventType === "user.updated") {
    const userId = evt.data.id as string;
    const emailAddresses = evt.data.email_addresses as
      | { email_address: string }[]
      | undefined;
    const primaryEmail = emailAddresses?.[0]?.email_address;

    const publicMetadata = evt.data.public_metadata as
      | Record<string, unknown>
      | undefined;
    const subscriptionPlan =
      (publicMetadata?.subscription_plan as string) ?? "free";
    const subscriptionStatus =
      (publicMetadata?.subscription_status as string) ?? "inactive";

    const tags: Record<string, string> = {};
    if (primaryEmail) {
      tags.email = primaryEmail;
    }

    const result = await updateUserConsumers(
      userId,
      {
        tags: Object.keys(tags).length > 0 ? tags : undefined,
        metadata: {
          subscription_plan: subscriptionPlan,
          subscription_status: subscriptionStatus,
        },
      },
      context,
    );

    return jsonResponse({
      ok: true,
      event: eventType,
      subscription_plan: subscriptionPlan,
      subscription_status: subscriptionStatus,
      ...result,
    });
  }

  // =====================
  // Subscription events
  // =====================

  // --- Subscription terminated: delete all API key consumers ---
  if (SUBSCRIPTION_TERMINATE_EVENTS.has(eventType)) {
    const { userId } = extractSubscriptionInfo(evt as { type: string; data: Record<string, unknown> });
    context.log.info(`Subscription terminated for user ${userId}, deleting consumers`);
    const result = await deleteUserConsumers(userId, context);
    return jsonResponse({ ok: true, event: eventType, ...result });
  }

  // --- Subscription active/created/updated: sync plan as active ---
  if (SUBSCRIPTION_ACTIVE_EVENTS.has(eventType)) {
    const { userId, planName } = extractSubscriptionInfo(evt as { type: string; data: Record<string, unknown> });
    context.log.info(`Subscription active for user ${userId}, plan=${planName}`);
    const result = await updateUserConsumers(
      userId,
      {
        metadata: {
          subscription_plan: planName,
          subscription_status: "active",
        },
      },
      context,
    );
    return jsonResponse({
      ok: true,
      event: eventType,
      subscription_plan: planName,
      subscription_status: "active",
      ...result,
    });
  }

  // --- Subscription past due: mark inactive ---
  if (SUBSCRIPTION_PASTDUE_EVENTS.has(eventType)) {
    const { userId, planName } = extractSubscriptionInfo(evt as { type: string; data: Record<string, unknown> });
    context.log.info(`Subscription past due for user ${userId}, plan=${planName}`);
    const result = await updateUserConsumers(
      userId,
      {
        metadata: {
          subscription_plan: planName,
          subscription_status: "inactive",
        },
      },
      context,
    );
    return jsonResponse({
      ok: true,
      event: eventType,
      subscription_plan: planName,
      subscription_status: "inactive",
      ...result,
    });
  }

  // --- Unhandled event type ---
  context.log.info(`Ignoring unhandled Clerk event type: ${eventType}`);
  return jsonResponse({ ok: true, event: eventType, ignored: true });
}
