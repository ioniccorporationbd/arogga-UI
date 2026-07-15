import Link from "next/link";

type SeoLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function SeoContentSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <article className="rounded-[10px] border border-[#dfe4e8] bg-white px-5 py-6 text-[#344054] shadow-[0_8px_25px_-22px_rgba(15,23,42,0.35)] sm:px-7 sm:py-8 lg:px-9">
          <header>
            <h2 className="text-[17px] font-bold leading-7 text-[#26364d] sm:text-[18px]">
              Bangladesh&apos;s Most Trusted Online Pharmacy for Medicine,
              Beauty &amp; Healthcare Products
            </h2>
          </header>

          <div className="mt-2 space-y-3 text-[13px] leading-[1.75] sm:text-[14px] sm:leading-7">
            <p>
              Accessing safe, authentic medical care shouldn&apos;t be a complex
              chore. Arogga simplifies your wellness journey by serving as a
              comprehensive, digitally managed healthcare repository. Every
              item in our catalog is systematically organized, continuously
              updated for batch accuracy, and monitored under stringent
              pharmacy regulations to guarantee immediate availability.
            </p>

            <p>
              Arogga simplifies your healthcare journey by organizing our
              massive ecosystem into specialized, easily navigable e-commerce
              categories. Our foundational Medicine department carries a full
              inventory of allopathic prescription drugs, acute treatments, and
              everyday OTC solutions, all systematically mapped by brand name
              and generic molecular entity to make your online medicine order
              seamless for daily medical needs.
            </p>

            <p>
              Our Healthcare catalog offers everything from standard surgical
              supplies and home medical devices like glucometers and BP
              monitors to essential personal hygiene items. Beyond clinical
              treatments, our{" "}
              <SeoLink href="/beauty">Beauty Product</SeoLink> section features
              premium, dermatologist-tested skincare, hair treatments, and
              dermo-cosmetics imported via verified global supply channels,
              while our{" "}
              <SeoLink href="/sexual-wellness">
                Sexual Wellness products
              </SeoLink>{" "}
              provides discreet access to reproductive health products,
              contraceptives, and wellness items packaged with absolute
              privacy.
            </p>

            <p>
              We support growing families through our{" "}
              <SeoLink href="/baby-mom-care">Baby &amp; Mom Care</SeoLink>{" "}
              shelf, which stocks certified infant nutrition formulas, safe
              pediatric care essentials, and post-natal maternal health
              products.
            </p>

            <p>
              Dedicated to holistic and lifestyle wellness, Arogga balances
              modern science with traditional care. Our{" "}
              <SeoLink href="/herbal">Herbal</SeoLink> and{" "}
              <SeoLink href="/homeopathy">Homeopathy products</SeoLink> offer
              trusted, natural wellness formulations, traditional plant-based
              therapies, and quality-assured homeopathic dilutions or tissue
              remedies sourced exclusively from regulated manufacturers and
              certified labs. To support daily vitality, our{" "}
              <SeoLink href="/supplement">Supplement</SeoLink> and{" "}
              <SeoLink href="/food-and-nutrition">
                Food and Nutrition
              </SeoLink>{" "}
              categories feature imported multivitamins, mineral compounds,
              structural proteins, organic dietary additions, diabetic-friendly
              food alternatives, and clinical nutritional shakes.
            </p>

            <p>
              We also keep your home environment safe with{" "}
              <SeoLink href="/home-care">Home Care</SeoLink> disinfectants,
              sanitizers, and clinical-grade household wellness supplies.
              Finally, extending our medical oversight to animals, our{" "}
              <SeoLink href="/pet-care">Pet Care</SeoLink> and{" "}
              <SeoLink href="/veterinary">Veterinary categories</SeoLink>{" "}
              provide healthcare products, flea/tick treatments, maintenance
              supplies, and regulated agricultural or livestock
              pharmaceuticals sourced for specialized veterinary use.
            </p>
          </div>

          <div className="my-6 h-px bg-[#e8ecef]" />

          <div className="space-y-3 text-[13px] leading-[1.75] text-[#344054] sm:text-[14px] sm:leading-7">
            <p>
              To help you find exactly what you need based on medical intent,
              you can also explore our platform by targeted health concerns and
              digital clinical services. Under{" "}
              <SeoLink href="/vital-organs">Vital Organs</SeoLink>, we offer
              tailored wellness bundles and therapeutic support items to
              monitor and manage cardiac, hepatic, renal, and metabolic health,
              alongside specialized{" "}
              <SeoLink href="/life-style-package">
                Life Style Packages
              </SeoLink>{" "}
              designed to track modern stress, hypertension, and sedentary
              health risks.
            </p>

            <p>
              We prioritize gender-specific preventative care through our{" "}
              <SeoLink href="/checkups-for-women">Checkups for Women</SeoLink>,
              which focus on hormonal balance, bone density, and reproductive
              wellness, as well as our{" "}
              <SeoLink href="/checkups-for-men">Checkups for Men</SeoLink>,
              which evaluate cardiovascular endurance, prostate health, and
              metabolic vital signs. This entire ecosystem is bound together
              by our three primary operational hubs: The seamless{" "}
              <SeoLink href="/store">e-commerce online Store</SeoLink> gateway
              to search, cross-reference active ingredients, and instantly buy{" "}
              <SeoLink href="/medicine">
                medicine online in Bangladesh
              </SeoLink>
              ; the{" "}
              <SeoLink href="/lab">Online Lab test</SeoLink>, an integrated
              home sample-collection service for diagnostic tests managed by
              certified phlebotomists with secure digital reporting; and{" "}
              <SeoLink href="/doctor">Doctor consultation</SeoLink>, your
              direct portal to verified digital consultations with registered,
              experienced medical professionals.
            </p>
          </div>

          <section className="mt-6">
            <h3 className="text-[15px] font-bold text-[#26364d] sm:text-[16px]">
              Order Medicine Online in 3 Easy Steps
            </h3>

            <p className="mt-1 text-[13px] leading-6 text-[#344054] sm:text-[14px]">
              Our digital procurement system removes operational friction,
              allowing you to complete your online medicine order securely from
              any location in just three transparent phases:
            </p>

            <ol className="mt-3 space-y-2 pl-5 text-[13px] leading-6 text-[#344054] sm:text-[14px]">
              <li className="list-disc">
                <strong className="text-[#26364d]">Step 1 — Search:</strong>{" "}
                Locate your required treatment instantly by typing the specific
                brand name, generic salt formulation, or pharmaceutical
                manufacturer. Review the real-time online medicine price in
                Bangladesh before adding items to your virtual cart, ensuring
                absolute billing transparency.
              </li>

              <li className="list-disc">
                <strong className="text-[#26364d]">
                  Step 2 — Upload Prescription:
                </strong>{" "}
                Simply upload a photo of your doctor&apos;s official
                prescription slip directly through our web interface or mobile
                application. Our on-site, licensed pharmacist team reviews the
                document within minutes to verify exact dosages, prevent
                drug-interaction conflicts, and authorize the dispatch.
              </li>

              <li className="list-disc">
                <strong className="text-[#26364d]">
                  Step 3 — Get Home Delivery:
                </strong>{" "}
                Experience prompt, reliable medicine home delivery anywhere
                across the country. Enjoy lightning-fast, same-day delivery
                inside the Dhaka metropolitan grid. For orders finalized before
                3 PM, we ensure next-day delivery across Chattogram, Sylhet, and
                other major regional hubs.
              </li>
            </ol>
          </section>

          <section className="mt-6">
            <h3 className="text-[15px] font-bold text-[#26364d] sm:text-[16px]">
              Why Arogga is Bangladesh&apos;s Best Online Medicine Shop
            </h3>

            <ContentBlock title="100% Authentic Medicines">
              Patient safety is the absolute foundation of our operations. The
              local retail market can introduce unexpected risks regarding
              sub-standard or counterfeit pill batches. Arogga completely
              neutralizes this variable by sourcing 100% of our inventory
              directly from DGDA-licensed pharmaceutical manufacturers—such as
              Square Pharmaceuticals, Beximco Pharma, Incepta, and Opsonin—
              alongside authorized primary distributors. We maintain a
              zero-tolerance policy for third-party marketplace sourcing, and
              our clinical team regularly audits every stock keeping unit
              (SKU) against the official registry of the Directorate General of
              Drug Administration.
            </ContentBlock>

            <ContentBlock title="Licensed Pharmacist Team">
              We do not operate as an unmonitored retail fulfillment warehouse.
              Every online medicine order is processed through an internal
              clinical review layer managed by our in-house team of registered,
              licensed A-Grade pharmacists. These medical professionals verify
              handwritten prescriptions, address customer inquiries regarding
              side effects or generic substitutions, and validate accurate
              dosage distribution, bringing genuine pharmaceutical expertise
              to every digital interaction.
            </ContentBlock>

            <ContentBlock title="Fast Medicine Home Delivery">
              When it comes to managing health, delays are not an option. Arogga
              has built a hyper-localized logistics network that provides
              same-day medicine home delivery in Dhaka for rapid relief. Our
              network spans across all 64 districts of Bangladesh, guaranteeing
              safe delivery within 1 to 3 business days for outer zones.
              Furthermore, temperature-sensitive medications like insulin are
              transported utilizing specialized, insulated thermal cold-chain
              bags to preserve molecular potency from our hub to your door.
            </ContentBlock>

            <ContentBlock title="Widest Product Range">
              From common over-the-counter (OTC) antacids and analgesics to
              highly specialized chronic care prescription medications,
              surgical consumables, and organic herbal lines, Arogga manages a
              diverse catalog containing over 5,000 unique SKUs. This extensive
              selection makes us the definitive online medicine shop in
              Bangladesh, meeting all your family&apos;s healthcare
              requirements on a single platform.
            </ContentBlock>

            <ContentBlock title="Secure & Flexible Payment">
              Complete your purchases with peace of mind. Arogga integrates
              secure mobile financial services including bKash and Nagad,
              alongside standard international credit/debit card gateways,
              while offering a flexible cash-on-delivery option. All financial
              exchanges and personal health data are protected using
              industry-standard SSL encryption protocols, keeping your medical
              history private.
            </ContentBlock>

            <ContentBlock title="Easy Returns & Support">
              Our commitment to your care extends past delivery. If an item
              arrives damaged, or if there is any mismatch with your order, our
              dedicated customer care team resolves the discrepancy within 24
              hours. We offer a clear, transparent return and refund process
              because your peace of mind is an essential component of quality
              healthcare.
            </ContentBlock>

            <ContentBlock title="Order Medicine Anytime. Download the Arogga App">
              Managing your prescriptions is now remarkably straightforward.
              Bangladesh&apos;s most downloaded and highly rated online
              pharmacy application is optimized for both Android and iOS
              devices. Through a clean, intuitive interface, you can seamlessly
              search for medicines online, track dynamic medicine online check
              metrics, verify pricing transparency, upload complex
              prescriptions within seconds, and monitor your delivery courier
              in real time. Join over 1 million Bangladeshis who have digitized
              their healthcare management by trusting Arogga for reliable,
              professional online pharmacy services.
            </ContentBlock>
          </section>

          <section className="mt-7">
            <h3 className="text-[15px] font-bold text-[#26364d] sm:text-[16px]">
              Frequently Asked Questions About Online Medicine Ordering
            </h3>

            <div className="mt-3 space-y-4">
              <FaqItem question="Is Arogga a licensed online pharmacy in Bangladesh?">
                Yes. Arogga is a fully certified e-pharmacy platform operating
                in strict compliance with the statutory regulations mandated
                by the Directorate General of Drug Administration (DGDA) of
                Bangladesh. Every medicinal product in our fulfillment centers
                is legally acquired, tracked, and verified for therapeutic
                authenticity.
              </FaqItem>

              <FaqItem question="How do I order medicine online from Arogga?">
                Navigating our platform is simple: use the search engine on
                arogga.com or within the mobile app to locate your medication by
                brand or generic name, then add the item to your digital
                shopping cart. During checkout, upload an image of your
                prescription slip; our clinical pharmacists will review,
                confirm, and prepare your package for dispatch.
              </FaqItem>

              <FaqItem question="Do I need a prescription to buy medicine online in Bangladesh?">
                Legally classified Prescription-Only Medicines (Rx) require a
                valid, legible doctor&apos;s prescription uploaded during the
                ordering process for pharmacist verification. Standard
                Over-the-Counter (OTC) products, wellness supplements, and daily
                personal care items can be purchased directly without a
                prescription document.
              </FaqItem>

              <FaqItem question="How fast is medicine home delivery in Dhaka?">
                For residents within the Dhaka metropolitan territory, Arogga
                offers express, same-day delivery for all orders finalized
                before 3 PM. Orders received after this cutoff or placed from
                outer regional districts are securely routed via our expedited
                logistics network, arriving within 1 to 3 business days.
              </FaqItem>

              <FaqItem question="Are the medicines on Arogga 100% authentic?">
                Absolutely. Arogga maintains a direct supply line from licensed
                pharmaceutical companies and authorized legal distributors. We
                bypass secondary wholesalers entirely, implementing a strict
                anti-counterfeit protocol that ensures every single pill,
                liquid, or device is genuine and safe.
              </FaqItem>

              <FaqItem question="What is the online medicine price in Bangladesh on Arogga?">
                Our platform enforces honest, transparent pricing that strictly
                aligns with the Maximum Retail Price (MRP) established by the
                DGDA guidelines. Furthermore, Arogga provides competitive
                digital discounts below the official MRP on a wide range of
                selected chronic care medications and health items.
              </FaqItem>

              <FaqItem question="Does Arogga deliver medicine outside Dhaka?">
                Yes. Our logistics infrastructure extends nationwide, covering
                all 64 districts of Bangladesh. Whether you need reliable
                medicine delivery in Chattogram, Sylhet, Rajshahi, Khulna,
                Barishal, or Rangpur, Arogga delivers authentic healthcare
                straight to your home.
              </FaqItem>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}

function ContentBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h4 className="text-[13px] font-bold leading-6 text-[#26364d] sm:text-[14px]">
        {title}
      </h4>

      <p className="mt-0.5 text-[13px] leading-[1.75] text-[#344054] sm:text-[14px] sm:leading-7">
        {children}
      </p>
    </div>
  );
}

function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[13px] font-bold leading-6 text-[#26364d] sm:text-[14px]">
        {question}
      </h4>

      <p className="mt-0.5 text-[13px] leading-[1.75] text-[#344054] sm:text-[14px] sm:leading-7">
        {children}
      </p>
    </div>
  );
}

function SeoLink({ href, children }: SeoLinkProps) {
  return (
    <Link
      href={href}
      className="font-medium text-[#e24b4b] underline decoration-[#e24b4b]/60 underline-offset-2 transition-colors hover:text-[#087b75] hover:decoration-[#087b75]"
    >
      {children}
    </Link>
  );
}