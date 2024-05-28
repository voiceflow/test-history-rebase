import { AnyCompiledResponseVariant, Channel, Language, VersionProgramResources } from '@voiceflow/dtos';
import uniqBy from 'lodash/uniqBy';
import * as Normal from 'normal-store';

import { CMSResponse, CMSResponseDiscriminator, CMSResponseVariant } from './environment.interface';

interface Discriminator {
  id: string;
  responseID: string;
  channel: Channel;
  language: Language;
}

type Variant = AnyCompiledResponseVariant & { discriminatorID: string };

export class ProgramResourcesBuilder {
  private discriminatorsByResponseId: Record<string, Discriminator[]>;

  private variantsByDiscriminatorID: Record<string, Variant[]>;

  private responses: Normal.Normalized<CMSResponse>;

  constructor() {
    this.discriminatorsByResponseId = {};
    this.variantsByDiscriminatorID = {};
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

  public addVariants(variants: CMSResponseVariant[]): this {
    const oldVariants = Object.values(this.variantsByDiscriminatorID).flatMap((v) => v);

    const newVariants: Variant[] = variants.map((v) => ({
      id: v.id,
      discriminatorID: v.discriminatorID,
      data: {
        cardLayout: v.cardLayout,
        speed: v.speed,
        text: v.text,
      },
      type: v.type,
      conditions: [],
    }));

    const allVariants = uniqBy([...newVariants, ...oldVariants], (value) => value.id);

    this.variantsByDiscriminatorID = allVariants.reduce<Record<string, Variant[]>>((acc, v) => {
      const variants = acc[v.discriminatorID] || [];
      return { ...acc, [v.discriminatorID]: [...variants, v] };
    }, {});

    return this;
  }

  public build(): VersionProgramResources {
    const responses = this.responses.allKeys.reduce((acc, responseID) => {
      const discriminators = this.discriminatorsByResponseId[responseID];

      const discriminatorsByKey = discriminators.reduce(
        (acc, discriminator) => ({
          ...acc,
          [`${discriminator.channel}:${discriminator.language}`]: this.variantsByDiscriminatorID[discriminator.id],
        }),
        {}
      );

      return { ...acc, [responseID]: discriminatorsByKey };
    }, {});

    return {
      // TODO: delete attachments from version program resources
      attachments: {},
      responses,
    };
  }
}
