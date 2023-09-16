/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios';

export interface NestVersionOptions {
  token?: string | null | (() => string | null);
  baseURL: string;
}

interface NestInternalOptions extends NestVersionOptions {
  version: string;
}

export abstract class NestVersion {
  private readonly _token: string | null | (() => string | null);

  protected readonly axios: AxiosInstance;

  protected get token(): string | null {
    return typeof this._token === 'function' ? this._token() : this._token;
  }

  constructor({ token = null, baseURL, version }: NestInternalOptions) {
    this.axios = axios.create({ baseURL: `${baseURL}/${version}` });
    this._token = token;

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axios.interceptors.request.use((config) => {
      const { token } = this;

      if (token) {
        Object.assign(config, { headers: { ...config.headers, authorization: `Bearer ${token}` } });
      }

      console.log('Request:', config.method?.toUpperCase(), config.url);

      return config;
    });
  }
}
