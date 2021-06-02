import { CLOUD_ENV, IS_PRIVATE_CLOUD } from '@/config';

export const generateID = (id: string | number) => (IS_PRIVATE_CLOUD ? `${CLOUD_ENV}-${id}` : String(id));
