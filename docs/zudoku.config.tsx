import type { ZudokuConfig } from "zudoku";

/**
 * Developer Portal Configuration
 * For more information, see:
 * https://zuplo.com/docs/dev-portal/zudoku/configuration/overview
 */
const config: ZudokuConfig = {
  site: {
    title: "Cafecito API Developer Portal",
    logo: {
      src: {
        light: "/cafecito.png",
        dark: "/cafecito-dark.png",
      },
    },
  },
  metadata: {
    title: "Cafecito API Developer Portal",
    description: "Developer documentation for Cafecito product APIs",
    favicon: "/cafecito-dark.png",
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [
            {
              type: "doc",
              file: "introduction",
            },
            {
              type: "doc",
              file: "howtos/api-keys",
            },
            {
              type: "doc",
              file: "howtos/beans-api",
            }
          ]
        },
        {
          type: "category",
          label: "Pricing",
          icon: "coffee",
          items: [
            {
              type: "doc",
              file: "pricing/beans-pricing",
            },
          ],
        },
        {
          type: "category",
          label: "Company & Policies",
          icon: "building",
          items: [
            {
              type: "doc",
              file: "company/about-us",
            },
            {
              type: "doc",
              file: "company/privacy-policy",
            },
            {
              type: "doc",
              file: "company/terms-of-use",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: [
        {
          type: "link",
          to: "/api/beans",
          label: "Beans",
        }
      ],
    },
  ],
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "../config/beans.oas.json",
      path: "api/beans",
    }
  ],
  authentication: {
    type: "clerk",
    clerkPubKey: "pk_test_YW11c2VkLXdyZW4tMjAuY2xlcmsuYWNjb3VudHMuZGV2JA",
    jwtTemplateName: "dev-portal",
  },
  apiKeys: {
    enabled: true,
    listKeys: true,
    revokeKey: true,

    createKey: async ({ apiKey, context, auth }) => {
      const userId = auth.profile?.sub;
      if (!auth.isAuthenticated || !userId) {
        throw new Error("Authentication incomplete. Please sign in again.");
      }

      if (auth.profile?.emailVerified === false) {
        throw new Error("Verify your email first, then retry API key creation.");
      }

      const deploymentName =
        context.env.ZUPLO_DEPLOYMENT_NAME ||
        context.env.ZUPLO_PROJECT_NAME;

      if (!deploymentName) {
        throw new Error(
          "Unable to resolve Zuplo deployment name for API key creation."
        );
      }

      const payload = {
        label: apiKey.description || auth.profile?.email || userId,
        metadata: {
          clerkUserId: userId,
          email: auth.profile?.email,
          subscriptionPlan: auth.profile?.subscription_plan || "free",
          createdAt: new Date().toISOString(),
        },
        expiresOn: apiKey.expiresOn,
      };

      const request = new Request(
        `${zuploClientApiBase}/${deploymentName}/consumers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const response = await fetch(await context.signRequest(request));
      if (!response.ok) {
        let detail = `Failed to create key (${response.status})`;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/problem+json")) {
          const problem = (await response.json()) as {
            detail?: string;
            title?: string;
          };
          detail = problem.detail || problem.title || detail;
        }

        throw new Error(detail);
      }

      const responseJson = (await response.json()) as {
        data?: { apiKeys?: { data?: Array<{ key?: string }> } };
      };

      if (!responseJson?.data?.apiKeys?.data?.[0]?.key) {
        throw new Error(
          "Key was created but no key value was returned by the API."
        );
      }

      return;
    },
  },
};

export default config;
