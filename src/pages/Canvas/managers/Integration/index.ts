import { BlockType, INTEGRATION_DATA_MODELS, IntegrationType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { NodeData } from '@/models';
import GlobeIcon from '@/svgs/solid/globe.svg';

import { NodeConfig } from '../types';
import IntegrationEditor from './IntegrationEditor';
import IntegrationStep from './IntegrationStep';
import { ICON, ICON_COLOR } from './constants';

const getDefaultData = ({ selectedIntegration }: Partial<NodeData.Integration>) => {
  switch (selectedIntegration) {
    case IntegrationType.CUSTOM_API:
      return INTEGRATION_DATA_MODELS.CUSTOM_API;
    case IntegrationType.GOOGLE_SHEETS:
      return INTEGRATION_DATA_MODELS.GOOGLE_SHEETS;
    case IntegrationType.ZAPIER:
      return INTEGRATION_DATA_MODELS.ZAPIER;
    default:
      return null;
  }
};

const IntegrationManager: NodeConfig<NodeData.Integration> = {
  type: BlockType.INTEGRATION,
  // for older version
  icon: GlobeIcon,
  iconColor: '#fa7891',
  // for block redesign
  getIcon: (data) => ICON[data.selectedIntegration!],
  getIconColor: (data) => ICON_COLOR[data.selectedIntegration!],

  label: 'Integrations',
  tip: 'Integrate external services into your skill',

  step: IntegrationStep,
  editor: IntegrationEditor,

  factory: (data) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'Integrations',
      ...data,
      ...(data && getDefaultData(data)),
    } as Creator.DataDescriptor<NodeData.Integration>,
  }),
};

export default IntegrationManager;
