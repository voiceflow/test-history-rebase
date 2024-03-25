import { PostgresCMSObjectORM } from '@/postgres/common/orms/postgres-cms-object.orm';

import { CardButtonEntity } from './card-button.entity';
import { CardButtonJSONAdapter } from './card-button-json.adapter';

export class CardButtonORM extends PostgresCMSObjectORM<CardButtonEntity> {
  Entity = CardButtonEntity;

  jsonAdapter = CardButtonJSONAdapter;

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids });
  }

  findManyByCardAttachments(environmentID: string, cardIDs: string[]) {
    return this.find({ environmentID, cardID: cardIDs });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids });
  }
}
