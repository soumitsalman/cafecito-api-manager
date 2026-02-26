import type { ZudokuConfig } from "zudoku";

const serverUrl = process.env.ZUDOKU_PUBLIC_SERVER_URL || import.meta.env.ZUPLO_SERVER_URL;
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
              type: "doc",
              file: "introduction",
        },
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [            
            {
              type: "doc",
              file: "howtos/api-keys",
            },
            {
              type: "doc",
              file: "howtos/beans-howto",
            },            
            {
              type: "doc",
              file: "howtos/espresso-howto",
            },
            {
              type: "doc",
              file: "howtos/cortado-howto",
            },
          ]
        },
        {
          type: "category",
          label: "Pricing",
          icon: "dollar-sign",
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
    clerkPubKey: process.env.ZUDOKU_PUBLIC_CLERK_PUBLISHABLE_KEY,
    jwtTemplateName: process.env.ZUDOKU_PUBLIC_CLERK_JWT_TEMPLATE_NAME,
  },
  apiKeys: {
    enabled: true,
    createKey: async ({ apiKey, context, auth }) => {
      const createApiKeyRequest = new Request(serverUrl + "/v1/developer/api-key", {
        method: "POST",
        body: JSON.stringify({
          ...apiKey,
          email: auth.profile?.email,
          metadata: {
            userId: auth.profile?.sub,
            name: auth.profile?.name,
            subscription_plan: auth.profile?.subscription_plan || "free",
            subscription_status: auth.profile?.subscription_status || "inactive",
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await fetch(
        await context.signRequest(createApiKeyRequest),
      );

      if (!response.ok) {
        throw new Error("Could not create API Key");
      }

      return true;
    },
  },
};

export default config;
