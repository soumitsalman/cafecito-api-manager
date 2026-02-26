import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface GateAuthOptions {
    allowUnauthenticatedRequests?: boolean;
}

export default async function (
    request: ZuploRequest,
    context: ZuploContext,
    options: GateAuthOptions
) {
    if (!request.user?.sub) {
        return new Response("Unauthorized", { status: 401 });
    }

    // TODO: disabling temporarily
    // Block requests when subscription is inactive
    // const subscriptionStatus = (request.user.data as Record<string, unknown>)
    //     ?.subscription_status as string | undefined;
    // if (subscriptionStatus === "inactive") {
    //     return new Response("Subscription inactive", { status: 403 });
    // }

    return request;
}
