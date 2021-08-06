import { BroadcastChannel } from 'broadcast-channel';
import cuid from 'cuid';

import * as Query from '@/utils/query';

interface OKTAOptions {
  domain: string;

  clientID: string;
  redirectURI: string;
}

class OKTA {
  private channel = new BroadcastChannel<{ code?: string; state?: string; error?: string }>('voiceflow-login-sso');

  constructor(private scopes: string[]) {}

  public login({ clientID, domain, redirectURI }: OKTAOptions): Promise<{ code: string }> {
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
        `https://${domain}/oauth2/default/v1/authorize?client_id=${clientID}&response_type=code&scope=${this.scopes.join(
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
