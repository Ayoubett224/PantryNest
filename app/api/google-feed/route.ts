import { products } from "@/lib/products";
import { absoluteImageUrl, store } from "@/lib/store";
import { xmlEscape as x } from "@/lib/gmc";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = products.map((p) => {
    const identifiers = [
      p.gtin ? `<g:gtin>${x(p.gtin)}</g:gtin>` : "",
      p.mpn ? `<g:mpn>${x(p.mpn)}</g:mpn>` : "",
      p.itemGroupId ? `<g:item_group_id>${x(p.itemGroupId)}</g:item_group_id>` : "",
    ].join("");

    return `<item><g:id>${x(p.id)}</g:id><title>${x(p.title)}</title><description>${x(p.description)}</description><link>${x(`${store.url}/product/${p.slug}`)}</link><g:image_link>${x(absoluteImageUrl(p.image))}</g:image_link><g:availability>${x(p.availability)}</g:availability><g:price>${x(p.price.toFixed(2))} ${x(p.currency)}</g:price><g:condition>${x(p.condition)}</g:condition><g:brand>${x(p.brand)}</g:brand>${identifiers}</item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel><title>${x(store.name)}</title><link>${x(store.url)}</link><description>${x(store.description)}</description>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
