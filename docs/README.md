# Developer Portal

This is your
[Zuplo Developer Portal](https://zuplo.com/docs/dev-portal/introduction). This
developer portal allows you to ship a beautiful API documentation for your
users. You can customize this portal to match your brand and style.

This developer portal is configured to work with your Zuplo API. When you
publish your API, your developer portal will be automatically published with the
latest API documentation.

For more information, visit the
[Documentation](https://zuplo.com/docs/dev-portal/introduction).

The Zuplo Developer Portal is built on top of the open source
[Zudoku](https://zudoku.dev) project, a powerful tool for creating and managing
API documentation. If you would like to learn more about the project, open a
feature request, or contribute to the codebase, visit the
[Zudoku GitHub repository](https://github.com/zuplo/zudoku).

## Local Development

After you have connected your Zuplo project to
[source control](https://zuplo.com/docs/articles/source-control) you can clone
your project locally. Running the Developer Portal locally allows you to see
changes in real-time with live-reload.

1. Clone the repository

   ```bash
   git clone https://github.com/my-org/my-repo
   cd my-repo
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run docs
   ```

## Clerk auth notes (API key creation)

If API key `createKey` is not being invoked, the user is typically not authenticated in the portal.

Set these environment variables before starting docs:

- `ZUDOKU_PUBLIC_CLERK_PUBLISHABLE_KEY` (preferred)
- `ZUDOKU_PUBLIC_CLERK_JWT_TEMPLATE_NAME` (preferred, default: `dev-portal`)
- `CLERK_PUBLISHABLE_KEY` and `CLERK_JWT_TEMPLATE_NAME` are also supported as fallback names.
- `ZUDOKU_FAIL_ON_DEMO_CLERK_KEY` (default: `true`) fails fast in non-production if the demo key is still in use.

In Clerk, ensure your application allows the Developer Portal callback URL:

- Local: `http://localhost:3000/oauth/callback`
- Hosted: `https://<your-docs-domain>/oauth/callback`

Also ensure the JWT template name in Clerk matches `CLERK_JWT_TEMPLATE_NAME`.
