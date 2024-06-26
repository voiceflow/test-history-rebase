import { Utils } from '@voiceflow/common';
import type { Logger } from '@voiceflow/logger';
import type { LoguxControl } from '@voiceflow/socket-utils';
import * as Unleash from 'unleash-client';
import type { Required } from 'utility-types';

import type { BaseOptions } from '../types';
import type { StrategiesContext } from './strategies';
import strategies from './strategies';

const PRIVATE_CLOUD_CONFIG_NAME = 'private_cloud_config';
const REFRESH_INTERVAL = 1000 * 30; // 30 seconds

export interface ExternalContext extends StrategiesContext {
  userID?: number;
}

interface InternalContext extends StrategiesContext, Unleash.Context {}
interface VariantContext extends Required<InternalContext, 'appName' | 'environment'> {}

class UnleashClient implements LoguxControl {
  private instance: Unleash.Unleash;

  private forceDisabled = false;

  private staticVariantContext: Pick<VariantContext, 'appName' | 'environment'>;

  private log: Logger;

  constructor({ config, log }: BaseOptions) {
    this.log = log;
    this.staticVariantContext = {
      appName: config.CLOUD_ENV,
      environment: config.DEPLOY_ENV,
    };

    this.instance = Unleash.initialize({
      ...this.staticVariantContext,
      url: config.UNLEASH_URL,
      strategies,
      instanceId: Utils.id.cuid(),
      disableMetrics: true,
      customHeaders: { Authorization: config.UNLEASH_API_KEY },
      refreshInterval: REFRESH_INTERVAL,
      disableAutoStart: true,
    });
  }

  private getContext({ userID, ...internalContext }: ExternalContext = {}): InternalContext {
    return {
      ...internalContext,
      ...(userID ? { userId: String(userID) } : {}),
    };
  }

  private getVariantContext(internalContext: InternalContext): VariantContext {
    return {
      ...this.staticVariantContext,
      ...internalContext,
    };
  }

  private getConfigVariant(context: VariantContext): null | Record<string, any> {
    const variant = Unleash.getVariant(PRIVATE_CLOUD_CONFIG_NAME, context);

    if (variant.enabled && !!variant.payload) {
      try {
        const payload = JSON.parse(variant.payload.value);

        if (typeof payload === 'object') return payload;
      } catch (e) {
        // ignore variant
      }
    }

    return null;
  }

  private isVariantFeatureEnabled(featureID: string, key: string, isEnabled: boolean): boolean {
    return key.startsWith('ff_') && key.slice(3) === featureID && isEnabled;
  }

  isEnabled(featureID: string, externalContext?: ExternalContext): boolean {
    if (this.forceDisabled) return false;

    const context = this.getContext(externalContext);
    const variant = this.getConfigVariant(this.getVariantContext(context));

    if (
      variant &&
      Object.entries(variant).some(([key, value]) => this.isVariantFeatureEnabled(featureID, key, value))
    ) {
      return true;
    }

    return Unleash.isEnabled(featureID, context);
  }

  getAllFeatures(): Unleash.ClientFeaturesResponse['features'] {
    if (this.forceDisabled) return [];

    return Unleash.getFeatureToggleDefinitions() ?? [];
  }

  getFeatureStatuses(context?: InternalContext): Record<string, { isEnabled: boolean }> {
    return Object.fromEntries(
      this.getAllFeatures().map(({ name }) => [name, { isEnabled: this.isEnabled(name, context) }])
    );
  }

  getVariantConfig<Value>(userID: number, configName: string): Value | null {
    const variant = this.getConfigVariant(this.getVariantContext(this.getContext({ userID })));

    return variant?.[configName] ?? null;
  }

  async setup() {
    try {
      await this.instance.start();
    } catch (e) {
      if (process.env.NODE_ENV !== 'local') {
        throw new Error();
      }

      this.log.warn(
        'WARNING: failed to initialize unleash client, falling back to mock client; all feature flags will be disabled'
      );

      this.instance.destroy();
    }
  }

  destroy() {
    this.instance.destroy();
  }
}

export default UnleashClient;
