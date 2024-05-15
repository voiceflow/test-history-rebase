/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { BadRequestException, NotFoundException, PayloadTooLargeException, TooManyRequestsException } from '@voiceflow/exception';
import * as fetch from '@voiceflow/fetch';
import undici from 'undici';
import { URLSearchParams } from 'url';

import { AesEncryptionClient } from '@/common/clients/aes-encryption/aes-encryption.client';
import { FetchClient } from '@/common/fetch';

import BaseOauthClient from '../base/base-oauth.interface';
import { IntegrationType } from '../base/dtos/base-oauth-type.enum';
import {
  ZendeskBaseResource,
  ZendeskCountFilters,
  ZendeskExtendedResource,
  ZendeskFilterBrand,
  ZendeskFilterCategory,
  ZendeskFilterLabel,
  ZendeskFilterLocale,
  ZendeskFilters,
  ZendeskFilterUserSegment,
  ZendeskOauthModuleOptions,
  ZendeskUserSegmentFilters,
} from './zendesk-oauth.interface';
import { ZENDESK_MODULE_OPTIONS_TOKEN } from './zendesk-oauth.module-definition';
import { isFetchResponseError } from './zendesk-oauth.utils';

@Injectable()
export class ZendeskOauthClient implements BaseOauthClient {
  private logger = new Logger(ZendeskOauthClient.name);

  public readonly type: IntegrationType = IntegrationType.ZENDESK;

  public readonly ZENDESK_MAX_PROCESSING_PAGES = 50;

  private readonly client: FetchClient;

  private clientSecret = this.options.clientSecret;

  private clientID = this.options.clientID;

  private readonly baseUrlTemplate: string = 'https://{subdomain}.zendesk.com';

  constructor(
    @Inject(AesEncryptionClient)
    protected readonly aesEncryptionClient: AesEncryptionClient,
    @Inject(ZENDESK_MODULE_OPTIONS_TOKEN)
    private options: ZendeskOauthModuleOptions
  ) {
    this.client = new fetch.FetchClient(undici.fetch);
  }

  private buildBaseUrl(subdomain?: string): string {
    return this.baseUrlTemplate.replace('{subdomain}', subdomain ?? '');
  }

  // Function to remove duplicates based on a specified key extractor function
  removeDuplicates<T>(array: T[], keyExtractor: (item: T) => any): T[] {
    const uniqueMap = new Map<any, T>();

    array.forEach((item) => {
      const key = keyExtractor(item);
      uniqueMap.set(key, item);
    });

    return Array.from(uniqueMap.values());
  }

  getUserSegmentsMapping(userSegments: ZendeskFilterUserSegment[]): Record<string, { id: number; name: string; filterID: number | null }> {
    let idCounter = 1;

    return userSegments.reduce((res, { id, name }) => {
      if (id === null) {
        return res;
      }

      res[id] = { id: idCounter, name, filterID: id };

      idCounter++;
      return res;
    }, {} as Record<string, { id: number; name: string; filterID: number | null }>);
  }

  getArticlesEndpoint(filters?: ZendeskUserSegmentFilters): { resourceKey: string; endpoint: string } {
    if (filters?.brands?.length !== 1) {
      throw new BadRequestException(`The 'brands' filter must contain one brand value and cannot be empty.`);
    }

    let resourceKey = 'articles';

    if (filters?.labels?.length || filters?.categories?.length) {
      resourceKey = 'results';
    }
    return { resourceKey, endpoint: '/api/v2/help_center/articles' };
  }

  filtersToQueryParams(filters?: ZendeskCountFilters): Record<string, string> {
    const queryParams: Record<string, string> = {};

    if (filters) {
      const { labels, locales, categories } = filters;

      if (labels?.length) queryParams.label_names = labels.map((label) => label.name).join(',');
      if (locales?.length) queryParams.locale = locales.map((locale) => locale.locale).join(',');
      if (categories?.length) queryParams.category = categories.map((category) => category.id).join(',');
    }

    return queryParams;
  }

