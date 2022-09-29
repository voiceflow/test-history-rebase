import axios, { AxiosInstance } from 'axios';

export interface VersionOptions {
  token: string | null | (() => string | null);
  baseURL: string;
}

interface InternalOptions extends VersionOptions {
  version: string;
}

export abstract class Version {
  private readonly token: string | null | (() => string | null);

  protected readonly axios: AxiosInstance;

  constructor({ token, baseURL, version }: InternalOptions) {
    this.token = token;
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
