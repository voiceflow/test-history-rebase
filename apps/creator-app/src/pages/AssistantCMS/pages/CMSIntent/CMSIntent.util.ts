import type { CMSIntent } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';

export const intentSearch = withFolderSearch<CMSIntent>((item, { search }) => item.name.toLocaleLowerCase().includes(search));
