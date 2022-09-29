import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ResourceOptions {
  axios: AxiosInstance;
}

interface InternalOptions extends ResourceOptions {
  path: `/${string}`;
}

export abstract class Resource {
  protected readonly path: string;

  protected readonly axios: AxiosInstance;

  protected static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError)?.isAxiosError ?? false;
  }

  protected static processError(error: unknown) {
    return Promise.reject((Resource.isAxiosError(error) ? error.response?.data : null) ?? error);
  }

  constructor({ path, axios }: InternalOptions) {
    this.path = path;
    this.axios = axios;
  }

  protected get<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.get<T, R, D>(`${this.path}${url}`, config).catch(Resource.processError);
  }

  protected delete<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.delete<T, R, D>(`${this.path}${url}`, config).catch(Resource.processError);
  }

  protected head<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.head<T, R, D>(`${this.path}${url}`, config).catch(Resource.processError);
  }

  protected options<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.options<T, R, D>(`${this.path}${url}`, config).catch(Resource.processError);
  }

  protected post<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.post<T, R, D>(`${this.path}${url}`, data, config).catch(Resource.processError);
  }

  protected put<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.put<T, R, D>(`${this.path}${url}`, data, config).catch(Resource.processError);
  }

  protected patch<T = any, R = AxiosResponse<T>, D = any>(url: `/${string}`, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axios.patch<T, R, D>(`${this.path}${url}`, data, config).catch(Resource.processError);
  }
}
