export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: "product-next-app",
    status: "ok",
  });
}
