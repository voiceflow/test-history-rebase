import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface NestResourceOptions {
  axios: AxiosInstance;
}

interface NestInternalOptions extends NestResourceOptions {
  path: `/${string}`;
}

export abstract class NestResource {
  protected readonly path: string;

  protected readonly axios: AxiosInstance;

  protected static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError)?.isAxiosError ?? false;
  }

  protected static processError(error: unknown) {
    return Promise.reject((NestResource.isAxiosError(error) ? error.response?.data : null) ?? error);
  }

  constructor({ path, axios }: NestInternalOptions) {
    this.path = path;
    this.axios = axios;
  }

  protected getUri(url: `/${string}`, options?: Omit<AxiosRequestConfig, 'url'>) {
    return this.axios.getUri({ url: `${this.axios.defaults.baseURL}${this.path}${url}`, ...options });
  }

  protected buildFullPath(url: `/${string}`) {
    return `${this.path}${url}`;
  }

  protected get<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.get<T, R, D>(this.buildFullPath(path), config).catch(NestResource.processError);
  }

  protected delete<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.delete<T, R, D>(this.buildFullPath(path), config).catch(NestResource.processError);
  }

  protected head<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.head<T, R, D>(this.buildFullPath(path), config).catch(NestResource.processError);
  }

  protected options<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.options<T, R, D>(this.buildFullPath(path), config).catch(NestResource.processError);
  }

  protected post<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.post<T, R, D>(this.buildFullPath(path), data, config).catch(NestResource.processError);
  }

  protected put<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.put<T, R, D>(this.buildFullPath(path), data, config).catch(NestResource.processError);
  }

  protected patch<T = any, R = AxiosResponse<T>, D = any>(path: `/${string}`, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.patch<T, R, D>(this.buildFullPath(path), data, config).catch(NestResource.processError);
  }
}
