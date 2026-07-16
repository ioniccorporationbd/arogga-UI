import Link from "next/link";
import type { ReactNode } from "react";

type SeoLinkProps = {
  href: string;
  children: ReactNode;
};

type ContentBlockProps = {
  number: string;
  title: string;
  children: ReactNode;
};

type FaqItemProps = {
  question: string;
  children: ReactNode;
};

const orderSteps = [
  {
    number: "01",
    title: "Search",
    description: (
      <>
        Locate your required treatment instantly by typing the specific brand
        name, generic salt formulation, or pharmaceutical manufacturer. Review
        the real-time online medicine price in Bangladesh before adding items
        to your virtual cart, ensuring absolute billing transparency.
      </>
    ),
  },
  {
    number: "02",
    title: "Upload Prescription",
    description: (
      <>
        Upload a clear photo of your doctor&apos;s official prescription
        directly through the website or mobile application. Our licensed
        pharmacist team reviews the document to confirm dosage, identify
        possible drug interactions, and authorize the medicine order.
      </>
    ),
  },
  {
    number: "03",
    title: "Get Home Delivery",
    description: (
      <>
        Receive prompt and reliable medicine home delivery across Bangladesh.
        Same-day delivery is available in selected Dhaka areas, while orders
        outside Dhaka are delivered through our nationwide logistics network.
      </>
    ),
  },
];

