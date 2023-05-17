import { NestResource, NestResourceOptions } from '../../nest';

export class SSO extends NestResource {
  constructor(options: NestResourceOptions) {
    super({ ...options, path: '/sso' });
  }

  public async getGoogleLoginURL(redirectURI: string): Promise<string> {
    const { data } = await this.get<{ url: string }>('/oauth2/google', { params: { redirect_uri: redirectURI } });

    return data.url;
  }

  public async getFacebookLoginURL(redirectURI: string): Promise<string> {
    const { data } = await this.get<{ url: string }>('/oauth2/facebook', { params: { redirect_uri: redirectURI } });

    return data.url;
  }

  public async getSaml2LoginURL(email: string, redirectURI: string): Promise<string> {
    const { data } = await this.get<{ entryPoint: string }>('/saml2', { params: { email, redirect_uri: redirectURI } });

    return data.entryPoint;
  }

  public async validateSaml2Provider(providerID: string | number): Promise<void> {
    await this.post(`/saml2/${providerID}/validate`);
  }
}
