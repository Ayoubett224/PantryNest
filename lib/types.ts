export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  availability: "in_stock" | "out_of_stock" | "preorder" | "backorder";
  condition: "new" | "used" | "refurbished";
  brand: string;
  mpn?: string;
  gtin?: string;
  image: string;
  category: string;
  itemGroupId?: string;
  sourceUrl?: string;
};
