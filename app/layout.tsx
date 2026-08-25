import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";
import { StoreProvider } from "@/components/StoreProvider";
import { businessDisplayName, store } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: { default: store.name, template: `%s | ${store.name}` },
  description: store.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessDisplayName,
    url: store.url,
    email: store.email,
    telephone: store.phone,
    address: { "@type": "PostalAddress", streetAddress: store.address, addressCountry: store.country }
  };
  return <html lang="en"><body>
    <StoreProvider>
      <DemoBanner />
      <Header />
      <main>{children}</main>
      <Footer />
    </StoreProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(org)}} />
  </body></html>;
}
