import { Utils } from '@voiceflow/common';
import { BlockText, Box, ClickableText, Divider, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import { copyWithToast } from '@/utils/clipboard';

import ItemContainer from './ItemContainer';

interface ItemProps extends React.PropsWithChildren {
  label: string;
  isLast?: boolean;
  onClick?: VoidFunction;
}

const Item: React.FC<ItemProps> = ({ label, isLast, children, onClick }) => {
  const canCopy = typeof children === 'string';

  return (
    <>
      <ItemContainer onClick={canCopy ? stopPropagation(Utils.functional.chain(onClick, copyWithToast(children))) : undefined}>
        <Box.FlexApart>
          <Text fontWeight="600">{label}</Text>
          {canCopy && <ClickableText>Copy</ClickableText>}
        </Box.FlexApart>
        {!!children && <BlockText mt={6}>{children}</BlockText>}
      </ItemContainer>

      {!isLast && <Divider width="calc(100% - 20px)" offset={0} style={{ marginLeft: '20px' }} isSecondaryColor />}
    </>
  );
};

export default Item;
