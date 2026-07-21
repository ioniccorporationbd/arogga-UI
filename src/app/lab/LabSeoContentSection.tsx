"use client";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Download,
  FileText,
  FlaskConical,
  HeartPulse,
  Home,
  Info,
  Search,
  ShieldCheck,
  Stethoscope,
  TestTube2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type JsonProduct = {
  id: number;
  brand: string;
  title: string;
  category: string;
  image: string;
  price: number;
  currency: string;
  rating: number | null;
  productUrl: string;
};

type PopularTestLink = {
  id: string;
  title: string;
  href: string;
};

const bookingSteps = [
  {
    id: 1,
    title: "Search for Your Test",
    description:
      "Search for the test you need, such as CBC, HbA1c, TSH, Vitamin D, Liver Function Test or Kidney Function Test. You can also browse health-checkup packages based on age, medical needs or preventive health goals.",
    icon: Search,
  },
  {
    id: 2,
    title: "Select a Diagnostic Partner",
    description:
      "Review the available diagnostic partners and compare pricing, home sample collection options, estimated report delivery times and appointment availability.",
    icon: Stethoscope,
  },
  {
    id: 3,
    title: "Schedule Sample Collection Date and Time",
    description:
      "Choose a suitable date and time for sample collection. For supported tests and locations, a trained healthcare professional can visit your home to collect the required sample.",
    icon: ClipboardCheck,
  },
  {
    id: 4,
    title: "Receive Your Digital Report",
    description:
      "After testing is completed, your report will be available digitally. You can view, download, save or share the report with your healthcare professional.",
    icon: FileText,
  },
];

const collectionExpectations = [
  "The sample collector arrives during the selected collection window.",
  "Hygienic and appropriate sample-collection materials are used.",
  "Patient and test details are verified before collection.",
  "Samples are labelled carefully.",
  "Collected samples are stored and transported appropriately.",
  "The diagnostic partner processes the sample.",
  "The completed report is delivered digitally.",
];

const healthPackages = [
  {
    title: "Diabetes Checkup Packages",
    description:
      "Packages may include fasting blood glucose, random blood glucose, HbA1c, kidney-function tests, urine tests and lipid-profile screening.",
  },
  {
    title: "Heart Health Packages",
    description:
      "Packages may include lipid profile, cholesterol, triglycerides, blood glucose, liver function, kidney function and cardiovascular-risk markers.",
  },
  {
    title: "Liver Health Packages",
    description:
      "Packages may include bilirubin, ALT, AST, alkaline phosphatase, albumin and other liver-function markers.",
  },
  {
    title: "Kidney Health Packages",
    description:
      "Packages may include serum creatinine, blood urea, electrolytes, uric acid, urine analysis and related kidney-function tests.",
  },
  {
    title: "Women’s Health Packages",
    description:
      "Packages may cover thyroid health, anaemia, vitamin levels, blood glucose, liver function, kidney function and selected reproductive-health markers.",
  },
  {
    title: "Men’s Health Packages",
    description:
      "Packages may include blood count, blood glucose, lipid profile, liver function, kidney function, thyroid tests and age-appropriate health markers.",
  },
  {
    title: "Preventive Health Packages",
    description:
      "Full-body checkup packages may combine blood, urine, metabolic, nutritional and organ-function tests to provide a broader health overview.",
  },
];

const commonTests = [
  {
    title: "Complete Blood Count",
    description:
      "A CBC measures red blood cells, white blood cells, haemoglobin, haematocrit and platelets. It may support the assessment of anaemia, infection, inflammation and general health.",
  },
  {
    title: "HbA1c",
    description:
      "An HbA1c test estimates average blood glucose over the previous two to three months and is commonly used for diabetes screening and monitoring.",
  },
  {
    title: "Thyroid-Stimulating Hormone",
    description:
      "A TSH test helps assess thyroid function. Depending on the result and symptoms, a doctor may recommend T3, T4, Free T3 or Free T4 tests.",
  },
  {
    title: "Vitamin D",
    description:
      "A Vitamin D test measures the level of Vitamin D in the blood and may be recommended for people with bone pain, muscle weakness or limited sun exposure.",
  },
  {
    title: "Liver Function Test",
    description:
      "A liver-function panel includes several markers that help healthcare professionals assess liver function and possible liver injury.",
  },
  {
    title: "Kidney Function Test",
    description:
      "A kidney-function test commonly includes markers such as creatinine, blood urea and electrolytes.",
  },
];

