import { InteractionModelTabType } from '@/constants';

export interface SectionProps {
  setActiveTab: (tab: InteractionModelTabType) => void;
  activeTab: InteractionModelTabType;
  setSelectedItemID: (id: string) => void;
  selectedID: string;
  search: string;
  setSearchLength: (length: number) => void;
}