  filterArticles<T extends ZendeskExtendedResource>({
    fetchedArticles,
    userSegmentsMapping = {},
    userSegmentIds,
    localesSetIds,
    includeUserSegments = true,
  }: {
    fetchedArticles: T[];
    userSegmentsMapping: Record<string, { id: number; name: string; filterID: number | null }>;
    userSegmentIds?: Set<number | null>;
    localesSetIds?: Set<string | undefined>;
    includeUserSegments: boolean;
  }): { userSegments: ZendeskFilterUserSegment[]; filteredArticles: T[] } {
    const filteredUserSegments: ZendeskFilterUserSegment[] = [];
    const filteredUserSegmentsSet = new Set<number | null>();

    const filteredArticles: T[] = [];

    fetchedArticles.forEach((article: T) => {
      if (
        article.user_segment_id !== undefined &&
        article.draft !== true &&
        (!userSegmentIds || userSegmentIds.has(article.user_segment_id)) &&
        (!localesSetIds || localesSetIds.has(article.locale))
      ) {
        if (includeUserSegments) {
          const user_segment =
            article.user_segment_id === null ? { id: 0, name: 'Everyone', filterID: null } : userSegmentsMapping[article.user_segment_id];

          if (!filteredUserSegmentsSet.has(user_segment.id)) {
            filteredUserSegments.push(user_segment);
            filteredUserSegmentsSet.add(user_segment.id);
          }
        }

        filteredArticles.push(article);
      }
    });

    return { userSegments: [...filteredUserSegments], filteredArticles };
  }

  handleFetchError(error: unknown): void {
    if (isFetchResponseError(error) && error.response.statusCode === HttpStatus.TOO_MANY_REQUESTS) {
      throw new TooManyRequestsException('Too many requests error, try again in one minute.');
    }
    if (isFetchResponseError(error) && error.response.statusCode === HttpStatus.NOT_FOUND) {
      throw new NotFoundException('You cannot access Help Center because it is not enabled on your account.');
    }
    this.logger.error(`[zendesk integration]: ${error instanceof Error ? error.message : 'unknown error'}`);
  }

  getAuthPageUrl({
    creatorID,
    overwrite,
    projectID,
    scope,
    redirectUrl,
    subdomain,
  }: {
    creatorID: number;
    overwrite: boolean;
    projectID: string;
    scope: string;
    redirectUrl: string;
    subdomain: string;
  }): string {
    const baseUrl = this.buildBaseUrl(subdomain);
    const endpoint = `/oauth/authorizations/new`;

    const stateParams = {
      creatorID,
      overwrite,
      projectID,
      subdomain,
    };

    const queryParams = new URLSearchParams({
      scope,
      client_id: this.clientID,
      response_type: 'code',
      redirect_uri: redirectUrl,
      state: this.aesEncryptionClient.encrypt(JSON.stringify(stateParams), false),
    });

    return `${baseUrl}${endpoint}?${queryParams.toString()}`;
  }

