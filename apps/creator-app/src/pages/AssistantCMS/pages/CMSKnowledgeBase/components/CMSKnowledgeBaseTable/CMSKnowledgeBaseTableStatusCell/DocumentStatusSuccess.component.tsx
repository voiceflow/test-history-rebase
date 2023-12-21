import { Box, Icon, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { usePopperModifiers } from '@/hooks/popper.hook';

import { ICMSKnowledgeBaseTableStatusCell } from './CMSKnowledgeBaseTableStatusCell.interface';

export const DocumentStatusSuccess: React.FC<ICMSKnowledgeBaseTableStatusCell> = () => {
  const modifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, -2] } }]);

  return (
    <Tooltip
      width={174}
      placement="top"
      modifiers={modifiers}
      referenceElement={({ onToggle, ref }) => (
        <Box onMouseEnter={onToggle} onMouseLeave={onToggle} ref={ref} my={-3}>
          <Icon name="Checkmark" color={Tokens.colors.success.success600} height={26} width={24} />
        </Box>
      )}
    >
      {() => <Text variant="caption">Data source successfully added to knowledge base.</Text>}
    </Tooltip>
  );
};
