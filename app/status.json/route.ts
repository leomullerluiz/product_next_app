/**
 * Route handler generated at build time (`output: "export"` supports GET only,
 * and the response cannot depend on the incoming request).
 * Output: /status.json
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: "product-next-app",
    status: "ok",
  });
}
