// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    tracesSampleRate: Number(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0,
    ),
    enableLogs: process.env.NODE_ENV !== "production",

    // Define how likely Replay events are sampled.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    dataCollection: {
      // To disable sending user data and HTTP bodies, uncomment the lines below.
      // userInfo: false,
      // httpBodies: [],
    },
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
