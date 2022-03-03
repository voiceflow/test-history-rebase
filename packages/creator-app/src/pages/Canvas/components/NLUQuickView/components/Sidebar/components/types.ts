import { InteractionModelTabType } from '@/constants';

export interface SectionProps {
  setActiveTab: (tab: InteractionModelTabType) => void;
  activeTab: InteractionModelTabType;
}
