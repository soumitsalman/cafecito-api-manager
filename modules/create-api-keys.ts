import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

const accountName = environment.ZUPLO_ACCOUNT_NAME;
const bucketName = environment.ZUPLO_API_KEY_SERVICE_BUCKET_NAME;

export default async function (request: ZuploRequest, context: ZuploContext) {
    const sub = request.user?.sub;
    const body = await request.json();
    const email = body.email;
    const subscriptionPlan = body.metadata?.subscription_plan ?? "free";
    const subscriptionStatus = body.metadata?.subscription_status ??
        (subscriptionPlan === "free" ? "active" : "inactive");

    if (!sub || !email) {
        context.log.error("Failed to create API key: Missing user info.");
        return new Response("Failed to create API key: Missing user info.", { status: 404 });
    }

    context.log.info("Creating API key for user:", sub);
    context.log.info("Request body:", JSON.stringify(body));
    const response = await fetch(
        `https://dev.zuplo.com/v1/accounts/${accountName}/key-buckets/${bucketName}/consumers?with-api-key=true`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${environment.ZAPI_DEVELOPER_API_KEY}`,
            },
            body: JSON.stringify({
                name: crypto.randomUUID(),
                managers: [
                    { email: email, sub: sub },
                ],
                description: body.description ?? "API Key",
                tags: {
                    sub: sub,
                    email: email,
                },
                metadata: {
                    subscription_plan: subscriptionPlan,
                    subscription_status: subscriptionStatus,
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        context.log.error("Failed to create API key:", error);
        return new Response(error, { status: response.status });
    }

    return response.json();
}