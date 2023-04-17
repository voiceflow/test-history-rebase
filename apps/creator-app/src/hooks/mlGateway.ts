import { useContext } from 'react';

import { MLContext } from '@/contexts/MLContext';

export const useMLGatewayClient = () => useContext(MLContext)!;
