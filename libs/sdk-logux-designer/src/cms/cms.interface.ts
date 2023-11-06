import type { Assistant } from '@/assistant/assistant.interface';
import type { AnyAttachment } from '@/attachment/attachment.interface';
import type { CardButton } from '@/attachment/card-button/card-button.interface';
import type { Entity } from '@/entity/entity.interface';
import type { EntityVariant } from '@/entity/entity-variant/entity-variant.interface';
import type { Intent } from '@/intent/intent.interface';
import type { RequiredEntity } from '@/intent/required-entity/required-entity.interface';
import type { Utterance } from '@/intent/utterance/utterance.interface';
import type { Prompt } from '@/prompt/prompt.interface';
import type { Response } from '@/response/response.interface';
import type { ResponseDiscriminator } from '@/response/response-discriminator/response-discriminator.interface';
import type { AnyResponseVariant } from '@/response/response-variant/response-variant.interface';
import type { Story } from '@/story/story.interface';
import type { AnyTrigger } from '@/story/trigger/trigger.interface';

export interface CMSData {
  assistant: Assistant;
  stories: Story[];
  intents: Intent[];
  entities: Entity[];
  triggers: AnyTrigger[];
  prompts: Prompt[];
  responses: Response[];
  utterances: Utterance[];
  attachments: AnyAttachment[];
  cardButtons: CardButton[];
  entityVariants: EntityVariant[];
  requiredEntities: RequiredEntity[];
  responseVariants: AnyResponseVariant[];
  responseAttachments: AnyAttachment[];
  responseDiscriminators: ResponseDiscriminator[];
}
