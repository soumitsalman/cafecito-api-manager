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
    // IMPORTANT: This is a demo Clerk configuration.
    // In a real application, you should replace these values with your own
    // identity provider's configuration.
    // This configuration WILL NOT WORK with custom domains.
    // For more information, see:
    // https://zuplo.com/docs/dev-portal/zudoku/configuration/authentication
    type: "clerk",
    clerkPubKey: "pk_test_YW11c2VkLXdyZW4tMjAuY2xlcmsuYWNjb3VudHMuZGV2JA",
    jwtTemplateName: "dev-portal",
  },
  apiKeys: {
    enabled: true,
    listKeys: true,
    revokeKey: true,

    createKey: async ({ name, metadata = {} }, context) => {
      const userId = context.auth?.userId;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      const claims = context.auth?.claims || {};
      return {
        name: name || `Key for ${claims.email || userId}`,
        metadata: {
          ...metadata,
          clerkUserId: userId,
          subscriptionPlan: claims.subscription_plan || "free",
          createdAt: new Date().toISOString(),
        },
      };
    },
  },
};

export default config;
