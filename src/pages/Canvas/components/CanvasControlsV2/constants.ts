import { Icon } from '@/svgs/types';

export type StaticResource = {
  icon: Icon;
  link: string;
  label: string;
};

// eslint-disable-next-line import/prefer-default-export
export const STATIC_RESOURCES: StaticResource[] = [
  {
    icon: 'support',
    link: 'https://docs.voiceflow.com/',
    label: 'Docs',
  },
  {
    icon: 'youtube',
    link: 'https://www.youtube.com/channel/UCbqUIYQ7J2rS6C_nk4cNTxQ', // eslint-disable-line no-secrets/no-secrets
    label: 'Tutorials',
  },
  {
    icon: 'template',
    link: 'https://airtable.com/shr36HKRwmglhZ5Lr/tblpYysnQuzqzmL0f?blocks=hide', // eslint-disable-line no-secrets/no-secrets
    label: 'Templates',
  },
  {
    icon: 'community',
    link: 'https://www.facebook.com/groups/199476704186240/',
    label: 'Community',
  },
];
