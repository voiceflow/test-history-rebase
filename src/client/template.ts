import axios from 'axios';

import { API_ENDPOINT } from '@/config';
import { PlatformType } from '@/constants';

const templateClient = {
  getPlatformTemplate: (platform: PlatformType, tag = 'default') =>
    axios.get(`${API_ENDPOINT}/v2/templates/${platform}`, { params: { tag } }).then((res) => res.data as string | null),
};

export default templateClient;
