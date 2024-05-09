import { Inject, Injectable } from '@nestjs/common';
import { KBTag, KBTagRecord, KBTagsFilter, KnowledgeBaseDocument } from '@voiceflow/dtos';
import { BadRequestException, ForbiddenException, NotAcceptableException, NotFoundException } from '@voiceflow/exception';
import { KnowledgeBaseORM, VersionKnowledgeBaseDocument } from '@voiceflow/orm-designer';
import { Identity } from '@voiceflow/sdk-auth';
import { AuthService } from '@voiceflow/sdk-auth/nestjs';
import type { Request } from 'express';
import { ObjectId } from 'mongodb';

import { MutableService } from '@/common';

@Injectable()
export class KnowledgeBaseTagService extends MutableService<KnowledgeBaseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  MAX_KB_TAGS = 300;

  MAX_KB_TAGS_PER_DOCUMENT = 5;

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {
    super();
  }

  /* Get */

  async getTags(assistantID: string) {
    return this.orm.findAllTags(assistantID);
  }

  async getOneTag(assistantID: string, tagID: string) {
    return this.orm.findOneTag(assistantID, tagID);
  }

  async getTagsRecords(assistantID: string) {
    return this.orm.findAllTagsRecords(assistantID);
  }

  /* Patch */

  async patchOneTag(assistantID: string, tagID: string, data: Partial<KBTag>) {
    await this.validateKBTagExists(assistantID, tagID);

    const { label } = data;
    if (!label) throw new BadRequestException('no tag label');
    await this.validateKBTagLabelExists(assistantID, label);

    await this.orm.upsertOneTag(assistantID, { label, tagID });
    return this.getOneTag(assistantID, tagID);
  }

  /* Create */

  async createOneTag(assistantID: string, tag: Partial<KBTag>) {
    const { label } = tag;

    const tagID = tag.tagID && ObjectId.isValid(tag.tagID) ? tag.tagID : new ObjectId().toHexString();

    if (!label) throw new BadRequestException('no tag label');
    await this.validateKBTagLabelExists(assistantID, label);

    const newTag = { label, tagID };
    await this.orm.upsertOneTag(assistantID, newTag);

    return this.getOneTag(assistantID, tagID);
  }

  /* Delete */

  async deleteOneTag(assistantID: string, tagID: string) {
    await this.validateKBTagExists(assistantID, tagID);

    await this.orm.deleteOneTag(assistantID, tagID);

    await this.orm.detachTagFromManyDocuments(assistantID, tagID);

    // const removeTagRefreshJobs: Pick<BaseModels.RefreshJob.Model, 'projectID' | 'documentID' | 'tags'>[] = [];

    // Object.entries(project?.knowledgeBase?.documents ?? {}).forEach(([documentID, document]) => {
    //   if (document?.tags?.includes(tagID)) {
    //     // delete tags for KB refresh job, if object exists
    //     removeTagRefreshJobs.push({ projectID, documentID, tags: [tagID] });
    //   }
    // });

    // TODO: await this.models.refreshJobs.bulkDettachTags(removeTagRefreshJobs);

    // TODO: update tags list in vector DB metadata (parser service)
    // await Promise.allSettled(removeTagRefreshJobs.map(({ documentID }) => this.updateKBParserTags(projectID, documentID, requestConfig)));
  }

  /* Validation */

  async validateKBTagExists(assistantID: string, tagID: string) {
    // check that KB tag exists
    const tags = await this.orm.findAllTags(assistantID);

    const tag: KBTag | null | undefined = tags?.find((t) => t.tagID === tagID);

    if (!tag) {
      throw new NotFoundException("tag doesn't exist");
    }
  }

  async validateKBTagLabelExists(assistantID: string, label: string) {
    const existingTags = await this.orm.findAllTags(assistantID);

    existingTags.forEach((tag) => {
      if (tag.label === label) {
        throw new BadRequestException('label already exists');
      }
    });
  }

  /* Utils */

  async limitKBTagsDocument(document?: KnowledgeBaseDocument | VersionKnowledgeBaseDocument, additionalAmount?: number) {
    // check amout of existing KB tags for specific KB Document
    let tagsAmount = 0;

    if (document?.tags) {
      tagsAmount += document?.tags.length || 0;
    }

    if (additionalAmount) {
      tagsAmount += additionalAmount;
    }

    if (tagsAmount > this.MAX_KB_TAGS_PER_DOCUMENT) {
      throw new NotAcceptableException(`max ${[this.MAX_KB_TAGS_PER_DOCUMENT]} tags can be attached to a document.`);
    }
  }

  async tagNamesToObjectIds(assistantID: string, tags: string[], existingTags?: KBTagRecord): Promise<Set<string>> {
    const tagsRecords = existingTags ?? (await this.getTagsRecords(assistantID)) ?? [];

    const tagIds = new Set<string>();

    Object.keys(tagsRecords)
      .filter((tagID) => tags.includes(tagsRecords[tagID].label))
      .forEach((tag) => tagIds.add(tag));

    return tagIds;
  }

  async tagObjectIdsToNames({
    assistantID,
    tagIDs,
    existingTags,
  }: {
    assistantID: string;
    tagIDs: string[];
    existingTags?: KBTagRecord;
  }): Promise<Set<string>> {
    const tagsRecords = existingTags ?? (await this.getTagsRecords(assistantID)) ?? {};

    const tagNames = new Set<string>();

    tagIDs.forEach(async (tagID) => {
      if (tagsRecords[tagID]) {
        tagNames.add(tagsRecords[tagID].label);
      } else {
        // Perform update only if the tag doesn't exist in project
        this.orm.upsertOneTag(assistantID, { tagID, label: '' });
      }
    });

    return tagNames;
  }

  convertToArray = (tagIDs: string[] | string | undefined): string[] => {
    if (tagIDs === undefined) {
      return [];
    }

    // check format: /?tagIDs=tag1&tagIDs=tag2
    if (Array.isArray(tagIDs)) {
      return tagIDs;
    }

    try {
      const parsedInput = JSON.parse(tagIDs);

      // check format: /?tagIDs=["tag1","tag2"]
      if (Array.isArray(parsedInput)) {
        return parsedInput;
      }
    } catch (error) {
      // Ignore JSON parsing errors
    }

    // for formats: /?tagIDs=tag1,tag2 or /?tagIDs=tag1
    return tagIDs.split(',').map((tag) => tag.trim());
  };

  async checkKBTagLabelsExists({
    assistantID,
    tagLabels,
    existingTags,
    createIfMissingTags,
  }: {
    assistantID: string;
    tagLabels: string[];
    existingTags?: KBTagRecord;
    createIfMissingTags?: boolean;
  }) {
    // check that KB tag labels exists, this is not atomic but it prevents a class of bugs
    const tags = existingTags ?? (await this.getTagsRecords(assistantID)) ?? {};

    const tagLabelMap: Record<string, string> = {};

    Object.entries(tags).forEach(([tagID, tag]) => {
      tagLabelMap[tag.label] = tagID;
    });

    const nonExistingTags = tagLabels.filter((label) => !tagLabelMap[label]);

    if (nonExistingTags.length > 0) {
      if (createIfMissingTags) {
        if (Object.keys(tags).length + nonExistingTags.length > this.MAX_KB_TAGS) {
          throw new BadRequestException(`${[this.MAX_KB_TAGS]} tag limit per project exceeded. Please delete a tag to add a new one.`);
        }

        const objectsForUpdate = nonExistingTags.map((label) => {
          const objectId = new ObjectId().toHexString();

          return { tagID: objectId, label };
        });

        await this.orm.upsertManyTags(assistantID, objectsForUpdate);
      } else {
        const formattedTags = nonExistingTags.map((tag) => `\`${tag}\``).join(', ');
        throw new NotFoundException(`tags with the following labels do not exist: ${formattedTags}`);
      }
    }
  }

  containsAtLeastOneValue(list1: string[], list2: string[]): boolean {
    return list1.some((item) => list2.includes(item));
  }

  async filterDocumentsByTags(tagsFilter: KBTagsFilter, documents: VersionKnowledgeBaseDocument[]) {
    const includeTagIDs: string[] = tagsFilter?.include?.items ?? [];
    const excludeTagIDs: string[] = tagsFilter?.exclude?.items ?? [];
    const includeAllTagged: boolean = tagsFilter?.includeAllTagged ?? false;
    const includeAllNonTagged: boolean = tagsFilter?.includeAllNonTagged ?? false;

    let filteredTotal = 0;
    const filteredDocuments: VersionKnowledgeBaseDocument[] = [];

    Object.values(documents || {}).forEach((document) => {
      const hasTags = document.tags && document.tags.length > 0;
      const includesIncludeTags = this.containsAtLeastOneValue(document.tags ?? [], includeTagIDs);
      const includesExcludeTags = this.containsAtLeastOneValue(document.tags ?? [], excludeTagIDs);

      if (
        (!hasTags && includeAllNonTagged) ||
        (hasTags && includesIncludeTags && !includesExcludeTags) ||
        (hasTags && includeAllTagged && !includesExcludeTags)
      ) {
        filteredDocuments.push(document);
        filteredTotal++;
      }
    });

    return { filteredTotal, filteredDocuments };
  }

  public async resolveAssistantID(request: Request) {
    const apiKey = request.headers.authorization;

    if (!apiKey) {
      throw new ForbiddenException('API key is required');
    }

    const response = await this.authService.getIdentity(`ApiKey ${apiKey}`);

    if (!response) {
      throw new NotFoundException('Project not found');
    }

    const identity = response.identity as Identity & { legacy: { projectID: string } };

    return identity?.legacy?.projectID;
  }
}
