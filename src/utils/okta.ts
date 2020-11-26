import { BroadcastChannel } from 'broadcast-channel';
import cuid from 'cuid';

import * as Query from '@/utils/query';

type OKTAOptions = {
  domain: string;
  scopes: string[];
  clientID: string;
};

class OKTA {
  private domain: string;

  private scopes: string[];

  private clientID: string;

  private channel = new BroadcastChannel<{ code?: string; state?: string; error?: string }>('voiceflow-login-sso');

  constructor({ domain, scopes, clientID }: OKTAOptions) {
    this.domain = domain;

    this.scopes = scopes;

    this.clientID = clientID;
  }

  public login(redirectURI: string): Promise<{ code: string }> {
    return new Promise((resolve, reject) => {
      const state = `state-${cuid()}`;

      this.channel.onmessage = (data) => {
        this.channel.onmessage = null;

        if (data.error) {
          reject(data.error);
          return;
        }

        if (!data.code) {
          reject(new Error('SSO code is missing, please try again!'));
          return;
        }

        resolve({ code: data.code });
      };

      window.open(
        `https://${this.domain}/oauth2/default/v1/authorize?client_id=${this.clientID}&response_type=code&scope=${this.scopes.join(
          ' '
        )}&state=${state}&redirect_uri=${encodeURIComponent(redirectURI)}`
      );
    });
  }

  // called in the callback endpoint
  public async handleLogin() {
    const query = Query.parse(window.location.search);

    await this.channel.postMessage({
      code: query.code,
      state: query.state,
      error: query.error_description,
    });

    window.close();
  }

  public async closeChannel() {
    await this.channel.close();
  }
}

export default OKTA;
