# GMC-ready Next.js Store Starter

A self-hostable Next.js 16.3 storefront built to avoid common Merchant Center website problems: missing contact details, hidden policies, inconsistent product data, broken purchase flow, and placeholder content.

## What is included
- App Router storefront and product pages
- Cart and functional Cash on Delivery checkout
- Order storage to NDJSON for a self-hosted Node/VPS deployment
- Contact form storage
- About, Contact, FAQ, Shipping, Returns & Refunds, Privacy, Terms pages
- Product schema.org JSON-LD with price, currency, condition and availability
- Google Merchant RSS/XML feed at `/api/google-feed`
- `sitemap.xml` and `robots.txt`
- Production audit that intentionally blocks `npm run build` while demo business details/products remain

## Setup
1. Install Node.js 20.9+.
   - Security note (Aug 25, 2026): Next.js announced a critical-severity security patch for the 16.3 line scheduled for Aug 26, 2026. Before any public production deployment, update `next`/`eslint-config-next` to the patched 16.3.x release once published.
2. Copy `.env.example` to `.env.local`.
3. Replace **every** business field with your real, verifiable details. Keep them identical to Merchant Center.
4. Replace `data/products.json` with products you actually sell and can deliver. Use real titles, descriptions, prices, stock, brand, identifiers, and product images.
5. Put genuine product images in `public/products/` (Google accepts JPEG, PNG, WebP, GIF, BMP and TIFF product images; use genuine, crawlable product photos and verify current size rules before submission).
6. Run `npm install` then `npm run dev`.
7. When the real data is ready, run `npm run gmc:audit` and fix every failure, then `npm run build`.

## Production notes
This checkout uses Cash on Delivery, which Google lists as a conventional payment method. Orders are appended to `data/orders.ndjson`; deploy on a persistent VPS/filesystem or replace this with your database before production. Do not deploy this exact demo catalog to Merchant Center.

Your actual operations must match the site. If you promise 3–7 business-day delivery, 30-day returns, a specific return address, or a price, those details need to be true and must match Merchant Center settings/feed data.

Google approval cannot be guaranteed by code alone. Merchant Center may review the website, account/business identity, domain, products, third-party information, and fulfillment practices.

## Before requesting a Merchant Center review
- Verify and claim the exact HTTPS domain in Merchant Center.
- Make website business name, legal name/address/phone/email, Merchant Center business info, and verification documents consistent.
- Configure Merchant Center shipping and returns to match this website exactly.
- Submit only products that are actually available and deliverable.
- Confirm landing-page price, availability and condition match the feed and JSON-LD.
- Test add-to-cart and the complete checkout on mobile and desktop.
- Remove all demo content, unsupported product images, dead links, fake reviews, fake trust badges, and unverifiable claims.
- Test `/api/google-feed`, `/sitemap.xml`, and product structured data before connecting the feed.
