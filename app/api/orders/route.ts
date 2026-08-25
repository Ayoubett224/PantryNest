import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { products } from "@/lib/products";
import { store } from "@/lib/store";

const clean=(v:unknown,max=180)=>typeof v==="string"?v.trim().slice(0,max):"";
export async function POST(request:Request){
  try{
    const body=await request.json(); const c=body?.customer||{}; const rawItems=Array.isArray(body?.items)?body.items:[];
    const customer={name:clean(c.name),email:clean(c.email),phone:clean(c.phone),country:clean(c.country),address:clean(c.address),city:clean(c.city),region:clean(c.region),postalCode:clean(c.postalCode)};
    if(!customer.name||!customer.email.includes("@")||!customer.phone||!customer.address||!customer.city||!customer.postalCode||c.termsAccepted!=="yes") return NextResponse.json({error:"Please complete all required checkout fields and accept the terms."},{status:400});
    if(!rawItems.length) return NextResponse.json({error:"Your cart is empty."},{status:400});
    const normalized=rawItems.map((i:any)=>{const p=products.find(x=>x.id===clean(i.id,80));const quantity=Math.max(1,Math.min(10,Number(i.quantity)||1)); if(!p||p.availability!=="in_stock") throw new Error("INVALID_ITEM"); return {id:p.id,title:p.title,quantity,unitPrice:p.price,currency:p.currency,lineTotal:Number((p.price*quantity).toFixed(2))}});
    const subtotal=Number(normalized.reduce((s:number,i:any)=>s+i.lineTotal,0).toFixed(2)); const shipping=subtotal>=store.freeShippingThreshold?0:store.shippingFee; const total=Number((subtotal+shipping).toFixed(2));
    const orderId=`ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
    const record={orderId,createdAt:new Date().toISOString(),customer,items:normalized,subtotal,shipping,total,currency:store.currency,paymentMethod:"cash_on_delivery",status:"received"};
    const path=process.env.ORDER_STORAGE_PATH||"./data/orders.ndjson"; await mkdir(dirname(path),{recursive:true}); await appendFile(path,JSON.stringify(record)+"\n","utf8");
    return NextResponse.json({ok:true,orderId,total,currency:store.currency});
  }catch(error){if(error instanceof Error&&error.message==="INVALID_ITEM") return NextResponse.json({error:"One or more products are unavailable."},{status:400}); console.error(error);return NextResponse.json({error:"Order could not be saved. Contact support before retrying."},{status:500})}
}
