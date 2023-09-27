import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import type { CMSKnowledgeBase } from '@/pages/AssistantCMS/contexts/CMSManager/CMSManager.interface';

export const useKnowledgeBaseCMSManager = useCMSManager<CMSKnowledgeBase>;
