import type { CMSWorkflow } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';

export const workflowSearch = withFolderSearch<CMSWorkflow>((item, { search }) =>
  item.name.toLocaleLowerCase().includes(search)
);
