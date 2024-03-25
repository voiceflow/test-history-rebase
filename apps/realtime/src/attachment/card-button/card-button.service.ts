import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { NotFoundException } from '@voiceflow/exception';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type { CardAttachmentObject, CardButtonObject } from '@voiceflow/orm-designer';
import { AssistantORM, CardAttachmentORM, CardButtonORM, DatabaseTarget } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import type { CMSCreateForUserData } from '@/common';
import { CMSObjectService } from '@/common';
import { cmsBroadcastContext, injectAssistantAndEnvironmentIDs, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta, CMSContext } from '@/types';

@Injectable()
export class CardButtonService extends CMSObjectService<CardButtonORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(CardButtonORM)
    protected readonly orm: CardButtonORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(CardAttachmentORM)
    protected readonly cardAttachmentORM: CardAttachmentORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService
  ) {
    super();
  }

  /* Helpers */

  protected async syncCardAttachments(
    cardButtons: CardButtonObject[],
    { userID, action, context }: { action: 'create' | 'delete'; userID: number; context: CMSContext }
  ) {
    const cardIDs = Utils.array.unique(cardButtons.map((cardButton) => cardButton.cardID));

    const cards = await this.cardAttachmentORM.findManyByEnvironmentAndIDs(context.environmentID, cardIDs);

    if (cardIDs.length !== cards.length) {
      throw new NotFoundException("couldn't find card to sync");
    }

    const cardButtonsByCardID = cardButtons.reduce<Record<string, typeof cardButtons>>((acc, cardButton) => {
      acc[cardButton.cardID] ??= [];
      acc[cardButton.cardID].push(cardButton);

      return acc;
    }, {});

    await Promise.all(
      cards.map(async (card) => {
        const cardButtonIDs = toPostgresEntityIDs(cardButtonsByCardID[card.id] ?? []);

        if (!cardButtonIDs.length) {
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

        await this.cardAttachmentORM.patchOneForUser(userID, { id: card.id, environmentID: card.environmentID }, { buttonOrder });
      })
    );

    return cards;
  }

  async broadcastSync({ sync }: { sync: { cardAttachments: CardAttachmentObject[] } }, meta: CMSBroadcastMeta) {
    await Promise.all(
      sync.cardAttachments.map((cardAttachment) =>
        this.logux.processAs(
          Actions.Attachment.PatchOneCard({
            id: cardAttachment.id,
            patch: { buttonOrder: cardAttachment.buttonOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      )
    );
  }

  /* Find */

  findManyByEnvironment(environmentID: string) {
    return this.orm.findManyByEnvironment(environmentID);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.findManyByEnvironmentAndIDs(environmentID, ids);
  }

  findManyByCardAttachments(environmentID: string, cardIDs: string[]) {
    return this.orm.findManyByCardAttachments(environmentID, cardIDs);
  }

  /* Create */

  async createManyAndSync(data: CMSCreateForUserData<CardButtonORM>[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const cardButtons = await this.createManyForUser(userID, data.map(injectAssistantAndEnvironmentIDs(context)));
      const cardAttachments = await this.syncCardAttachments(cardButtons, { action: 'create', context, userID });

      return {
        add: { cardButtons },
        sync: { cardAttachments },
      };
    });
  }

  async broadcastAddMany(
    { add, sync }: { add: { cardButtons: CardButtonObject[] }; sync: { cardAttachments: CardAttachmentObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.CardButton.AddMany({
          data: this.mapToJSON(add.cardButtons),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.broadcastSync({ sync }, meta),
    ]);
  }

  async createManyAndBroadcast(data: CMSCreateForUserData<CardButtonORM>[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.cardButtons;
  }

  /* Delete */

  async syncOnDelete(cardButtons: CardButtonObject[], { userID, context }: { userID: number; context: CMSContext }) {
    const cardAttachments = await this.syncCardAttachments(cardButtons, { action: 'delete', userID, context });

    return { cardAttachments };
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.orm.deleteManyByEnvironmentAndIDs(environmentID, ids);
  }

  async deleteManyAndSync(ids: string[], { userID, context }: { userID: number; context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const cardButtons = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const sync = await this.syncOnDelete(cardButtons, { userID, context });

      await this.deleteManyByEnvironmentAndIDs(context.environmentID, ids);

      return {
        sync,
        delete: { cardButtons },
      };
    });
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { cardAttachments: CardAttachmentObject[] };
      delete: { cardButtons: CardButtonObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSync({ sync }, meta),
      this.logux.processAs(
        Actions.CardButton.DeleteMany({
          ids: toPostgresEntityIDs(del.cardButtons),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta) {
    const result = await this.deleteManyAndSync(ids, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastDeleteMany(result, meta);
  }
}
