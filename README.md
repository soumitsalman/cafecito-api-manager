## Cafecito API Gateway and Developer Portal

[Cafecito's](https://cafecito.tech) [API](https://api.cafecito.tech) & MCP gateways and [developer portal](https://developer.cafecito.tech) is hosted on [Zuplo](https://zuplo.com/). 
This was created using [`create-zuplo-api`](https://zuplo.com/docs). This repository is the overarching API manager for **Project Cafecito** products:

- Beans API & MCP (current)
- Cortado API & MCP (future)
- Espresso API & MCP (future)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:9000](http://localhost:9000) with your browser to see the
result.

You can start editing product routes with the OpenAPI files in `config/`:

- `config/beans.oas.json`
- `config/cortado.oas.json`
- `config/latte.oas.json`

The dev server will automatically reload the API with your changes.

## Docs / Developer Portal

Documentation for the Cafecito developer portal lives in the `docs/` folder and is powered by Zudoku.

To run the docs site locally:

```bash
cd docs
npm run dev
```

To build a production version of the portal:

```bash
cd docs
npm run build
```

## Learn More

To learn more about Zuplo, you can visit the
[Zuplo documentation](https://zuplo.com/docs).

To connect with the community join [Discord](https://discord.zuplo.com).
