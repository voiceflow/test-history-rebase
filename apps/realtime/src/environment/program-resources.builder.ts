import { AnyCompiledResponseVariant, Channel, Language, VersionProgramResources } from '@voiceflow/dtos';
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
  private discriminators: Normal.Normalized<Discriminator>;

  private variants: Normal.Normalized<Variant>;

  private responses: Normal.Normalized<CMSResponse>;

  constructor() {
    this.discriminators = Normal.createEmpty();
    this.variants = Normal.createEmpty();
    this.responses = Normal.createEmpty();
  }

  public addResponses(responses: CMSResponse[]) {
    this.responses = Normal.appendMany(this.responses, responses);
    return this;
  }

  public addDiscriminators(discriminators: CMSResponseDiscriminator[]): this {
    this.discriminators = Normal.appendMany(
      this.discriminators,
      discriminators.map<Discriminator>((d) => ({
        id: d.id,
        responseID: d.responseID,
        channel: d.channel,
        language: d.language,
      }))
    );

    return this;
  }

  public addVariants(variants: CMSResponseVariant[]): this {
    const newVariants = variants.map<Variant>((v) => ({
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

    this.variants = Normal.appendMany(this.variants, newVariants);

    return this;
  }

  public build(): VersionProgramResources {
    const responses = this.responses.allKeys.reduce((acc, responseID) => {
      const discriminators = Object.values(this.discriminators.byKey).filter((d) => d.responseID === responseID);

      const discriminatorsByKey = discriminators.reduce(
        (acc, discriminator) => ({
          ...acc,
          [`${discriminator.channel}:${discriminator.language}`]: Object.values(this.variants.byKey).filter(
            (v) => v.discriminatorID === discriminator.id
          ),
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
