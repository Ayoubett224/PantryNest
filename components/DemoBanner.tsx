import { isDemo } from "@/lib/store";

export default function DemoBanner() {
  if (!isDemo) return null;
  return (
    <div className="demo-banner">
      SETUP MODE — PantryNest branding is applied. Add the legal business name, confirmed production domain, and return address before GMC review.
    </div>
  );
}
