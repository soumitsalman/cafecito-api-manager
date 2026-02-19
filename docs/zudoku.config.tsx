import type { ZudokuConfig } from "zudoku";

/**
 * Developer Portal Configuration
 * For more information, see:
 * https://zuplo.com/docs/dev-portal/zudoku/configuration/overview
 */
const config: ZudokuConfig = {
  site: {
    title: "Beans Developer Portal",
    logo: {
      src: {
        light: "/beans.png",
        dark: "/beans.png",
      },
    },
  },
  metadata: {
    title: "Beans API Developer Portal",
    description: "Developer documentation for Beans News & Blogs API",
    favicon: "/beans.png",
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
              file: "api-keys",
            },
            {
              type: "doc",
              file: "beans-api",
            },
          ],
        },
        {
          type: "category",
          label: "Product",
          icon: "coffee",
          items: [
            {
              type: "doc",
              file: "pricing",
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
              file: "about-us",
            },
            {
              type: "doc",
              file: "privacy-policy",
            },
            {
              type: "doc",
              file: "terms-of-use",
            },
          ],
        },
      ],
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
    },
  ],
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "../config/routes.oas.json",
      path: "api",
    },
  ],
  authentication: {
    // IMPORTANT: This is a demo Auth0 configuration.
    // In a real application, you should replace these values with your own
    // identity provider's configuration.
    // This configuration WILL NOT WORK with custom domains.
    // For more information, see:
    // https://zuplo.com/docs/dev-portal/zudoku/configuration/authentication
    type: "auth0",
    domain: "auth.zuplo.site",
    clientId: "f8I87rdsCRo4nU2FHf0fHVwA9P7xi7Ml",
    audience: "https://api.example.com/",
  },
  apiKeys: {
    enabled: true,
  },
};

export default config;
