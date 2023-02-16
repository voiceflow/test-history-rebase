import { Link, Text } from '@voiceflow/ui';
import React from 'react';

import THEME from '@/styles/theme';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

interface EmptyListProps {
  entityName: string;
  docLink?: string;
}

const EmptyList: React.FC<EmptyListProps> = ({ entityName, docLink }) => (
  <Text color={THEME.colors.secondary} fontSize={THEME.fontSizes.s}>
    No {entityName} exist. {docLink && <Link onClick={onOpenInternalURLInANewTabFactory(docLink)}>Learn more</Link>}
  </Text>
);

export default EmptyList;
