import data from "@/data/products.json";
import type { Product } from "@/lib/types";

export const products = data as Product[];
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