const preparationItems = [
  "Check whether fasting is required.",
  "Confirm how many hours you need to avoid food.",
  "Ask whether plain water is allowed.",
  "Inform the sample collector about any medicine or supplement you take.",
  "Do not stop prescribed medicine unless your doctor advises you.",
  "Confirm whether the sample must be collected in the morning.",
  "Keep your booking details and prescription ready, when applicable.",
  "Wear clothing that allows easy access to your arm.",
  "Follow any test-specific instructions provided during booking.",
];

const digitalReportBenefits = [
  "Access your report without visiting the diagnostic centre again.",
  "Download and save previous reports.",
  "Share reports with your doctor.",
  "Compare current results with earlier results.",
  "Reduce the risk of losing a printed report.",
];

export default function LabSeoContentSection() {
  const [products, setProducts] = useState<JsonProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setDataError("");

        const response = await fetch("/tara.json", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load public/tara.json. Status: ${response.status}`,
          );
        }

        const result = (await response.json()) as unknown;

        if (!Array.isArray(result)) {
          throw new Error(
            "public/tara.json must contain a JSON array of products.",
          );
        }

        setProducts(result.filter(isValidProduct));
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setDataError(
          error instanceof Error
            ? error.message
            : "Unable to load data.json.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const popularTests = useMemo<PopularTestLink[]>(() => {
    const generated = products
      .slice(0, 18)
      .map((product, index) => ({
        id: `${product.id}-${index}`,
        title: product.title,
        href: `/lab/tests/${createSlug(product.title)}`,
      }));

    const fallbackTests: PopularTestLink[] = [
      {
        id: "cbc",
        title: "Complete Blood Count",
        href: "/lab/tests/complete-blood-count",
      },
      {
        id: "hba1c",
        title: "HbA1c",
        href: "/lab/tests/hba1c",
      },
      {
        id: "fasting-glucose",
        title: "Fasting Blood Glucose",
        href: "/lab/tests/fasting-blood-glucose",
      },
      {
        id: "random-glucose",
        title: "Random Blood Glucose",
        href: "/lab/tests/random-blood-glucose",
      },
      {
        id: "tsh",
        title: "TSH",
        href: "/lab/tests/tsh",
      },
      {
        id: "vitamin-d",
        title: "Vitamin D",
        href: "/lab/tests/vitamin-d",
      },
      {
        id: "liver-function",
        title: "Liver Function Test",
        href: "/lab/tests/liver-function-test",
      },
      {
        id: "kidney-function",
        title: "Kidney Function Test",
        href: "/lab/tests/kidney-function-test",
      },
      {
        id: "lipid-profile",
        title: "Lipid Profile",
        href: "/lab/tests/lipid-profile",
      },
      {
        id: "serum-creatinine",
        title: "Serum Creatinine",
        href: "/lab/tests/serum-creatinine",
      },
      {
        id: "urine-routine",
        title: "Urine Routine Examination",
        href: "/lab/tests/urine-routine",
      },
      {
        id: "electrolytes",
        title: "Serum Electrolytes",
        href: "/lab/tests/serum-electrolytes",
      },
    ];

    return mergeLinks(generated, fallbackTests).slice(0, 18);
  }, [products]);

  return (
    <>
      <section
        aria-labelledby="lab-seo-content-title"
        className="lab-seo-section"
      >
        <div
          aria-hidden="true"
          className="lab-seo-background-pattern"
        />

        <div className="lab-seo-container">
          <article
            className={[
              "lab-seo-article",
              expanded ? "is-expanded" : "",
            ].join(" ")}
          >
            <header className="lab-seo-hero">
              <div className="lab-seo-hero-icon">
                <FlaskConical size={20} strokeWidth={1.8} />
              </div>

              <div>
                <p className="lab-seo-eyebrow">
                  Home sample collection and digital reports
                </p>

                <h2
                  id="lab-seo-content-title"
                  className="lab-seo-main-title"
                >
                  Book Lab Tests Online in Dhaka
                </h2>

                <p className="lab-seo-introduction">
                  Book your laboratory test online and access
                  diagnostic services from trusted healthcare
                  partners. Search for individual tests, compare
                  available options, select a diagnostic partner
                  and schedule your test in a few simple steps.
                </p>
              </div>
            </header>

            <div className="lab-seo-content">
              <ContentSection
                icon={<Home size={18} strokeWidth={1.8} />}
                title="Convenient Home Sample Collection"
              >
                <p>
                  For eligible tests and supported locations, you
                  can arrange home sample collection at a
                  convenient time. A trained healthcare
                  professional visits the scheduled location,
                  verifies the test information and collects the
                  required sample using appropriate equipment.
                </p>

                <p>
                  After the test is completed, the laboratory
                  report can be delivered digitally, making it
                  easier to view, download and share with your
                  doctor.
                </p>
              </ContentSection>

              <ContentSection
                icon={
                  <ClipboardCheck
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                title="How Online Lab Test Booking Works"
              >
                <p>
                  Booking a laboratory test with Anukov is quick
                  and simple. Follow these four steps to complete
                  your booking.
                </p>

                <div className="lab-booking-steps">
                  {bookingSteps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <article
                        key={step.id}
                        className="lab-booking-step"
                      >
                        <div className="lab-booking-step-number">
                          {step.id}
                        </div>

                        <div className="lab-booking-step-icon">
                          <Icon size={18} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h4 className="lab-booking-step-title">
                            {step.title}
                          </h4>

                          <p className="lab-booking-step-description">
                            {step.description}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </ContentSection>

              <ContentSection
                icon={
                  <ShieldCheck
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                title="Our Trusted Diagnostic Partners"
              >
                <p>
                  The accuracy and reliability of a laboratory
                  test depend on proper sample collection,
                  storage, transportation, laboratory equipment,
                  quality-control procedures and professional
                  supervision.
                </p>

                <p>
                  Anukov works with trusted diagnostic partners
                  that provide a range of pathology and
                  laboratory-testing services. Partner
                  availability may depend on the test, location,
                  service capacity and appointment schedule.
                </p>

                <Link
                  href="/lab/partners"
                  className="lab-inline-link"
                >
                  View Available Diagnostic Partners
                  <ArrowRight size={16} strokeWidth={1.8} />
                </Link>
              </ContentSection>

              <ContentSection
                icon={
                  <TestTube2
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                title="What to Expect During Home Sample Collection"
              >
                <CheckList items={collectionExpectations} />

                <InfoBox>
                  Some tests may require fasting, early-morning
                  collection, medication-related instructions or
                  other preparation. Follow the instructions
                  provided during booking or those given by your
                  doctor.
                </InfoBox>
              </ContentSection>

              <ContentSection
                icon={
                  <HeartPulse
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                title="Affordable Health Checkup Packages"
              >
                <p>
                  Preventive health checkups can help identify
                  potential health risks before noticeable
                  symptoms develop. Anukov provides access to
                  different health-checkup packages for routine
                  screening and health monitoring.
                </p>

                <div className="lab-package-information-grid">
                  {healthPackages.map((healthPackage) => (
                    <article
                      key={healthPackage.title}
                      className="lab-package-information-card"
                    >
                      <h4 className="lab-information-card-title">
                        {healthPackage.title}
                      </h4>

                      <p className="lab-information-card-description">
                        {healthPackage.description}
                      </p>
                    </article>
                  ))}
                </div>
              </ContentSection>

              <ContentSection
                icon={<Activity size={18} strokeWidth={1.8} />}
                title="Popular Lab Tests Available Online"
              >
                <p>
                  Browse commonly requested pathology tests,
                  routine blood investigations and specialised
                  health-screening options.
                </p>

                {dataError && (
                  <div className="lab-data-warning">
                    <Info size={18} strokeWidth={1.8} />

                    <span>
                      {dataError} Default test links are being
                      displayed.
                    </span>
                  </div>
                )}

                {loading ? (
                  <TestLinksSkeleton />
                ) : (
                  <div className="lab-popular-tests-grid">
                    {popularTests.map((test) => (
                      <Link
                        key={test.id}
                        href={test.href}
                        className="lab-popular-test-link"
                      >
                        <FlaskConical
                          size={16}
                          strokeWidth={1.7}
                        />

                        <span>{test.title}</span>

                        <ArrowRight
                          size={16}
                          strokeWidth={1.8}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </ContentSection>

              <ContentSection
                icon={
                  <Stethoscope
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                title="Common Blood and Diagnostic Tests"
              >
                <div className="lab-common-tests">
                  {commonTests.map((test) => (
                    <article
                      key={test.title}
                      className="lab-common-test-item"
                    >
                      <h4 className="lab-common-test-title">
                        {test.title}
                      </h4>

                      <p className="lab-common-test-description">
                        {test.description}
                      </p>
                    </article>
                  ))}
                </div>

                <Link
                  href="/lab/tests"
                  className="lab-inline-link"
                >
                  View All Lab Tests
                  <ArrowRight size={16} strokeWidth={1.8} />
                </Link>
              </ContentSection>

              <ContentSection
                icon={
                  <ClipboardCheck
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                title="How to Prepare for a Lab Test"
              >
                <p>
                  Proper preparation can help reduce delays and
                  support accurate test results. Preparation
                  requirements vary depending on the test.
                </p>

                <CheckList items={preparationItems} />

                <InfoBox>
                  Not every blood test requires fasting. Tests
                  such as fasting blood glucose and some lipid
                  profiles may require fasting, while many
                  routine tests do not.
                </InfoBox>
              </ContentSection>

              <ContentSection
                icon={
                  <Download size={18} strokeWidth={1.8} />
                }
                title="Digital Lab Reports"
              >
                <p>
                  After your sample is processed, the diagnostic
                  partner prepares the laboratory report.
                  Depending on the selected test and provider,
                  your report may be available through your
                  account, email, message or another supported
                  digital channel.
                </p>

                <CheckList items={digitalReportBenefits} />

                <InfoBox>
                  Laboratory reports should be interpreted by a
                  qualified healthcare professional. A result
                  outside the reference range does not always
                  confirm a disease, and a result inside the
                  reference range does not always rule one out.
                </InfoBox>
              </ContentSection>
            </div>

            <div className="lab-seo-mobile-fade" />

            <div className="lab-seo-toggle-wrapper">
              <button
                type="button"
                onClick={() =>
                  setExpanded((current) => !current)
                }
                className="lab-seo-toggle"
                aria-expanded={expanded}
              >
                {expanded ? (
                  <>
                    Show Less
                    <ChevronUp size={18} strokeWidth={1.8} />
                  </>
                ) : (
                  <>
                    Read Full Information
                    <ChevronDown
                      size={18}
                      strokeWidth={1.8}
                    />
                  </>
                )}
              </button>
            </div>
          </article>
        </div>
      </section>

      <style>{`
        .lab-seo-section {
          --lab-seo-text-20: 20px;
          --lab-seo-text-18: 18px;
          --lab-seo-text-16: 16px;
          --lab-seo-text-13: 13px;

          position: relative;
          isolation: isolate;
          width: 100%;
          overflow: hidden;
          padding: 52px 0 64px;
          background:
            radial-gradient(
              circle at 5% 6%,
              rgba(216, 242, 238, 0.58),
              transparent 29%
            ),
            radial-gradient(
              circle at 96% 94%,
              rgba(226, 236, 252, 0.65),
              transparent 30%
            ),
            #f8fbfc;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .lab-seo-background-pattern {
          position: absolute;
          inset: 0;
          z-index: -2;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(
              rgba(8, 123, 117, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(8, 123, 117, 0.035) 1px,
              transparent 1px
            );
          background-size: 46px 46px;
        }

        .lab-seo-container {
          width: min(1180px, calc(100% - 48px));
          margin-inline: auto;
        }

        .lab-seo-article {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow:
            0 30px 70px -52px rgba(15, 23, 42, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.95);
        }

        .lab-seo-hero {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 26px 28px;
          border-bottom: 1px solid #e8edef;
          background:
            radial-gradient(
              circle at 5% 10%,
              rgba(221, 246, 241, 0.75),
              transparent 38%
            ),
            linear-gradient(135deg, #f5fcfa, #ffffff);
        }

        .lab-seo-hero-icon {
          display: flex;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #087b75;
          background: #e7f7f4;
          box-shadow:
            0 12px 24px -18px rgba(8, 123, 117, 0.55);
        }

        .lab-seo-eyebrow {
          margin: 0;
          color: #087b75;
          font-size: var(--lab-seo-text-13);
          font-weight: 800;
          line-height: 1.4;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .lab-seo-main-title {
          margin: 4px 0 0;
          color: #101828;
          font-size: var(--lab-seo-text-20);
          font-weight: 850;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .lab-seo-introduction {
          max-width: 870px;
          margin: 8px 0 0;
          color: #475467;
          font-size: var(--lab-seo-text-13);
          line-height: 1.8;
        }

        .lab-seo-content {
          padding: 8px 28px 30px;
        }

        .lab-content-section {
          padding: 25px 0;
          border-bottom: 1px solid #e9edef;
        }

        .lab-content-section:last-child {
          border-bottom: 0;
        }

        .lab-content-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 10px;
        }

        .lab-content-heading-icon {
          display: flex;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #087b75;
          background: #edf9f7;
        }

        .lab-content-title {
          margin: 0;
          color: #101828;
          font-size: var(--lab-seo-text-18);
          font-weight: 850;
          line-height: 1.45;
          letter-spacing: -0.015em;
        }

        .lab-content-body {
          color: #475467;
          font-size: var(--lab-seo-text-13);
          line-height: 1.8;
        }

        .lab-content-body > p {
          margin: 0;
        }

        .lab-content-body > p + p {
          margin-top: 12px;
        }

        .lab-booking-steps {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 17px;
        }

        .lab-booking-step {
          position: relative;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          gap: 11px;
          min-width: 0;
          padding: 15px;
          border: 1px solid #e2e9e9;
          border-radius: 12px;
          background: #fbfdfd;
          transition:
            border-color 250ms ease,
            transform 300ms ease,
            box-shadow 300ms ease;
        }

        .lab-booking-step:hover {
          border-color: rgba(8, 123, 117, 0.28);
          box-shadow:
            0 22px 40px -34px rgba(8, 123, 117, 0.45);
          transform: translateY(-3px);
        }

        .lab-booking-step-number {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          background: #087b75;
          font-size: var(--lab-seo-text-13);
          font-weight: 850;
        }

        .lab-booking-step-icon {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #087b75;
          background: #eaf8f5;
        }

        .lab-booking-step-title,
        .lab-information-card-title,
        .lab-common-test-title {
          margin: 0;
          color: #101828;
          font-size: var(--lab-seo-text-16);
          font-weight: 800;
          line-height: 1.5;
        }

        .lab-booking-step-description,
        .lab-information-card-description,
        .lab-common-test-description {
          margin: 5px 0 0;
          color: #667085;
          font-size: var(--lab-seo-text-13);
          line-height: 1.7;
        }

        .lab-check-list {
          display: grid;
          gap: 10px;
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
        }

        .lab-check-list-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #475467;
          font-size: var(--lab-seo-text-13);
          line-height: 1.7;
        }

        .lab-check-list-icon {
          flex-shrink: 0;
          margin-top: 3px;
          color: #087b75;
        }

        .lab-information-box {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 16px;
          padding: 13px 14px;
          border: 1px solid #d6e9e6;
          border-radius: 10px;
          color: #315f5a;
          background: #f2faf8;
          font-size: var(--lab-seo-text-13);
          line-height: 1.7;
        }

        .lab-information-box svg {
          flex-shrink: 0;
          margin-top: 3px;
          color: #087b75;
        }

        .lab-package-information-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin-top: 17px;
        }

        .lab-package-information-card {
          padding: 14px;
          border: 1px solid #e3e9eb;
          border-radius: 11px;
          background: #fcfdfd;
          transition:
            border-color 250ms ease,
            background-color 250ms ease;
        }

        .lab-package-information-card:hover {
          border-color: rgba(8, 123, 117, 0.28);
          background: #f7fcfb;
        }

        .lab-inline-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 15px;
          color: #087b75;
          font-size: var(--lab-seo-text-13);
          font-weight: 800;
          line-height: 1.5;
          text-decoration: none;
        }

        .lab-inline-link svg {
          transition: transform 250ms ease;
        }

        .lab-inline-link:hover svg {
          transform: translateX(4px);
        }

        .lab-popular-tests-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .lab-popular-test-link {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr) 18px;
          align-items: center;
          gap: 8px;
          min-width: 0;
          min-height: 48px;
          padding: 10px 11px;
          border: 1px solid #e3e9eb;
          border-radius: 9px;
          color: #344054;
          background: #ffffff;
          font-size: var(--lab-seo-text-13);
          font-weight: 700;
          line-height: 1.5;
          text-decoration: none;
          transition:
            color 250ms ease,
            border-color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease;
        }

        .lab-popular-test-link > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lab-popular-test-link svg {
          color: #087b75;
        }

        .lab-popular-test-link:hover {
          border-color: rgba(8, 123, 117, 0.3);
          color: #087b75;
          background: #f6fcfa;
          transform: translateY(-2px);
        }

        .lab-common-tests {
          display: grid;
          gap: 0;
          margin-top: 12px;
          border: 1px solid #e4e9eb;
          border-radius: 12px;
          background: #ffffff;
        }

        .lab-common-test-item {
          padding: 14px;
          border-bottom: 1px solid #e9edef;
        }

        .lab-common-test-item:last-child {
          border-bottom: 0;
        }

        .lab-data-warning {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 14px;
          padding: 12px 13px;
          border: 1px solid #efd59e;
          border-radius: 9px;
          color: #865809;
          background: #fffaf0;
          font-size: var(--lab-seo-text-13);
          line-height: 1.6;
        }

        .lab-test-links-skeleton {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .lab-test-link-skeleton {
          height: 48px;
          border-radius: 9px;
          background:
            linear-gradient(
              90deg,
              #edf1f2 25%,
              #f7f9f9 50%,
              #edf1f2 75%
            );
          background-size: 200% 100%;
          animation: labSeoShimmer 1.4s linear infinite;
        }

        @keyframes labSeoShimmer {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -200% 0;
          }
        }

        .lab-seo-toggle-wrapper {
          display: none;
          justify-content: center;
          padding: 0 18px 24px;
        }

        .lab-seo-toggle {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 18px;
          border: 1px solid #087b75;
          border-radius: 999px;
          color: #087b75;
          background: #ffffff;
          font-family: inherit;
          font-size: var(--lab-seo-text-13);
          font-weight: 800;
          cursor: pointer;
          transition:
            color 250ms ease,
            background-color 250ms ease,
            transform 250ms ease;
        }

        .lab-seo-toggle:hover {
          color: #ffffff;
          background: #087b75;
          transform: translateY(-2px);
        }

        .lab-seo-mobile-fade {
          display: none;
        }

        @media (max-width: 1023px) {
          .lab-seo-container {
            width: calc(100% - 32px);
          }

          .lab-popular-tests-grid,
          .lab-test-links-skeleton {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .lab-seo-section {
            padding: 42px 0 50px;
          }

          .lab-seo-container {
            width: calc(100% - 24px);
          }

          .lab-seo-hero {
            padding: 22px;
          }

          .lab-seo-content {
            padding: 6px 22px 25px;
          }

          .lab-booking-steps,
          .lab-package-information-grid {
            grid-template-columns: 1fr;
          }

          .lab-popular-tests-grid,
          .lab-test-links-skeleton {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 639px) {
          .lab-seo-section {
            padding: 34px 0 42px;
          }

          .lab-seo-container {
            width: 100%;
          }

          .lab-seo-article {
            border-right: 0;
            border-left: 0;
            border-radius: 0;
          }

          .lab-seo-hero {
            padding: 20px 14px;
          }

          .lab-seo-content {
            padding: 4px 14px 22px;
          }

          .lab-seo-hero-icon {
            width: 40px;
            height: 40px;
          }

          .lab-seo-article:not(.is-expanded)
            .lab-seo-content {
            max-height: 1150px;
            overflow: hidden;
          }

          .lab-seo-mobile-fade {
            position: absolute;
            right: 0;
            bottom: 66px;
            left: 0;
            display: block;
            height: 150px;
            pointer-events: none;
            background:
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0),
                rgba(255, 255, 255, 0.94) 64%,
                #ffffff
              );
          }

          .lab-seo-article.is-expanded
            .lab-seo-mobile-fade {
            display: none;
          }

          .lab-seo-toggle-wrapper {
            position: relative;
            z-index: 5;
            display: flex;
          }
        }

        @media (max-width: 420px) {
          .lab-seo-hero {
            gap: 10px;
            padding-right: 11px;
            padding-left: 11px;
          }

          .lab-seo-content {
            padding-right: 11px;
            padding-left: 11px;
          }

          .lab-content-section {
            padding: 21px 0;
          }

          .lab-booking-step {
            grid-template-columns: 34px minmax(0, 1fr);
            padding: 13px;
          }

          .lab-booking-step-icon {
            width: 34px;
            height: 34px;
          }
        }

        @media (hover: none) {
          .lab-booking-step:hover,
          .lab-popular-test-link:hover,
          .lab-seo-toggle:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lab-seo-section *,
          .lab-seo-section *::before,
          .lab-seo-section *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

function ContentSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="lab-content-section">
      <header className="lab-content-heading">
        <span className="lab-content-heading-icon">
          {icon}
        </span>

        <h3 className="lab-content-title">
          {title}
        </h3>
      </header>

      <div className="lab-content-body">
        {children}
      </div>
    </section>
  );
}

