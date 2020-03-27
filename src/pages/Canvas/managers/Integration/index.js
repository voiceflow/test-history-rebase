import { BlockType, INTEGRATION_DATA_MODELS, IntegrationType } from '@/constants';
import GlobeIcon from '@/svgs/solid/globe.svg';

import IntegrationEditor from './IntegrationEditor';
import IntegrationStep from './IntegrationStep';

const getDefaultData = ({ selectedIntegration }) => {
  switch (selectedIntegration) {
    case IntegrationType.CUSTOM_API:
      return INTEGRATION_DATA_MODELS.CUSTOM_API;
    case IntegrationType.GOOGLE_SHEETS:
      return INTEGRATION_DATA_MODELS.GOOGLE_SHEETS;
    case IntegrationType.ZAPIER:
      return INTEGRATION_DATA_MODELS.ZAPIER;
    default:
      null;
  }
};

const IntegrationManager = {
  type: BlockType.INTEGRATION,
  icon: GlobeIcon,
  iconColor: '',
  label: 'Integrations',
  tip: 'Integrate external services into your skill',

  editor: IntegrationEditor,
  step: IntegrationStep,

  addable: true,

  factory: (meta) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'Integrations',
      ...(meta ? getDefaultData(meta) : null),
    },
  }),
};

export default IntegrationManager;
