import fs from "node:fs";
import path from "node:path";

const envPath=path.resolve(".env.local");
if(fs.existsSync(envPath)){
  for(const raw of fs.readFileSync(envPath,"utf8").split(/\r?\n/)){
    const line=raw.trim(); if(!line||line.startsWith("#")||!line.includes("=")) continue;
    const [key,...rest]=line.split("="); let value=rest.join("=").trim();
    if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'"))) value=value.slice(1,-1);
    if(!process.env[key.trim()]) process.env[key.trim()]=value;
  }
}
const required=["NEXT_PUBLIC_STORE_NAME","NEXT_PUBLIC_LEGAL_BUSINESS_NAME","NEXT_PUBLIC_STORE_URL","NEXT_PUBLIC_SUPPORT_EMAIL","NEXT_PUBLIC_SUPPORT_PHONE","NEXT_PUBLIC_BUSINESS_ADDRESS","NEXT_PUBLIC_COUNTRY","NEXT_PUBLIC_CURRENCY","NEXT_PUBLIC_SHIPPING_MIN_DAYS","NEXT_PUBLIC_SHIPPING_MAX_DAYS","NEXT_PUBLIC_SHIPPING_FEE","NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD","NEXT_PUBLIC_RETURN_DAYS","NEXT_PUBLIC_RETURN_ADDRESS"];
const errors=[];
for(const key of required){const value=(process.env[key]||"").trim(); if(!value) errors.push(`${key} is missing`); if(/your |demo|example\.com|555 555/i.test(value)) errors.push(`${key} still looks like placeholder/demo data`)}
const url=process.env.NEXT_PUBLIC_STORE_URL||"";if(!url.startsWith("https://")) errors.push("NEXT_PUBLIC_STORE_URL must use HTTPS for production checkout.");
const products=JSON.parse(fs.readFileSync(path.resolve("data/products.json"),"utf8"));
if(!Array.isArray(products)||products.length===0) errors.push("Product catalog is empty.");
const ids=new Set(), slugs=new Set();
for(const p of products){
  const label=p.slug||p.id;
  if(String(p.id).startsWith("demo-")||/demo/i.test(String(p.brand))) errors.push(`Product ${label} is still demo content.`);
  if(!p.title||!p.description||!p.image||!p.price||!p.currency||!p.availability||!p.condition||!p.brand) errors.push(`Product ${label} is missing a required catalog field.`);
  if(!(Number(p.price)>0)) errors.push(`Product ${label} has an invalid price.`);
  if(process.env.NEXT_PUBLIC_CURRENCY && p.currency!==process.env.NEXT_PUBLIC_CURRENCY) errors.push(`Product ${label} currency does not match NEXT_PUBLIC_CURRENCY.`);
  try {
    const imagePath = /^https?:\/\//i.test(String(p.image)) ? new URL(String(p.image)).pathname : String(p.image);
    if(!/\.(?:jpe?g|png|webp|gif|bmp|tiff?)$/i.test(imagePath)) errors.push(`Product ${label} image must use a Merchant Center supported format (JPEG, PNG, WebP, GIF, BMP or TIFF).`);
  } catch { errors.push(`Product ${label} has an invalid image URL.`); }
  if(p.brand && p.brand.toLowerCase() !== "unbranded" && !p.gtin && !p.mpn) errors.push(`Product ${label} is branded but GTIN/MPN is still missing. Add verified identifiers before GMC submission.`);
  if(ids.has(p.id)) errors.push(`Duplicate product id: ${p.id}`); ids.add(p.id);
  if(slugs.has(p.slug)) errors.push(`Duplicate product slug: ${p.slug}`); slugs.add(p.slug);
}
if(errors.length){console.error("\nGMC PRE-PRODUCTION AUDIT FAILED\n"+errors.map(e=>`- ${e}`).join("\n")+"\n\nFix these items before npm run build. This guard intentionally prevents deploying placeholder business/product data.\n");process.exit(1)}
console.log("GMC pre-production audit passed. This is a technical checklist, not a guarantee of Google approval.");
