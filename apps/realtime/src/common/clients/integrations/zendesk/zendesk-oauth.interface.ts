export interface ZendeskOauthModuleOptions {
  clientID: string;
  clientSecret: string;
}

export interface ZendeskFilterBase {
  id: number;
  name: string;
}

export interface ZendeskFilterLabel extends ZendeskFilterBase {}

export interface ZendeskFilterBrand extends ZendeskFilterBase {
  subdomain?: string;
}

export interface ZendeskFilterLocale extends ZendeskFilterBase {
  locale?: string;
}

export interface ZendeskFilterUserSegment extends ZendeskFilterBase {
  filterID: number | null;
}

export interface ZendeskFilterCategory {
  [locale: string]: ZendeskFilterBase[];
}

export interface ZendeskBaseFilters {
  labels?: ZendeskFilterLabel[];
  locales?: ZendeskFilterLocale[];
  categories?: ZendeskFilterCategory | ZendeskFilterLocale[];
}

export interface ZendeskBrandFilters extends ZendeskBaseFilters {
  brands?: ZendeskFilterBrand[];
}

export interface ZendeskFilters extends ZendeskBrandFilters {
  categories?: ZendeskFilterCategory;
}

export interface ZendeskUserSegmentFilters extends ZendeskBrandFilters {
  categories?: ZendeskFilterBase[];
}

export interface ZendeskCountFilters extends ZendeskBrandFilters {
  categories?: ZendeskFilterBase[];
  userSegments?: ZendeskFilterUserSegment[];
}

export interface ZendeskBaseResource {
  id: number;
  name: string;
}

export interface ZendeskExtendedResource extends ZendeskBaseResource {
  user_segment_id?: number | null;
  draft?: boolean;
  locale?: string;
}

export interface ZendeskArticle extends ZendeskExtendedResource {
  url: string;
  html_url: string;
  title: string;
  body: string;
}

export interface ZendeskArticlesResponse {
  count: number;
  page: number;
  page_count: number;
}