function CheckList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="lab-check-list">
      {items.map((item) => (
        <li
          key={item}
          className="lab-check-list-item"
        >
          <CheckCircle2
            size={17}
            strokeWidth={1.8}
            className="lab-check-list-icon"
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lab-information-box">
      <Info size={18} strokeWidth={1.8} />

      <span>{children}</span>
    </div>
  );
}

function TestLinksSkeleton() {
  return (
    <div className="lab-test-links-skeleton">
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div
            key={index}
            className="lab-test-link-skeleton"
          />
        ),
      )}
    </div>
  );
}

function isValidProduct(
  value: unknown,
): value is JsonProduct {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const product =
    value as Partial<JsonProduct>;

  return (
    typeof product.id === "number" &&
    typeof product.brand === "string" &&
    typeof product.title === "string" &&
    typeof product.category === "string" &&
    typeof product.image === "string" &&
    typeof product.price === "number" &&
    typeof product.currency === "string" &&
    (typeof product.rating === "number" ||
      product.rating === null) &&
    typeof product.productUrl === "string"
  );
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mergeLinks(
  primary: PopularTestLink[],
  fallback: PopularTestLink[],
) {
  const result: PopularTestLink[] = [];
  const titles = new Set<string>();

  [...primary, ...fallback].forEach((item) => {
    const key = item.title.trim().toLowerCase();

    if (!key || titles.has(key)) {
      return;
    }

    titles.add(key);
    result.push(item);
  });

  return result;
}