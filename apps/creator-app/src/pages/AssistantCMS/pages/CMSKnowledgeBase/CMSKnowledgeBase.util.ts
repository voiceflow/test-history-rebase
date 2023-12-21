import type { CMSKnowledgeBase } from '../../contexts/CMSManager/CMSManager.interface';
import { localeCompareSort, withFolderSearch, withOptionalSort } from '../../contexts/CMSManager/CMSManager.util';

export const knowledgeBaseSearch = withFolderSearch<CMSKnowledgeBase>((item, { search }) => !!item.data?.name.toLocaleLowerCase().includes(search));

export const sortByName = (left: CMSKnowledgeBase, right: CMSKnowledgeBase) => withOptionalSort(localeCompareSort)(left.data?.name, right.data?.name);
