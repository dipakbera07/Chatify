import arcjet, {
    tokenBucket,
    detectBot,
    validateEmail,
} from "@arcjet/next";

export const aj = arcjet({
    key: process.env.ARCJET_KEY,

    rules: [

        // Login rate limiting
        tokenBucket({
            mode: "LIVE",

            characteristics: ["ip.src"],

            // Recover 1 signup attempt
            refillRate: 1,

            // Every 5 minutes
            interval: 300,

            // Maximum 2 registrations
            capacity: 3,
        }),

        validateEmail({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            // block disposable, invalid, and email addresses with no MX records
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});