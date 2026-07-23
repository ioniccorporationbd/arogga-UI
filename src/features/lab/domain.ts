import { z } from "zod";

export const diagnosticCenterSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  logo: z.string(),
  rating: z.number(),
  address: z.string(),
  city: z.string(),
  coverageDistricts: z.array(z.string()),
  homeCollection: z.boolean(),
  reportDeliveryHours: z.number(),
  verified: z.boolean(),
  phone: z.string(),
});

export const labTestSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  image: z.string(),
  category: z.string(),
  sampleType: z.string(),
  fastingRequired: z.boolean(),
  reportDeliveryHours: z.number(),
  regularPrice: z.number(),
  salePrice: z.number(),
  discountPercentage: z.number(),
  available: z.boolean(),
  homeCollection: z.boolean(),
  bookedCount: z.number(),
  rating: z.number(),
  reviewCount: z.number(),
  organ: z.string(),
  healthConcern: z.string(),
  packageGroup: z.string(),
  diagnosticCenterIds: z.array(z.string()),
  includedTestCount: z.number(),
  tags: z.array(z.string()),
  searchKeywords: z.array(z.string()),
  preparation: z.array(z.string()),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  ranges: z.string(),
});

export type DiagnosticCenter = z.infer<typeof diagnosticCenterSchema>;
export type LabTest = z.infer<typeof labTestSchema>;

export type LabQuery = {
  q?: string;
  priceMin?: number;
  priceMax?: number;
  centerId?: string;
  organ?: string;
  healthConcern?: string;
  packageGroup?: string;
  sampleType?: string;
  fastingRequired?: boolean;
  homeCollection?: boolean;
  available?: boolean;
  sort?: "popular" | "price-asc" | "price-desc" | "rating" | "fastest" | "name";
  page?: number;
  limit?: number;
};

function includes(value: string, q: string) {
  return value.toLowerCase().includes(q.toLowerCase());
}

export function queryLabTests(input: LabTest[], query: LabQuery = {}) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(60, Math.max(1, query.limit || 20));
  const q = query.q?.trim() || "";
  let items = [...input];

  if (q) items = items.filter((test) => includes(test.name, q) || includes(test.shortName, q) || test.searchKeywords.some((key) => includes(key, q)) || test.tags.some((tag) => includes(tag, q)));
  if (query.priceMin !== undefined) items = items.filter((test) => test.salePrice >= Number(query.priceMin));
  if (query.priceMax !== undefined) items = items.filter((test) => test.salePrice <= Number(query.priceMax));
  if (query.centerId) items = items.filter((test) => test.diagnosticCenterIds.includes(query.centerId!));
  if (query.organ) items = items.filter((test) => test.organ === query.organ);
  if (query.healthConcern) items = items.filter((test) => test.healthConcern === query.healthConcern);
  if (query.packageGroup) items = items.filter((test) => test.packageGroup === query.packageGroup);
  if (query.sampleType) items = items.filter((test) => test.sampleType === query.sampleType);
  if (query.fastingRequired !== undefined) items = items.filter((test) => test.fastingRequired === query.fastingRequired);
  if (query.homeCollection !== undefined) items = items.filter((test) => test.homeCollection === query.homeCollection);
  if (query.available !== undefined) items = items.filter((test) => test.available === query.available);

  switch (query.sort || "popular") {
    case "price-asc": items.sort((a, b) => a.salePrice - b.salePrice); break;
    case "price-desc": items.sort((a, b) => b.salePrice - a.salePrice); break;
    case "rating": items.sort((a, b) => b.rating - a.rating || b.bookedCount - a.bookedCount); break;
    case "fastest": items.sort((a, b) => a.reportDeliveryHours - b.reportDeliveryHours); break;
    case "name": items.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: items.sort((a, b) => b.bookedCount - a.bookedCount || b.rating - a.rating);
  }

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * limit;
  return { items: items.slice(start, start + limit), meta: { page: safePage, limit, total, pageCount, hasNextPage: safePage < pageCount, hasPreviousPage: safePage > 1 } };
}

export type LabBookingLine = {
  cartKey: string;
  testId: string;
  centerId: string;
  slug: string;
  name: string;
  image: string;
  centerName: string;
  quantity: number;
  regularPrice: number;
  salePrice: number;
  reportDeliveryHours: number;
  sampleType: string;
  fastingRequired: boolean;
};

export function createLabBookingLine(test: LabTest, center: DiagnosticCenter, quantity = 1): LabBookingLine {
  return { cartKey: `${test.id}:${center.id}`, testId: test.id, centerId: center.id, slug: test.slug, name: test.name, image: test.image, centerName: center.name, quantity: Math.max(1, quantity), regularPrice: test.regularPrice, salePrice: test.salePrice, reportDeliveryHours: Math.min(test.reportDeliveryHours, center.reportDeliveryHours), sampleType: test.sampleType, fastingRequired: test.fastingRequired };
}

export function calculateLabCartSummary(lines: LabBookingLine[]) {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.salePrice * line.quantity, 0);
  const discount = lines.reduce((sum, line) => sum + (line.regularPrice - line.salePrice) * line.quantity, 0);
  const homeCollectionFee = itemCount > 0 ? 80 : 0;
  const vat = Math.round(subtotal * 0.03);
  const grandTotal = subtotal + vat + homeCollectionFee;
  return { itemCount, subtotal, discount, vat, homeCollectionFee, grandTotal };
}

export function buildLabFacets(tests: LabTest[], centers: DiagnosticCenter[]) {
  const count = (selector: (test: LabTest) => string) => Object.entries(tests.reduce<Record<string, number>>((acc, test) => { const key = selector(test); acc[key] = (acc[key] || 0) + 1; return acc; }, {})).map(([label, total]) => ({ label, total }));
  return { centers: centers.map((center) => ({ label: center.name, value: center.id })), organs: count((test) => test.organ), healthConcerns: count((test) => test.healthConcern), packageGroups: count((test) => test.packageGroup), sampleTypes: count((test) => test.sampleType) };
}
