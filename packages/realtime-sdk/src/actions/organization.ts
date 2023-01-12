import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { ORGANIZATION_KEY } from '@realtime-sdk/constants';
import { Organization } from '@realtime-sdk/models';
import { BaseCreatorPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const organizationType = Utils.protocol.typeFactory(ORGANIZATION_KEY);

export const crud = createCRUDActions<Organization, BaseCreatorPayload>(organizationType);
