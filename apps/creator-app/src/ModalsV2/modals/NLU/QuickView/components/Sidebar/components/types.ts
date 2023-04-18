import { InteractionModelTabType } from '@/constants';

export interface SectionProps {
  setActiveTab: (tab: InteractionModelTabType) => void;
  activeTab: InteractionModelTabType;
  setSelectedItemID: (id: string) => void;
  selectedID: string;
  search: string;
  setSearchLength: (length: number) => void;
  setTitle: (title: string) => void;
  isActiveItemRename: boolean;
  setIsActiveItemRename: (isActive: boolean) => void;
}
