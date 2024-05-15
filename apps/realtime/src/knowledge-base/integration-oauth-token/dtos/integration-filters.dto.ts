import { KnowledgeBaseDocumentRefreshRate } from '@voiceflow/dtos';
import { z } from 'zod';

export const ZendeskFilterBase = z.object({
  id: z.number(),
  name: z.string(),
});

export const ZendeskFilterBrand = ZendeskFilterBase.extend({
  subdomain: z.string(),
});

export const ZendeskFilterLocale = ZendeskFilterBase.extend({
  locale: z.string(),
});

export const ZendeskFilterUserSegment = ZendeskFilterBase.extend({
  filterID: z.number().nullable(),
});

export const ZendeskFilterCategory = z.record(z.array(ZendeskFilterBase));

export const ZendeskBaseFilters = z.object({
  labels: z.array(ZendeskFilterBase).optional(),
  locales: z.array(ZendeskFilterLocale).optional(),
  categories: z.union([ZendeskFilterCategory, z.array(ZendeskFilterLocale)]).optional(),
});

export const ZendeskBrandFilters = ZendeskBaseFilters.extend({
  brands: z.array(ZendeskFilterBrand).optional(),
});

export const ZendeskFilters = ZendeskBrandFilters.extend({
  categories: ZendeskFilterCategory.optional(),
});

export const ZendeskUserSegmentFilters = ZendeskBrandFilters.extend({
  categories: z.array(ZendeskFilterBase).optional(),
});

export const ZendeskCountFilters = ZendeskBrandFilters.extend({
  categories: z.array(ZendeskFilterBase).optional(),
  userSegments: z.array(ZendeskFilterUserSegment).optional(),
});

export const ZendeskUserSegmentsRequest = z.object({
  data: z
    .object({
      filters: ZendeskCountFilters.optional(),
    })
    .optional(),
});

export type ZendeskUserSegmentsRequest = z.infer<typeof ZendeskUserSegmentsRequest>;

export const ZendeskArticlesUploadRequest = z.object({
  data: z
    .object({
      filters: ZendeskCountFilters.optional(),
      refreshRate: z.nativeEnum(KnowledgeBaseDocumentRefreshRate).optional(),
    })
    .optional(),
});

export type ZendeskArticlesUploadRequest = z.infer<typeof ZendeskArticlesUploadRequest>;

export const ZendeskUserSegmentsResponse = z.object({
  data: z.object({
    userSegments: z.array(ZendeskFilterUserSegment),
  }),
});

export type ZendeskUserSegmentsResponse = z.infer<typeof ZendeskUserSegmentsResponse>;

export const ZendeskFiltersResponse = z.object({
  data: ZendeskFilters,
});

export type ZendeskFiltersResponse = z.infer<typeof ZendeskFiltersResponse>;

export const ZendeskCountByFiltersResponse = z.object({
  data: z.object({
    count: z.number(),
    userSegments: z.array(ZendeskFilterUserSegment),
  }),
});

export type ZendeskCountByFiltersResponse = z.infer<typeof ZendeskCountByFiltersResponse>;
