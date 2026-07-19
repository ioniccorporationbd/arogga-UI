export interface Product {
  id: string;
  uuid: string;
  productGroupId: string;
  sourceProductId: string;
  sku: string;
  barcode: string;
  slug: string;

  status: "active" | "inactive" | "draft";
  visibility: "public" | "private" | "hidden";
  productType: "simple" | "variable";
  condition: "new" | "used" | "refurbished";

  name: string;
  shortName: string;
  subtitle: string;

  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    manufacturer: string;
    countryOfOrigin: string | null;
  };

  taxonomy: {
    department: {
      id: string;
      name: string;
      slug: string;
    };

    category: {
      id: string;
      name: string;
      slug: string;
    };

    subCategory: {
      id: string;
      name: string;
      slug: string;
    };

    collections: Array<{
      id: string;
      name: string;
      slug: string;
    }>;

    tags: string[];
  };

  content: {
    shortDescription: string;
    description: string;
    highlights: string[];

    features: Array<{
      title: string;
      value: string;
    }>;

    benefits: string[];
    howToUse: string[];
    ingredients: string[];
    warnings: string[];
    storageInstructions: string[];

    additionalInfo: {
      shade: string | null;
      shadeHex: string | null;
      finish: string | null;
      coverage: string | null;
      skinType: string | null;
      form: string | null;
    };
  };

  pricing: {
    currency: string;
    regularPrice: number;
    salePrice: number | null;
    costPrice: number;
    compareAtPrice: number | null;

    discount: {
      isDiscounted: boolean;
      type: "percentage" | "fixed" | null;
      value: number;
      percentage: number;
      startsAt: string | null;
      endsAt: string | null;
    };

    tax: {
      taxable: boolean;
      taxClass: string;
      rate: number;
      priceIncludesTax: boolean;
    };

    priceRange: {
      minimum: number;
      maximum: number;
    };
  };

  inventory: {
    trackQuantity: boolean;
    stockStatus:
      | "in_stock"
      | "out_of_stock"
      | "low_stock";

    totalQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    incomingQuantity: number;
    lowStockThreshold: number;
    allowBackorder: boolean;
    backorderLimit: number;

    warehouses: Array<{
      warehouseId: string;
      warehouseName: string;
      quantity: number;
      reservedQuantity: number;
      availableQuantity: number;
      location: string;
    }>;
  };

  media: {
    featuredImage: {
      id: string;
      url: string;
      thumbnailUrl: string;
      alt: string;
      title: string;
      width: number;
      height: number;
      mimeType: string;
    };

    gallery: Array<{
      id: string;
      url: string;
      thumbnailUrl?: string;
      alt: string;
      title?: string;
      width?: number;
      height?: number;
      mimeType?: string;
    }>;

    video: {
      url: string;
      thumbnail?: string;
    } | null;
  };

  variants: unknown[];

  options: Array<{
    name: string;
    slug: string;
    value: string;
    colorHex?: string | null;
  }>;

  attributes: Array<{
    id: string;
    name: string;
    slug: string;
    value: string;
    visible: boolean;
    filterable: boolean;
    comparable: boolean;
  }>;

  shipping: {
    requiresShipping: boolean;
    shippingClass: string;
    freeShipping: boolean;

    weight: {
      value: number;
      unit: string;
    };

    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };

    package: {
      type: string;
      quantityPerPackage: number;
    };

    delivery: {
      estimatedMinimumDays: number;
      estimatedMaximumDays: number;
      sameDayEligible: boolean;
    };
  };

  purchaseRules: {
    minimumQuantity: number;
    maximumQuantity: number;
    quantityStep: number;
    maximumPerOrder: number;
    prescriptionRequired: boolean;
    ageRestricted: boolean;
    requiresApproval: boolean;
  };

  ratings: {
    average: number;
    count: number;
    verifiedPurchaseCount: number;

    distribution: {
      "5": number;
      "4": number;
      "3": number;
      "2": number;
      "1": number;
    };
  };

  reviews: {
    enabled: boolean;
    requiresPurchase: boolean;
    requiresApproval: boolean;
  };

  seller: {
    id: string;
    name: string;
    type: string;
    fulfilledBy: string;

    warranty: {
      available: boolean;
      duration: number | null;
      durationUnit: string | null;
      description: string | null;
    };

    returnPolicy: {
      returnable: boolean;
      returnWindowDays: number;
      conditions: string[];
    };
  };

  compliance: {
    isHazardous: boolean;
    isFragile: boolean;
    requiresColdStorage: boolean;
    regulatedProduct: boolean;
    licenseRequired: boolean;
    documents: unknown[];
  };

  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;

    openGraph: {
      title: string;
      description: string;
      image: string;
      type: string;
    };

    index: boolean;
    follow: boolean;
  };

  urls: {
    local: string;
    api: string;
    source: string;
  };

  relatedProducts: {
    relatedProductIds: string[];
    frequentlyBoughtTogetherIds: string[];
    crossSellProductIds: string[];
    upSellProductIds: string[];
  };

  availability: {
    isAvailable: boolean;
    availableFrom: string | null;
    availableUntil: string | null;
    salesChannels: string[];
    regions: string[];
  };

  analytics: {
    viewCount: number;
    salesCount: number;
    wishlistCount: number;
    cartAdditionCount: number;
    conversionRate: number;
  };

  localization: {
    defaultLanguage: string;

    translations: {
      en: {
        name: string;
        shortDescription: string;
      };

      bn: {
        name: string;
        shortDescription: string;
      };
    };
  };

  audit: {
    source: string;
    legacyId: number;
    sourceRecordIsReal: boolean;
    catalogVariantGenerated: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    deletedAt: string | null;
    version: number;
  };
}