import { Environment, Utils } from '@voiceflow/common';

import { AbstractControl } from '@/control';

interface Context {
  userID?: number;
  workspaceID?: string | null;
  organizationID?: string | null;
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
    if (this.config.NODE_ENV !== Environment.PRODUCTION && Utils.object.hasProperty(this.config.FEATURE_OVERRIDES, featureID)) {
      return this.config.FEATURE_OVERRIDES[featureID];
    }

    return this.clients.unleash.isEnabled(featureID, this.toUnleashContext(context));
  }
}

export default FeatureService;
