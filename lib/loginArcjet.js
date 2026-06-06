import arcjet, {
  tokenBucket,
  detectBot,
} from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,

  rules: [

    // Login rate limiting
    tokenBucket({
      mode: "LIVE",

      // Track by IP address
      characteristics: ["ip.src"],

      // Recover 1 attempt
      refillRate: 1,

      // Every 60 seconds
      interval: 60,

      // Max 3 login attempts
      capacity: 3,
    }),

  ],
});