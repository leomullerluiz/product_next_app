export const routes = {
  home: "/",
  about: "/about/",
  dashboard: "/dashboard/",
  examples: "/examples/",
  sentryTest: "/sentry-test/",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];

type QueryValue = string | number | boolean | null | undefined;

export function withQuery(
  path: string,
  params: Record<string, QueryValue> = {},
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}
