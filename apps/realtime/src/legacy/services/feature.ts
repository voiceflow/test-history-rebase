import { Environment, Utils } from '@voiceflow/common';

import { AbstractControl } from '@/legacy/control';
import config from '@/old_config';

interface Context {
  userID?: number;
  workspaceID?: string | null;
  organizationID?: string | null;
  workspaceCreatedAt?: string | Date;
}

class FeatureService extends AbstractControl {
  private toUnleashContext({ workspaceID, organizationID, ...unleashContext }: Context = {}) {
    return {
      ...unleashContext,
      ...(workspaceID && { workspaceID: this.clients.teamHashids.decode(workspaceID)[0] }),
      ...(organizationID && { organizationID: this.clients.teamHashids.decode(organizationID)[0] }),
    };
  }

  public isEnabled(featureID: string, context?: Context): boolean {
    if (this.config.NODE_ENV !== Environment.PRODUCTION && Utils.object.hasProperty(config.FEATURE_OVERRIDES, featureID)) {
      return config.FEATURE_OVERRIDES[featureID];
    }

    return this.clients.unleash.isEnabled(featureID, this.toUnleashContext(context));
  }
}

export default FeatureService;
