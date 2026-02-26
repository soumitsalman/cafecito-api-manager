import { ZuploContext, environment } from "@zuplo/runtime";

const accountName = environment.ZUPLO_ACCOUNT_NAME;
const bucketName = environment.ZUPLO_API_KEY_SERVICE_BUCKET_NAME;
const apiKey = environment.ZUPLO_DEVELOPER_API_KEY;
const ZUPLO_API_BASE = `https://dev.zuplo.com/v1/accounts/${accountName}/key-buckets/${bucketName}`;

interface Consumer {
  id: string;
  name: string;
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

interface ListConsumersResponse {
  data: Consumer[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Lists all consumers whose `tags.sub` matches the given Clerk user ID.
 * Uses the Zuplo API server-side `tag.sub` query filter — no client-side filtering needed.
 */
async function listConsumersBySub(
  sub: string,
  context: ZuploContext,
): Promise<Consumer[]> {
  const url = `${ZUPLO_API_BASE}/consumers?tag.sub=${encodeURIComponent(sub)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const error = await response.text();
    context.log.error(`Failed to list consumers for sub=${sub}:`, error);
    return [];
  }

  const body = (await response.json()) as ListConsumersResponse;
  return body.data ?? [];
}

/**
 * Deletes all API key consumers belonging to a given Clerk user (by `tags.sub`).
 * Returns a summary of how many were deleted vs failed.
 */
export async function deleteUserConsumers(
  sub: string,
  context: ZuploContext,
): Promise<{ deleted: number; failed: number }> {
  const consumers = await listConsumersBySub(sub, context);

  if (consumers.length === 0) {
    context.log.info(`No consumers found for sub=${sub}; nothing to delete`);
    return { deleted: 0, failed: 0 };
  }

  let deleted = 0;
  let failed = 0;

  for (const consumer of consumers) {
    const response = await fetch(
      `${ZUPLO_API_BASE}/consumers/${consumer.name}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );

    if (response.ok || response.status === 204) {
      context.log.info(`Deleted consumer ${consumer.name}`);
      deleted++;
    } else {
      const error = await response.text();
      context.log.error(`Failed to delete consumer ${consumer.name}:`, error);
      failed++;
    }
  }

  context.log.info(
    `deleteUserConsumers(sub=${sub}): deleted=${deleted}, failed=${failed}`,
  );
  return { deleted, failed };
}

/**
 * Updates tags and/or metadata on all API key consumers belonging to a given Clerk user.
 *
 * - `updates.tags` — merged into consumer tags (e.g. `{ email }`)
 * - `updates.metadata` — merged into consumer metadata (e.g. `{ subscription_plan, subscription_status }`)
 *
 * Returns a summary of how many were updated vs failed.
 */
export async function updateUserConsumers(
  sub: string,
  updates: {
    tags?: Record<string, string>;
    metadata?: Record<string, unknown>;
  },
  context: ZuploContext,
): Promise<{ updated: number; failed: number }> {
  const consumers = await listConsumersBySub(sub, context);

  if (consumers.length === 0) {
    context.log.info(
      `No consumers found for sub=${sub}; nothing to update`,
    );
    return { updated: 0, failed: 0 };
  }

  let updated = 0;
  let failed = 0;

  for (const consumer of consumers) {
    const patchBody: Record<string, unknown> = {};

    if (updates.tags) {
      patchBody.tags = { ...(consumer.tags ?? {}), ...updates.tags };
    }
    if (updates.metadata) {
      patchBody.metadata = {
        ...((consumer.metadata as Record<string, unknown>) ?? {}),
        ...updates.metadata,
      };
    }

    const response = await fetch(
      `${ZUPLO_API_BASE}/consumers/${consumer.name}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(patchBody),
      },
    );

    if (response.ok) {
      context.log.info(
        `Updated consumer ${consumer.name}: ${JSON.stringify(patchBody)}`,
      );
      updated++;
    } else {
      const error = await response.text();
      context.log.error(
        `Failed to update consumer ${consumer.name}:`,
        error,
      );
      failed++;
    }
  }

  context.log.info(
    `updateUserConsumers(sub=${sub}): updated=${updated}, failed=${failed}`,
  );
  return { updated, failed };
}