export default function SeoContentSection() {
  return (
    <section
      aria-labelledby="seo-content-title"
      className="relative isolate w-full overflow-hidden bg-[#f8fbfa] py-10 sm:py-12 lg:py-14 xl:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 top-10 -z-10 h-80 w-80 rounded-full bg-[#dff7f2]/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-10 -z-10 h-80 w-80 rounded-full bg-[#fff0d9]/70 blur-3xl"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <article className="overflow-hidden rounded-[18px] border border-[#dfe8e6] bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.38)]">
          <header className="relative overflow-hidden border-b border-[#e7eeec] bg-gradient-to-br from-[#f4fcfa] via-white to-[#fffaf2] px-5 py-7 sm:px-7 sm:py-8 md:px-8 lg:px-10 lg:py-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[28px] border-white/70"
            />

            <div className="relative z-10 max-w-[1000px]">
              <span className="inline-flex min-h-9 items-center rounded-full border border-[#cde7e3] bg-white/90 px-4 text-[13px] font-bold uppercase tracking-[0.14em] text-[#087b75] shadow-sm">
                Trusted Digital Healthcare
              </span>

              <h2
                id="seo-content-title"
                className="mt-4 max-w-[920px] text-[20px] font-extrabold leading-[1.4] tracking-[-0.025em] text-[#1d2939]"
              >
                Bangladesh&apos;s Most Trusted Online Pharmacy for Medicine,
                Beauty &amp; Healthcare Products
              </h2>

              <p className="mt-4 max-w-[900px] text-[16px] leading-7 text-[#52606d]">
                Safe, authentic and professionally managed healthcare products
                delivered through a convenient digital platform.
              </p>
            </div>
          </header>

          <div className="px-5 py-7 sm:px-7 sm:py-8 md:px-8 lg:px-10 lg:py-10">
            <div className="space-y-5 text-[13px] leading-7 text-[#475467]">
              <p>
                Accessing safe, authentic medical care shouldn&apos;t be a
                complex chore. Arogga simplifies your wellness journey by
                serving as a comprehensive, digitally managed healthcare
                repository. Every item in our catalog is systematically
                organized, continuously updated for batch accuracy, and
                monitored under stringent pharmacy regulations to support
                reliable product availability.
              </p>

              <p>
                Arogga organizes its healthcare ecosystem into specialized,
                easy-to-navigate e-commerce categories. Our foundational
                Medicine department carries a comprehensive inventory of
                prescription medicines, acute treatments, and everyday OTC
                solutions, systematically mapped by brand name and generic
                molecular entity to make your online medicine order simple.
              </p>

              <p>
                Our Healthcare catalog offers surgical supplies, personal
                hygiene products and home medical devices such as glucometers
                and blood pressure monitors. Beyond clinical treatments, our{" "}
                <SeoLink href="/beauty">Beauty Product</SeoLink> section
                features premium skincare, hair treatments and dermo-cosmetics
                sourced through verified supply channels. Our{" "}
                <SeoLink href="/sexual-wellness">
                  Sexual Wellness products
                </SeoLink>{" "}
                provide discreet access to reproductive health products,
                contraceptives and personal wellness items.
              </p>

              <p>
                We support growing families through our{" "}
                <SeoLink href="/baby-mom-care">Baby &amp; Mom Care</SeoLink>{" "}
                section, which includes infant nutrition products, pediatric
                care essentials and maternal health products.
              </p>

              <p>
                Dedicated to holistic and lifestyle wellness, Arogga balances
                modern science with traditional care. Our{" "}
                <SeoLink href="/herbal">Herbal</SeoLink> and{" "}
                <SeoLink href="/homeopathy">Homeopathy products</SeoLink>{" "}
                include natural wellness formulations and quality-assured
                remedies sourced from regulated manufacturers. Our{" "}
                <SeoLink href="/supplement">Supplement</SeoLink> and{" "}
                <SeoLink href="/food-and-nutrition">
                  Food and Nutrition
                </SeoLink>{" "}
                categories feature multivitamins, minerals, proteins, dietary
                products and clinical nutritional solutions.
              </p>

              <p>
                We also help maintain a safer home environment through{" "}
                <SeoLink href="/home-care">Home Care</SeoLink> disinfectants,
                sanitizers and household wellness products. Our{" "}
                <SeoLink href="/pet-care">Pet Care</SeoLink> and{" "}
                <SeoLink href="/veterinary">Veterinary categories</SeoLink>{" "}
                offer animal healthcare products, maintenance supplies and
                specialized veterinary solutions.
              </p>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#dfe8e6] to-transparent" />

            <div className="space-y-5 text-[13px] leading-7 text-[#475467]">
              <p>
                Customers can also explore the platform according to medical
                intent and health concern. Under{" "}
                <SeoLink href="/vital-organs">Vital Organs</SeoLink>, Arogga
                offers targeted wellness products designed to support cardiac,
                hepatic, renal and metabolic health. Our{" "}
                <SeoLink href="/life-style-package">
                  Life Style Packages
                </SeoLink>{" "}
                are designed around modern health concerns such as stress,
                hypertension and sedentary living.
              </p>

              <p>
                We support gender-specific preventative care through{" "}
                <SeoLink href="/checkups-for-women">
                  Checkups for Women
                </SeoLink>{" "}
                and{" "}
                <SeoLink href="/checkups-for-men">Checkups for Men</SeoLink>.
                This healthcare ecosystem is connected through three major
                service areas: the{" "}
                <SeoLink href="/store">e-commerce online Store</SeoLink>, where
                customers can search and buy{" "}
                <SeoLink href="/medicine">
                  medicine online in Bangladesh
                </SeoLink>
                ; the <SeoLink href="/lab">Online Lab Test</SeoLink>, which
                supports home sample collection and digital reports; and{" "}
                <SeoLink href="/doctor">Doctor Consultation</SeoLink>, which
                connects users with qualified medical professionals.
              </p>
            </div>

            <section
              aria-labelledby="medicine-order-steps"
              className="mt-10 rounded-[16px] border border-[#dce9e6] bg-[#f8fcfb] p-5 sm:p-6 lg:p-7"
            >
              <div className="max-w-[820px]">
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#087b75]">
                  Simple ordering process
                </p>

                <h3
                  id="medicine-order-steps"
                  className="mt-2 text-[18px] font-extrabold leading-7 tracking-[-0.02em] text-[#26364d]"
                >
                  Order Medicine Online in 3 Easy Steps
                </h3>

                <p className="mt-3 text-[13px] leading-7 text-[#52606d]">
                  Our digital procurement system removes unnecessary
                  complications, allowing customers to place medicine orders
                  securely from any location.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {orderSteps.map((step) => (
                  <article
                    key={step.number}
                    className="group rounded-[14px] border border-[#dfe8e6] bg-white p-5 shadow-[0_14px_35px_-28px_rgba(15,23,42,0.42)] transition duration-300 hover:-translate-y-1 hover:border-[#afd8d2] hover:shadow-[0_20px_45px_-26px_rgba(8,123,117,0.32)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#087b75] text-[13px] font-extrabold text-white shadow-md">
                        {step.number}
                      </span>

                      <span className="h-px flex-1 bg-gradient-to-r from-[#bee1dc] to-transparent" />
                    </div>

                    <h4 className="mt-5 text-[16px] font-extrabold leading-6 text-[#26364d]">
                      {step.title}
                    </h4>

                    <p className="mt-2 text-[13px] leading-7 text-[#52606d]">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="why-arogga"
              className="mt-10"
            >
              <div className="max-w-[850px]">
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#087b75]">
                  Professional healthcare service
                </p>

                <h3
                  id="why-arogga"
                  className="mt-2 text-[18px] font-extrabold leading-7 tracking-[-0.02em] text-[#26364d]"
                >
                  Why Arogga is Bangladesh&apos;s Best Online Medicine Shop
                </h3>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <ContentBlock number="01" title="100% Authentic Medicines">
                  Patient safety is the foundation of our operations. Arogga
                  sources medicine through licensed pharmaceutical
                  manufacturers and authorized distributors. Our inventory
                  management processes are designed to minimize the risk of
                  substandard or counterfeit products.
                </ContentBlock>

                <ContentBlock number="02" title="Licensed Pharmacist Team">
                  Every online medicine order is processed through an internal
                  clinical review layer managed by trained pharmacy
                  professionals. The team reviews prescriptions, supports
                  customer questions and checks dosage information before
                  dispatch.
                </ContentBlock>

                <ContentBlock number="03" title="Fast Medicine Home Delivery">
                  Arogga operates a logistics network designed to provide fast
                  medicine delivery in Dhaka and nationwide delivery across
                  Bangladesh. Temperature-sensitive products can be transported
                  using suitable insulated packaging.
                </ContentBlock>

                <ContentBlock number="04" title="Widest Product Range">
                  From everyday OTC medicines and personal care products to
                  chronic care treatments, surgical supplies, supplements and
                  herbal products, Arogga provides a broad healthcare catalog
                  through one platform.
                </ContentBlock>

                <ContentBlock number="05" title="Secure & Flexible Payment">
                  Customers can complete purchases through supported digital
                  payment channels, cards and cash on delivery. Secure
                  processing and responsible handling of personal information
                  help provide a more reliable checkout experience.
                </ContentBlock>

                <ContentBlock number="06" title="Easy Returns & Support">
                  When an eligible product arrives damaged or an order does not
                  match the confirmed purchase, customers can contact the
                  support team for assistance according to the applicable
                  return and refund policy.
                </ContentBlock>

                <ContentBlock
                  number="07"
                  title="Order Medicine Anytime Through the Arogga App"
                >
                  The Arogga mobile experience allows customers to search for
                  products, review prices, upload prescriptions, monitor
                  medicine orders and manage healthcare purchases through a
                  convenient digital interface.
                </ContentBlock>
              </div>
            </section>

            <section
              aria-labelledby="medicine-order-faq"
              className="mt-10 rounded-[16px] border border-[#e2e8e6] bg-[#fcfdfd] p-5 sm:p-6 lg:p-7"
            >
              <div className="max-w-[850px]">
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#087b75]">
                  Frequently asked questions
                </p>

                <h3
                  id="medicine-order-faq"
                  className="mt-2 text-[18px] font-extrabold leading-7 tracking-[-0.02em] text-[#26364d]"
                >
                  Frequently Asked Questions About Online Medicine Ordering
                </h3>
              </div>

              <div className="mt-6 space-y-3">
                <FaqItem question="Is Arogga a licensed online pharmacy in Bangladesh?">
                  Arogga operates as a digital healthcare and pharmacy platform
                  and manages medicinal products through applicable pharmacy,
                  sourcing and operational requirements.
                </FaqItem>

                <FaqItem question="How do I order medicine online from Arogga?">
                  Search for the medicine using its brand or generic name, add
                  the required item to your cart and proceed to checkout.
                  Upload a prescription when the selected product requires
                  pharmacist verification.
                </FaqItem>

                <FaqItem question="Do I need a prescription to buy medicine online in Bangladesh?">
                  Prescription-only medicines require a valid doctor&apos;s
                  prescription. Standard OTC products, supplements and many
                  personal care products can generally be purchased without
                  uploading a prescription.
                </FaqItem>

                <FaqItem question="How fast is medicine home delivery in Dhaka?">
                  Delivery time depends on product availability, order time,
                  delivery area and operational capacity. Selected locations
                  may receive same-day or expedited delivery.
                </FaqItem>

                <FaqItem question="Are the medicines on Arogga authentic?">
                  Arogga follows controlled sourcing and inventory procedures
                  intended to provide authentic healthcare products from
                  licensed manufacturers and approved supply partners.
                </FaqItem>

                <FaqItem question="What is the online medicine price in Bangladesh on Arogga?">
                  Product pages display the applicable selling price, available
                  discounts and relevant pricing information so customers can
                  review the cost before placing an order.
                </FaqItem>

                <FaqItem question="Does Arogga deliver medicine outside Dhaka?">
                  Delivery is available across supported locations in
                  Bangladesh. Delivery time and service availability may vary
                  according to the destination and selected product.
                </FaqItem>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}

function ContentBlock({
  number,
  title,
  children,
}: ContentBlockProps) {
  return (
    <article className="group relative overflow-hidden rounded-[14px] border border-[#e0e7e5] bg-white p-5 shadow-[0_12px_32px_-27px_rgba(15,23,42,0.38)] transition duration-300 hover:-translate-y-1 hover:border-[#b8dcd7] hover:shadow-[0_22px_46px_-28px_rgba(8,123,117,0.28)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#eaf8f5] transition-transform duration-500 group-hover:scale-125"
      />

      <div className="relative z-10">
        <span className="inline-flex min-h-8 items-center rounded-full bg-[#eef9f7] px-3 text-[13px] font-extrabold text-[#087b75]">
          {number}
        </span>

        <h4 className="mt-4 text-[16px] font-extrabold leading-6 text-[#26364d]">
          {title}
        </h4>

        <p className="mt-2 text-[13px] leading-7 text-[#52606d]">
          {children}
        </p>
      </div>
    </article>
  );
}

function FaqItem({
  question,
  children,
}: FaqItemProps) {
  return (
    <details className="group overflow-hidden rounded-[12px] border border-[#e0e7e5] bg-white transition duration-300 open:border-[#b9ddd8] open:shadow-[0_16px_36px_-28px_rgba(8,123,117,0.38)]">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[16px] font-bold leading-6 text-[#26364d] outline-none transition hover:bg-[#f5fbfa] focus-visible:bg-[#f5fbfa] sm:px-5">
        <span>{question}</span>

        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef9f7] text-[#087b75] transition duration-300 group-open:rotate-45 group-open:bg-[#087b75] group-open:text-white">
          <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
          <span className="absolute h-3.5 w-[2px] rounded-full bg-current" />
        </span>
      </summary>

      <div className="border-t border-[#edf1f0] px-4 py-4 sm:px-5">
        <p className="text-[13px] leading-7 text-[#52606d]">
          {children}
        </p>
      </div>
    </details>
  );
}

function SeoLink({
  href,
  children,
}: SeoLinkProps) {
  return (
    <Link
      href={href}
      className="font-bold text-[#d94d4d] underline decoration-[#d94d4d]/40 decoration-1 underline-offset-[3px] transition duration-200 hover:text-[#087b75] hover:decoration-[#087b75]"
    >
      {children}
    </Link>
  );
}