  getSearchUrlByFilters({
    filters,
    endpoint,
    subdomain,
    page = 1,
    perPage = 100,
  }: {
    filters?: ZendeskCountFilters;
    page?: number;
    subdomain?: string;
    perPage?: number;
    endpoint?: string;
  }): string {
    const baseUrl = this.buildBaseUrl(subdomain);
    let endpointWithParams = endpoint;

    let filterParams = {};

    if (filters?.labels?.length || filters?.categories?.length) {
      filterParams = this.filtersToQueryParams(filters);
      endpointWithParams = `${endpoint}/search`;
    }

    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
      ...filterParams,
    });

    endpointWithParams = `${endpointWithParams}?${queryParams.toString()}`;

    return `${baseUrl}${endpointWithParams}`;
  }

  async fetchAccessToken({
    code,
    scope,
    redirectUrl,
    subdomain,
  }: {
    code: string;
    scope: string;
    redirectUrl: string;
    subdomain: string;
  }): Promise<string> {
    const baseUrl = this.buildBaseUrl(subdomain);
    const endpoint = '/oauth/tokens';

    const headers = {
      'content-type': 'application/json',
    };

    const response = await this.client.post(`${baseUrl}${endpoint}`, {
      json: {
        grant_type: 'authorization_code',
        code,
        scope,
        client_id: this.clientID,
        client_secret: this.clientSecret,
        redirect_uri: redirectUrl,
      },
      headers,
    });

    if (response.status !== HttpStatus.OK) {
      throw new Error(`HTTP error! Fetch oauth token error, status: ${response.status}`);
    }

    const data = await (response.json() as Promise<{ access_token: string }>);

    return data.access_token;
  }

  private async fetchData({
    accessToken,
    endpoint,
    subdomain,
    url,
    maxRetries = 3, // Adjust the number of retries as needed
    retryDelay = 1000, // Adjust the delay between retries in milliseconds as needed
  }: {
    accessToken: string;
    endpoint?: string;
    subdomain?: string;
    url?: string;
    maxRetries?: number;
    retryDelay?: number;
  }): Promise<any> {
    if (!endpoint && !url) {
      throw new Error('Endpoint and url cant be both empty.');
    }
    const baseUrl = this.buildBaseUrl(subdomain);

    const headers = { Authorization: `Bearer ${accessToken}` };

    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
        const response = await this.client.get(url ?? `${baseUrl}${endpoint}`, { headers });

        if (response.status !== HttpStatus.OK) {
          throw new Error(`HTTP error! Fetch data error, status: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        this.handleFetchError(error);

        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw new BadRequestException(`Max retries reached. Unable to fetch data.`);
  }

  async fetchAllItems({
    accessToken,
    resourceKey,
    subdomain,
    endpoint,
    filters,
  }: {
    accessToken: string;
    resourceKey: string;
    subdomain?: string;
    endpoint?: string;
    filters?: ZendeskCountFilters;
  }): Promise<(ZendeskExtendedResource & { subdomain?: string })[]> {
    const initialPageData = await this.fetchData({
      accessToken,
      url: this.getSearchUrlByFilters({ page: 1, perPage: 100, filters, endpoint, subdomain }),
      subdomain,
    });

    const pagesCount = initialPageData.page_count ?? 1;

    if (pagesCount > this.ZENDESK_MAX_PROCESSING_PAGES) {
      throw new PayloadTooLargeException('Due to the large number of articles, need to make the filters more strict.');
    }

    const additionalPagePromises =
      pagesCount > 1
        ? Array.from({ length: pagesCount - 1 }, (_, pageIndex) => {
            const url = this.getSearchUrlByFilters({ page: pageIndex + 2, perPage: 100, filters, endpoint, subdomain });
            return this.fetchData({ accessToken, url, subdomain });
          })
        : [];

    const additionalPagesData = await Promise.all(additionalPagePromises);

    // Combine data from all pages into a single array
    const allPages = [initialPageData, ...additionalPagesData];

    return allPages.flatMap((pageData) => pageData[resourceKey]);
  }

  async fetchLabels(accessToken: string, subdomain?: string): Promise<ZendeskFilterLabel[]> {
    const endpoint = '/api/v2/help_center/articles/labels';

    return this.fetchData({ endpoint, accessToken, subdomain }).then((data) =>
      (data?.labels ?? []).map((label: ZendeskFilterLabel) => ({
        id: label.id,
        name: label.name,
      }))
    );
  }

  async fetchUserSegments(accessToken: string, subdomain?: string): Promise<ZendeskFilterUserSegment[]> {
    const endpoint = '/api/v2/help_center/user_segments';
    const resourceKey = 'user_segments';

    const data: ZendeskBaseResource[] = await this.fetchAllItems({ accessToken, resourceKey, endpoint, subdomain });

    return data.map((userSegment) => ({
      id: userSegment.id,
      name: userSegment.name,
      filterID: userSegment.id,
    }));
  }

  async fetchCategories(accessToken: string, subdomain?: string): Promise<ZendeskFilterCategory> {
    const endpoint = '/api/v2/help_center/categories';
    const resourceKey = 'categories';

    const data: (ZendeskBaseResource & { locale?: string })[] = await this.fetchAllItems({ accessToken, resourceKey, endpoint, subdomain });

    // Group categories by locale
    return data.reduce((acc, category) => {
      const { locale } = category;

      if (!locale) {
        return acc;
      }

      if (!acc[locale]) {
        acc[locale] = [];
      }

      acc[locale].push({
        id: category.id,
        name: category.name,
      });

      return acc;
    }, {} as { [locale: string]: Array<{ id: number; name: string }> });
  }

  async fetchLocales(accessToken: string, subdomain?: string): Promise<ZendeskFilterLocale[]> {
    const endpoint = '/api/v2/locales';
    const resourceKey = 'locales';

    const data: (ZendeskBaseResource & { locale?: string })[] = await this.fetchAllItems({ accessToken, resourceKey, endpoint, subdomain });

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      locale: item.locale ?? '',
    }));
  }

  async fetchBrands(accessToken: string, subdomain?: string): Promise<ZendeskFilterBrand[]> {
    const endpoint = '/api/v2/brands';
    const resourceKey = 'brands';

    const data: (ZendeskBaseResource & { subdomain?: string })[] = await this.fetchAllItems({ accessToken, resourceKey, endpoint, subdomain });

    return data.map((brand) => ({
      id: brand.id,
      name: brand.name,
      subdomain: brand.subdomain ?? '',
    }));
  }

  async fetchFiltersByBrand(accessToken: string, brandSubdomain?: string): Promise<ZendeskFilters> {
    const [brands, labels, categories, locales] = await Promise.all([
      this.fetchBrands(accessToken, brandSubdomain),
      this.fetchLabels(accessToken, brandSubdomain),
      this.fetchCategories(accessToken, brandSubdomain),
      this.fetchLocales(accessToken, brandSubdomain),
    ]);

    return {
      brands,
      labels,
      categories,
      locales,
    };
  }

  async fetchFilters(accessToken: string, integrationSubdomain: string, subdomain?: string): Promise<ZendeskFilters> {
    if (!subdomain) {
      return {
        brands: this.removeDuplicates(await this.fetchBrands(accessToken, integrationSubdomain), (item: ZendeskFilterBrand) => item.id),
        labels: [],
        categories: {},
        locales: [],
      };
    }

    const filters = await this.fetchFiltersByBrand(accessToken, subdomain);

    return {
      brands: this.removeDuplicates(
        (filters?.brands ?? []).filter((brand) => brand.subdomain === subdomain),
        (item: ZendeskFilterBrand) => item.id
      ),
      labels: filters.labels,
      categories: filters.categories,
      locales: filters.locales,
    };
  }

  async fetchUserSegmentsByBrand({
    accessToken,
    endpoint,
    resourceKey,
    filters,
    brandSubdomain,
  }: {
    accessToken: string;
    endpoint: string;
    resourceKey: string;
    filters?: ZendeskUserSegmentFilters;
    brandSubdomain?: string;
  }): Promise<{ articles: ZendeskExtendedResource[]; userSegments: ZendeskFilterUserSegment[] }> {
    const [filteredArticles, userSegments] = await Promise.all([
      this.fetchAllItems({ accessToken, filters, resourceKey, endpoint, subdomain: brandSubdomain }),
      this.fetchUserSegments(accessToken, brandSubdomain),
    ]);

    return {
      articles: filteredArticles,
      userSegments,
    };
  }

  async fetchUserSegmentsByFilters(
    accessToken: string,
    filters?: ZendeskCountFilters
  ): Promise<{
    filteredArticles: ZendeskExtendedResource[];
    userSegments: ZendeskFilterUserSegment[];
  }> {
    const { resourceKey, endpoint } = this.getArticlesEndpoint(filters);

    const brandUserSegmentsByFilters: {
      articles: ZendeskExtendedResource[];
      userSegments: ZendeskFilterUserSegment[];
    }[] = await Promise.all(
      (filters?.brands ?? []).map((brand: Partial<ZendeskFilterBrand>) =>
        this.fetchUserSegmentsByBrand({ accessToken, endpoint, resourceKey, filters, brandSubdomain: brand.subdomain })
      )
    );

    const userSegments = brandUserSegmentsByFilters.flatMap((brand) => brand.userSegments);
    const userSegmentsMapping = this.getUserSegmentsMapping(userSegments);

    const fetchedArticles = brandUserSegmentsByFilters.flatMap(({ articles }) => articles);

    let userSegmentIds: Set<number | null> | undefined;
    let localesSetIds: Set<string | undefined> | undefined;

    if (filters?.userSegments?.length) {
      userSegmentIds = new Set((filters?.userSegments ?? []).map((segment) => segment.filterID));
    }

    if (filters?.locales?.length) {
      localesSetIds = new Set((filters?.locales ?? []).map((locale) => locale.locale?.toLowerCase()));
    }

    return this.filterArticles({ fetchedArticles, userSegmentsMapping, userSegmentIds, localesSetIds, includeUserSegments: true });
  }

  async fetchCountByFilters(
    accessToken: string,
    filters?: ZendeskCountFilters
  ): Promise<{
    count: number;
    userSegments: ZendeskFilterUserSegment[];
  }> {
    const { userSegments, filteredArticles } = await this.fetchUserSegmentsByFilters(accessToken, filters);

    return { count: filteredArticles.length, userSegments };
  }
}
