/* eslint-disable no-await-in-loop */
import { RequiredEntity } from '@voiceflow/dtos';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceBuilderCacheUtil } from './reference-builder-cache.util';

export class ReferenceRequiredEntityUtil extends ReferenceBaseBuilderUtil {
  private readonly requiredEntities: RequiredEntity[];

  private readonly intentResourceCache: ReferenceBuilderCacheUtil;

  private readonly messageResourceCache: ReferenceBuilderCacheUtil;

  constructor({
    assistantID,
    environmentID,
    requiredEntities,
    intentResourceCache,
    messageResourceCache,
  }: {
    assistantID: string;
    environmentID: string;
    requiredEntities: RequiredEntity[];
    intentResourceCache: ReferenceBuilderCacheUtil;
    messageResourceCache: ReferenceBuilderCacheUtil;
  }) {
    super({ assistantID, environmentID });

    this.requiredEntities = requiredEntities;
    this.intentResourceCache = intentResourceCache;
    this.messageResourceCache = messageResourceCache;
  }

  async build() {
    for (const requiredEntity of this.requiredEntities) {
      if (!requiredEntity.repromptID) continue;

      const intentResource = await this.intentResourceCache.getOrCreate(requiredEntity.intentID);

      if (!intentResource) continue;

      const messageResource = await this.messageResourceCache.getOrCreate(requiredEntity.repromptID);

      if (!messageResource) continue;

      this.buildReference({
        metadata: null,
        resourceID: messageResource.id,
        referrerResourceID: intentResource.id,
      });
    }

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }
}
