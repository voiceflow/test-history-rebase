import axios, { AxiosInstance } from 'axios';

export interface NestVersionOptions {
  token?: string | null | (() => string | null);
  baseURL: string;
}

interface NestInternalOptions extends NestVersionOptions {
  version: string;
}

export abstract class NestVersion {
  private readonly token: string | null | (() => string | null);

  protected readonly axios: AxiosInstance;

  constructor({ token, baseURL, version }: NestInternalOptions) {
    this.token = token ?? null;
    this.axios = axios.create({ baseURL: `${baseURL}/${version}` });

    this.axios.interceptors.request.use((config) => {
      const token = typeof this.token === 'function' ? this.token() : this.token;

      if (token) {
        Object.assign(config, { headers: { ...config.headers, authorization: `Bearer ${token}` } });
      }

      return config;
    });
  }
}
