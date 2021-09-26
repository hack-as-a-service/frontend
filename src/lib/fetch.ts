import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

export default async function fetchApi(url: string, init?: RequestInit) {
  const r = await fetch(process.env.NEXT_PUBLIC_API_BASE + url, {
    credentials: "include",
    ...init,
  });
  if (!r.ok) {
    throw { url, resp: r };
  }

  return await r.json();
}

// This function properly forwards headers when performing an SSR request
export async function fetchSSR(
  url: string,
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
  init?: RequestInit
) {
  return await fetchApi(url, {
    headers: ctx.req.headers as HeadersInit,
    ...init,
  });
}
