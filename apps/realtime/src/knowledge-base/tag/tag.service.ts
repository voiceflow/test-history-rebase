import { Inject, Injectable } from '@nestjs/common';
import { KBTag, KBTagRecord } from '@voiceflow/dtos';
import { BadRequestException, NotFoundException } from '@voiceflow/exception';
import { KnowledgeBaseORM } from '@voiceflow/orm-designer';
import { ObjectId } from 'mongodb';

import { MutableService } from '@/common';

@Injectable()
export class KnowledgeBaseTagService extends MutableService<KnowledgeBaseORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  MAX_KB_TAGS = 300;

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM
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

  async tagNamesToObjectIds(projectID: string, tags: string[], existingTags?: KBTagRecord): Promise<Set<string>> {
    const tagsRecords = existingTags ?? (await this.getTagsRecords(projectID)) ?? [];

    const tagIds = new Set<string>();

    Object.keys(tagsRecords)
      .filter((tagID) => tags.includes(tagsRecords[tagID].label))
      .forEach((tag) => tagIds.add(tag));

    return tagIds;
  }

  async tagObjectIdsToNames({
    projectID,
    tagIDs,
    existingTags,
  }: {
    projectID: string;
    tagIDs: string[];
    existingTags?: KBTagRecord;
  }): Promise<Set<string>> {
    const tagsRecords = existingTags ?? (await this.getTagsRecords(projectID)) ?? {};

    const tagNames = new Set<string>();

    tagIDs.forEach(async (tagID) => {
      if (tagsRecords[tagID]) {
        tagNames.add(tagsRecords[tagID].label);
      } else {
        // Perform update only if the tag doesn't exist in project
        this.orm.upsertOneTag(projectID, { tagID, label: '' });
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
    projectID,
    tagLabels,
    existingTags,
    createIfMissingTags,
  }: {
    projectID: string;
    tagLabels: string[];
    existingTags?: KBTagRecord;
    createIfMissingTags?: boolean;
  }) {
    // check that KB tag labels exists, this is not atomic but it prevents a class of bugs
    const tags = existingTags ?? (await this.getTagsRecords(projectID)) ?? {};

    const tagLabelMap: Record<string, string> = {};

    Object.entries(tags).forEach(([tagID, tag]) => {
      tagLabelMap[tag.label] = tagID;
    });

    const nonExistingTags = tagLabels.filter((label) => !tagLabelMap[label]);

    if (nonExistingTags.length > 0) {
      if (createIfMissingTags) {
        if (Object.keys(tags).length + nonExistingTags.length > this.MAX_KB_TAGS) {
          throw new Error(`${[this.MAX_KB_TAGS]} tag limit per project exceeded. Please delete a tag to add a new one.`);
        }

        const objectsForUpdate = nonExistingTags.map((label) => {
          const objectId = new ObjectId().toHexString();

          return { tagID: objectId, label };
        });

        await this.orm.upsertManyTags(projectID, objectsForUpdate);
      } else {
        const formattedTags = nonExistingTags.map((tag) => `\`${tag}\``).join(', ');
        throw new Error(`tags with the following labels do not exist: ${formattedTags}`);
      }
    }
  }

  containsAtLeastOneValue(list1: string[], list2: string[]): boolean {
    return list1.some((item) => list2.includes(item));
  }
}
