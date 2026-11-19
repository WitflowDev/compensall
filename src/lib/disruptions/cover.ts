/** Existing blog photos. There is no separate disruption-photo set. */
const COVERS = {
  overbooking: "/assets/blog/overbooking.jpg",
  deniedBoarding: "/assets/blog/denied-boarding.jpg",
  strike: "/assets/blog/airline-strike.jpg",
  connection: "/assets/blog/missed-connection.jpg",
  cancellation: "/assets/blog/flight-cancellation.jpg",
  delay: "/assets/blog/flight-delay.jpg",
} as const;

/**
 * Pick a cover from the story headline, excerpt, and reason.
 * Do not pass the article body: the fixed rights section mentions strikes and cancellations.
 */
export function disruptionCoverForText(text: string): string {
  const haystack = text.toLowerCase();

  if (/\boverbook/.test(haystack)) return COVERS.overbooking;
  if (/denied boarding|\bbumped\b/.test(haystack)) return COVERS.deniedBoarding;
  if (/\bstrike|\bwalkout\b|industrial action/.test(haystack)) return COVERS.strike;
  if (/missed connection/.test(haystack)) return COVERS.connection;
  if (/\bcancell/.test(haystack) || /\bstorm\b/.test(haystack)) return COVERS.cancellation;
  if (/\bdiversion|\bdiverted\b|\bthreat\b/.test(haystack)) return COVERS.connection;
  if (/\bdelay|\boutage\b|\bpower surge\b|network failure/.test(haystack)) return COVERS.delay;

  return COVERS.delay;
}
