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
    return request;
}
