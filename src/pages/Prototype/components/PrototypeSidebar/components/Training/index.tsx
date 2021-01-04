import React from 'react';

import Text, { Link } from '@/components/Text';

import NLUContainer from '../NLUContainer';
import { Loader } from './components';

const Training: React.FC = () => (
  <NLUContainer containsLoader>
    <Loader />
    <Text fontSize={13} color="#8da2b5" fontWeight={500} mt={16} mb={27} lineHeight="18px">
      This may take a few minutes. <Link href="">Learn more.</Link>
    </Text>
  </NLUContainer>
);
export default Training;
