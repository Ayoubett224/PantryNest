const env = (name: string, fallback: string) => process.env[name] || fallback;

export const store = {
  name: env("NEXT_PUBLIC_STORE_NAME", "PantryNest"),
  legalName: env("NEXT_PUBLIC_LEGAL_BUSINESS_NAME", ""),
  url: env("NEXT_PUBLIC_STORE_URL", "http://localhost:3000").replace(/\/$/, ""),
  email: env("NEXT_PUBLIC_SUPPORT_EMAIL", "contact@PantryNest.app"),
  phone: env("NEXT_PUBLIC_SUPPORT_PHONE", "+1 336 763 6372"),
  address: env("NEXT_PUBLIC_BUSINESS_ADDRESS", "909 W Grace St, Richmond, VA 23220, USA"),
  country: env("NEXT_PUBLIC_COUNTRY", "US"),
  currency: env("NEXT_PUBLIC_CURRENCY", "USD"),
  description: env(
    "NEXT_PUBLIC_STORE_DESCRIPTION",
    "Smart kitchen and pantry organization essentials for a cleaner, simpler home."
  ),
  shippingMinDays: Number(env("NEXT_PUBLIC_SHIPPING_MIN_DAYS", "3")),
  shippingMaxDays: Number(env("NEXT_PUBLIC_SHIPPING_MAX_DAYS", "7")),
  shippingFee: Number(env("NEXT_PUBLIC_SHIPPING_FEE", "4.95")),
  freeShippingThreshold: Number(env("NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD", "75")),
  returnDays: Number(env("NEXT_PUBLIC_RETURN_DAYS", "30")),
  returnAddress: env("NEXT_PUBLIC_RETURN_ADDRESS", ""),
};

export const businessDisplayName = store.legalName || store.name;

export const money = (value: number, currency = store.currency) =>
  new Intl.NumberFormat("en", { style: "currency", currency }).format(value);

export const isDemo =
  !store.legalName ||
  !store.returnAddress ||
  store.url.includes("localhost") ||
  store.name.toLowerCase().includes("demo") ||
  store.email.includes("example.com") ||
  store.address.toLowerCase().includes("demo");

export const absoluteImageUrl = (image: string) =>
  /^https?:\/\//i.test(image) ? image : `${store.url}${image.startsWith("/") ? image : `/${image}`}`;
