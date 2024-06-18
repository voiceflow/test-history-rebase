import { Channel, CompiledResponseMessage, Language, VersionProgramResources } from '@voiceflow/dtos';
import uniqBy from 'lodash/uniqBy.js';
import * as Normal from 'normal-store';

import { CMSResponse, CMSResponseDiscriminator, CMSResponseMessage } from './environment.interface';

interface Discriminator {
  id: string;
  responseID: string;
  channel: Channel;
  language: Language;
}

type Message = CompiledResponseMessage & { discriminatorID: string };

export class ProgramResourcesBuilder {
  private discriminatorsByResponseId: Record<string, Discriminator[]>;

  private messagesByDiscriminatorID: Record<string, Message[]>;

  private responses: Normal.Normalized<CMSResponse>;

  constructor() {
    this.discriminatorsByResponseId = {};
    this.messagesByDiscriminatorID = {};
    this.responses = Normal.createEmpty();
  }

  public addResponses(responses: CMSResponse[]) {
    this.responses = Normal.appendMany(this.responses, responses);
    return this;
  }

  public addDiscriminators(discriminators: CMSResponseDiscriminator[]): this {
    const oldDiscriminators = Object.values(this.discriminatorsByResponseId).flatMap((v) => v);

    const newDiscriminators: Discriminator[] = discriminators.map((d) => ({
      id: d.id,
      channel: d.channel,
      language: d.language,
      responseID: d.responseID,
    }));

    const allDiscriminators = uniqBy([...newDiscriminators, ...oldDiscriminators], (value) => value.id);

    this.discriminatorsByResponseId = allDiscriminators.reduce<Record<string, Discriminator[]>>((acc, d) => {
      const discriminators = acc[d.responseID] || [];
      return { ...acc, [d.responseID]: [...discriminators, d] };
    }, {});

    return this;
  }

  public addMessages(messages: CMSResponseMessage[]): this {
    const oldMessages = Object.values(this.messagesByDiscriminatorID).flatMap((v) => v);

    const newMessages: Message[] = messages.map((m) => ({
      id: m.id,
      discriminatorID: m.discriminatorID,
      data: {
        text: m.text,
        delay: m.delay,
      },
      conditions: [],
    }));

    const allMessages = uniqBy([...newMessages, ...oldMessages], (value) => value.id);

    this.messagesByDiscriminatorID = allMessages.reduce<Record<string, Message[]>>((acc, v) => {
      const messages = acc[v.discriminatorID] || [];
      return { ...acc, [v.discriminatorID]: [...messages, v] };
    }, {});

    return this;
  }

  public build(): VersionProgramResources {
    const messages = this.responses.allKeys.reduce((acc, responseID) => {
      const discriminators = this.discriminatorsByResponseId[responseID];

      const discriminatorsByKey = discriminators.reduce(
        (acc, discriminator) => ({
          ...acc,
          [`${discriminator.channel}:${discriminator.language}`]: {
            variants: this.messagesByDiscriminatorID[discriminator.id],
          },
        }),
        {}
      );

      return { ...acc, [responseID]: discriminatorsByKey };
    }, {});

    return {
      messages,
    };
  }
}
