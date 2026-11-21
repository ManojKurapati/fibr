/** True on the static GitHub Pages build, where there is no server for /api routes. */
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
/** Optional: where static-site booking requests are sent by email. */
export const BOOKING_EMAIL = process.env.NEXT_PUBLIC_BOOKING_EMAIL ?? "";
