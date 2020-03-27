import { BlockType } from '@/constants';
import GlobeIcon from '@/svgs/solid/globe.svg';

import IntegrationEditor from './IntegrationEditor';

const IntegrationManager = {
  type: BlockType.INTEGRATION,
  editor: IntegrationEditor,
  icon: GlobeIcon,
  iconColor: '',
  label: 'Integrations',
  tip: 'Integrate external services into your skill',

  addable: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'Integrations',
    },
  }),
};

export default IntegrationManager;
