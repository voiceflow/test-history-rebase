import type { CMSVariable } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';

export const variableSearch = withFolderSearch<CMSVariable>((item, { search }) =>
  item.name.toLocaleLowerCase().includes(search)
);
