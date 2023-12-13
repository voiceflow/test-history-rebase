import { Primary } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, CardAttachmentEntity, CardButtonEntity, ORMMutateOptions, PKOrEntity } from '@voiceflow/orm-designer';
import { AssistantORM, CardAttachmentORM, CardButtonORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSObjectService, EntitySerializer } from '@/common';
import type { CreateManyForUserData } from '@/common/types';
import { assistantBroadcastContext, groupByAssistant, toEntityID, toEntityIDs } from '@/common/utils';
import { uniqCMSResourceIDs } from '@/utils/cms.util';

@Injectable()
export class CardButtonService extends CMSObjectService<CardButtonORM> {
  constructor(
    @Inject(CardButtonORM)
    protected readonly orm: CardButtonORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(CardAttachmentORM)
    protected readonly cardAttachmentORM: CardAttachmentORM,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(EntitySerializer)
    private readonly entitySerializer: EntitySerializer
  ) {
    super();
  }

  /* Helpers */

  protected async syncCardAttachments(cardButtons: CardButtonEntity[], { flush = true, action }: { flush?: boolean; action: 'create' | 'delete' }) {
    const cardIDs = uniqCMSResourceIDs(cardButtons.map(({ card }) => ({ id: card.id, environmentID: card.environmentID })));

    const cards = await this.cardAttachmentORM.findMany(cardIDs);

    if (cardIDs.length !== cards.length) {
      throw new NotFoundException("couldn't find card to sync");
    }

    const cardButtonsByCardID = cardButtons.reduce<Record<string, typeof cardButtons>>((acc, cardButton) => {
      acc[cardButton.card.id] ??= [];
      acc[cardButton.card.id].push(cardButton);

      return acc;
    }, {});

    cards.forEach((card) => {
      const cardButtonIDs = cardButtonsByCardID[card.id]?.map(toEntityID);

      if (!cardButtonIDs?.length) {
        throw new NotFoundException("couldn't find card buttons for card to sync");
      }

      let buttonOrder: string[];

      if (action === 'create') {
        buttonOrder = [...card.buttonOrder, ...cardButtonIDs];
      } else {
        buttonOrder = card.buttonOrder.filter((id) => !cardButtonIDs.includes(id));
      }

      // eslint-disable-next-line no-param-reassign
      card.buttonOrder = buttonOrder;
    });

    if (flush) {
      await this.orm.em.flush();
    }

    return cards;
  }

  async broadcastSync(authMeta: AuthMetaPayload, { sync }: { sync: { cardAttachments: CardAttachmentEntity[] } }) {
    await Promise.all(
      groupByAssistant(sync.cardAttachments).flatMap((cardAttachments) =>
        cardAttachments.map((cardAttachment) =>
          this.logux.processAs(
            Actions.Attachment.PatchOneCard({
              id: cardAttachment.id,
              patch: { buttonOrder: cardAttachment.buttonOrder },
              context: assistantBroadcastContext(cardAttachment),
            }),
            authMeta
          )
        )
      )
    );
  }

  /* Find */

  findManyByEnvironment(assistant: PKOrEntity<AssistantEntity>, environmentID: string) {
    return this.orm.findManyByEnvironment(assistant, environmentID);
  }

  findManyByCardAttachments(cards: PKOrEntity<CardAttachmentEntity>[]) {
    return this.orm.findManyByCardAttachments(cards);
  }

  /* Create */

  async createManyAndSync(userID: number, data: CreateManyForUserData<CardButtonORM>) {
    const cardButtons = await this.createManyForUser(userID, data, { flush: false });

    const cardAttachments = await this.syncCardAttachments(cardButtons, { flush: false, action: 'create' });

    await this.orm.em.flush();

    return {
      add: { cardButtons },
      sync: { cardAttachments },
    };
  }

  async broadcastAddMany(
    authMeta: AuthMetaPayload,
    { add, sync }: { add: { cardButtons: CardButtonEntity[] }; sync: { cardAttachments: CardAttachmentEntity[] } }
  ) {
    await Promise.all([
      ...groupByAssistant(add.cardButtons).map((cardButtons) =>
        this.logux.processAs(
          Actions.CardButton.AddMany({
            data: this.entitySerializer.iterable(cardButtons),
            context: assistantBroadcastContext(cardButtons[0]),
          }),
          authMeta
        )
      ),
      this.broadcastSync(authMeta, { sync }),
    ]);
  }

  async createManyAndBroadcast(authMeta: AuthMetaPayload, data: CreateManyForUserData<CardButtonORM>) {
    const result = await this.createManyAndSync(authMeta.userID, data);

    await this.broadcastAddMany(authMeta, result);

    return result.add.cardButtons;
  }

  /* Delete */

  async syncOnDelete(cardButtons: CardButtonEntity[], options?: ORMMutateOptions) {
    const cardAttachments = await this.syncCardAttachments(cardButtons, { ...options, action: 'delete' });

    return { cardAttachments };
  }

  async deleteManyAndSync(ids: Primary<CardButtonEntity>[]) {
    const cardButtons = await this.findMany(ids);

    const sync = await this.syncOnDelete(cardButtons, { flush: false });

    await this.deleteMany(cardButtons, { flush: false });

    await this.orm.em.flush();

    return {
      sync,
      delete: { cardButtons },
    };
  }

  async broadcastDeleteMany(
    authMeta: AuthMetaPayload,
    {
      sync,
      delete: del,
    }: {
      sync: { cardAttachments: CardAttachmentEntity[] };
      delete: { cardButtons: CardButtonEntity[] };
    }
  ) {
    await Promise.all([
      this.broadcastSync(authMeta, { sync }),
      ...groupByAssistant(del.cardButtons).map((cardButtons) =>
        this.logux.processAs(
          Actions.CardButton.DeleteMany({
            ids: toEntityIDs(cardButtons),
            context: assistantBroadcastContext(cardButtons[0]),
          }),
          authMeta
        )
      ),
    ]);
  }

  async deleteManyAndBroadcast(authMeta: AuthMetaPayload, ids: Primary<CardButtonEntity>[]) {
    const result = await this.deleteManyAndSync(ids);

    await this.broadcastDeleteMany(authMeta, result);
  }
}
