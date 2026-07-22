import Link from "next/link";
import { ArrowRight, BadgePercent, ShieldCheck, Sparkles, Truck } from "lucide-react";

const showcaseItems = [
  {
    title: "Pharmacy essentials",
    subtitle: "Authentic medicines, OTC care and daily health support.",
    href: "/medicine",
    badge: "Medicine",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&h=640&q=90",
  },
  {
    title: "Beauty routine",
    subtitle: "Skincare, makeup and grooming products from loved brands.",
    href: "/beauty",
    badge: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&h=640&q=90",
  },
  {
    title: "Healthcare devices",
    subtitle: "Family wellness, devices, first aid and safety products.",
    href: "/healthcare",
    badge: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&h=640&q=90",
  },
  {
    title: "Baby & mom care",
    subtitle: "Gentle diapers, wipes, feeding and mother care essentials.",
    href: "/baby-mom-care",
    badge: "Baby care",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&h=640&q=90",
  },
  {
    title: "Supplements",
    subtitle: "Vitamins, minerals and fitness nutrition in one place.",
    href: "/supplement",
    badge: "Wellness",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&h=640&q=90",
  },
  {
    title: "Home & hygiene",
    subtitle: "Cleaning, sanitizing and everyday home-care supplies.",
    href: "/home-care",
    badge: "Home care",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&h=640&q=90",
  },
  {
    title: "Pet care",
    subtitle: "Food, grooming and veterinary support for happier pets.",
    href: "/pet-care",
    badge: "Pet care",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&h=640&q=90",
  },
];

export default function EcommerceImageShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`ecommerce-showcase ${compact ? "is-compact" : ""}`} aria-labelledby="ecommerce-showcase-title">
      <div className="ecommerce-showcase__shell">
        <header className="ecommerce-showcase__header">
          <div>
            <span><Sparkles size={15} /> Real ecommerce dashboard</span>
            <h2 id="ecommerce-showcase-title">Shop by real product moments</h2>
            <p>Seven visual shopping entry points with meaningful healthcare-commerce categories, fast actions and real product imagery.</p>
          </div>
          <Link href="/store">Explore store <ArrowRight size={16} /></Link>
        </header>

        <div className="ecommerce-showcase__grid">
          {showcaseItems.map((item, index) => (
            <Link href={item.href} key={item.title} className={`ecommerce-showcase__card card-${index + 1}`}>
              <img src={item.image} alt={`${item.title} ecommerce category`} loading={index < 2 ? "eager" : "lazy"} />
              <span className="ecommerce-showcase__shade" />
              <span className="ecommerce-showcase__badge"><BadgePercent size={13} />{item.badge}</span>
              <span className="ecommerce-showcase__copy">
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
                <em><Truck size={13} /> Fast delivery <ShieldCheck size={13} /> Trusted</em>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .ecommerce-showcase{padding:34px 0;background:linear-gradient(180deg,#fff,#f7fffd);overflow:hidden}.ecommerce-showcase__shell{width:min(1440px,calc(100% - 48px));margin:0 auto}.ecommerce-showcase__header{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}.ecommerce-showcase__header span{display:inline-flex;align-items:center;gap:7px;border:1px solid #bfe9e3;border-radius:999px;background:#ecfaf7;color:#087b75;padding:8px 11px;font-size:12px;font-weight:900}.ecommerce-showcase__header h2{margin:10px 0 8px;font-size:clamp(30px,4vw,54px);line-height:.98;letter-spacing:-.06em;color:#101828}.ecommerce-showcase__header p{margin:0;max-width:700px;color:#667085;font-size:14px;line-height:1.65}.ecommerce-showcase__header a{display:inline-flex;align-items:center;gap:8px;min-height:42px;border-radius:14px;background:#087b75;color:#fff;text-decoration:none;padding:0 15px;font-size:13px;font-weight:950;box-shadow:0 20px 46px -34px rgba(8,123,117,.9);transition:.18s ease}.ecommerce-showcase__header a:hover{transform:translateY(-2px);background:#066a65}.ecommerce-showcase__grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;grid-auto-rows:184px;gap:14px}.ecommerce-showcase__card{position:relative;overflow:hidden;border-radius:26px;background:#eaf4f2;color:#fff;text-decoration:none;box-shadow:0 28px 70px -54px rgba(15,23,42,.8);isolation:isolate;transition:.2s ease}.ecommerce-showcase__card:hover{transform:translateY(-4px);box-shadow:0 34px 84px -55px rgba(8,123,117,.85)}.ecommerce-showcase__card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .65s cubic-bezier(.16,1,.3,1),filter .2s ease}.ecommerce-showcase__card:hover img{transform:scale(1.055);filter:saturate(1.07)}.ecommerce-showcase__shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(3,13,20,.74));z-index:1}.ecommerce-showcase__badge{position:absolute;left:14px;top:14px;z-index:2;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.34);border-radius:999px;background:rgba(255,255,255,.22);backdrop-filter:blur(10px);padding:7px 9px;font-size:11px;font-weight:950}.ecommerce-showcase__copy{position:absolute;left:16px;right:16px;bottom:15px;z-index:2;display:grid;gap:5px}.ecommerce-showcase__copy strong{font-size:20px;letter-spacing:-.04em}.ecommerce-showcase__copy small{max-width:360px;color:rgba(255,255,255,.86);font-size:12px;line-height:1.45}.ecommerce-showcase__copy em{display:flex;align-items:center;gap:6px;color:#d8fff8;font-size:11px;font-style:normal;font-weight:900}.ecommerce-showcase__card.card-1{grid-row:span 2}.ecommerce-showcase__card.card-2,.ecommerce-showcase__card.card-5{grid-column:span 2}.is-compact .ecommerce-showcase__grid{grid-auto-rows:160px}.is-compact .ecommerce-showcase__header h2{font-size:clamp(28px,3vw,44px)}@media(max-width:1080px){.ecommerce-showcase__grid{grid-template-columns:repeat(2,1fr)}.ecommerce-showcase__card.card-1,.ecommerce-showcase__card.card-2,.ecommerce-showcase__card.card-5{grid-column:auto;grid-row:auto}}@media(max-width:720px){.ecommerce-showcase{padding:24px 0}.ecommerce-showcase__shell{width:calc(100% - 22px)}.ecommerce-showcase__header{display:grid}.ecommerce-showcase__grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px}.ecommerce-showcase__card{min-width:82%;height:260px;scroll-snap-align:start}.ecommerce-showcase__header h2{font-size:32px}}
      `}</style>
    </section>
  );
}
