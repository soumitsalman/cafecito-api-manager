import React from "react";

const serverUrl = process.env.ZUDOKU_PUBLIC_GATEWAY_URL || (import.meta as any).env?.ZUDOKU_PUBLIC_GATEWAY_URL || "";

type CurlProps = { path: string; method?: string; query?: string;};

export function Curl({ path, method = "GET", query = ""}: CurlProps) {
  const url = `${serverUrl}${path}${query ? (path.includes("?") ? "&" : "?") + query : ""}`;
  const text = `${method} "${url}" \\` + "\n  -H \"Authorization: Bearer YOUR-API-KEY\"";
  return (
    <pre>
      <code>{text}</code>
    </pre>
  );
}

export function BaseUrl() {
  return <>{serverUrl}</>;
}

export default Curl;
