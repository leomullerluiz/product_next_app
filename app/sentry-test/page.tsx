import type { Metadata } from "next";
import { SentryDsnTestPage } from "@/components/diagnostics/SentryDsnTestPage";

export const metadata: Metadata = {
  title: "Sentry DSN",
};

export default function Page() {
  return <SentryDsnTestPage />;
}
