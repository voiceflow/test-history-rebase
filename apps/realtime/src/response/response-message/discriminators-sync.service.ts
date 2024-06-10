import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { ResponseMessage } from '@voiceflow/dtos';
import { ResponseDiscriminatorORM } from '@voiceflow/orm-designer';

import { toPostgresEntityIDs } from '@/common/utils';
import { CMSContext } from '@/types';

@Injectable()
export class ResponseMessageDiscriminatorsSyncService {
  constructor(@Inject(ResponseDiscriminatorORM) private readonly responseDiscriminatorORM: ResponseDiscriminatorORM) {}

  async syncDiscriminators(
    messages: ResponseMessage[],
    {
      action,
      userID,
      context,
      discriminatorOrderInsertIndex = 1,
    }: { action: 'create' | 'delete'; userID: number; context: CMSContext; discriminatorOrderInsertIndex?: number }
  ) {
    const responseDiscriminatorIDs = Utils.array.unique(messages.map((message) => message.discriminatorID));

    const responseDiscriminators = await this.responseDiscriminatorORM.findManyByEnvironmentAndIDs(
      context.environmentID,
      responseDiscriminatorIDs
    );

    if (responseDiscriminatorIDs.length !== responseDiscriminators.length) {
      throw new NotFoundException("couldn't find response discriminator to sync");
    }

    const responseVariantsByResponseDiscriminatorIDMap = messages.reduce<Record<string, typeof messages>>(
      (acc, variant) => {
        acc[variant.discriminatorID] ??= [];
        acc[variant.discriminatorID].push(variant);

        return acc;
      },
      {}
    );

    await Promise.all(
      responseDiscriminators.map(async (discriminator) => {
        const variantIDs = toPostgresEntityIDs(responseVariantsByResponseDiscriminatorIDMap[discriminator.id] ?? []);

        if (!variantIDs.length) {
          throw new NotFoundException("couldn't find variants for discriminator to sync");
        }

        let variantOrder: string[];

        if (action === 'create') {
          if (discriminator.variantOrder.length) {
            variantOrder =
              discriminatorOrderInsertIndex === -1
                ? [...discriminator.variantOrder, ...variantIDs]
                : Utils.array.insertAll(discriminator.variantOrder, discriminatorOrderInsertIndex, variantIDs);
          } else {
            variantOrder = variantIDs;
          }
        } else {
          variantOrder = discriminator.variantOrder.filter((id) => !variantIDs.includes(id));
        }

        // eslint-disable-next-line no-param-reassign
        discriminator.variantOrder = variantOrder;

        await this.responseDiscriminatorORM.patchOneForUser(
          userID,
          { id: discriminator.id, environmentID: discriminator.environmentID },
          { variantOrder }
        );
      })
    );

    return responseDiscriminators;
  }
}
