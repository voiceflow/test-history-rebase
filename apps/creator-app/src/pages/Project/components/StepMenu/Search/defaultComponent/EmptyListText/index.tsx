import { Link, Text } from '@voiceflow/ui';
import React from 'react';

import THEME from '@/styles/theme';

interface EmptyListTextProps {
  onClick: VoidFunction;
}

const EmptyListText: React.FC<EmptyListTextProps> = ({ onClick }) => (
  <Text color={THEME.colors.secondary} fontSize={THEME.fontSizes.s}>
    Results not found. <Link onClick={onClick}>Clear filters</Link>
  </Text>
);

export default EmptyListText;
