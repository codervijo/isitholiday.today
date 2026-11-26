/** v2.L: WebApplication JSON-LD for the holiday checker (on / and /holiday-checker/). */
export const webAppSchema = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Holiday Checker",
  url,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  description:
    "Check instantly whether today is a public or bank holiday for a chosen country and state or region.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});
