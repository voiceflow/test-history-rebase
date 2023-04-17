import { BaseModels } from '@voiceflow/base-types';
import axios from 'axios';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

export const PROTOTYPE_PATH = 'prototype';

interface Model {
  intents: BaseModels.Intent[];
  slots: BaseModels.Slot[];
}

const nluManagerClient = {
  render: (versionID: string): Promise<{ model: Model }> =>
    axios.get<{ model: Model }>(`${GENERAL_SERVICE_ENDPOINT}/${PROTOTYPE_PATH}/${versionID}/survey`).then(({ data }) => data),
};

export default nluManagerClient;
