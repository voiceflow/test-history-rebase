import { Utils } from '@voiceflow/common';
import { BlockText, BoxFlexApart, ClickableText, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import { onClickCopy } from '@/utils/clipboard';

import ItemContainer from './ItemContainer';

interface ItemProps {
  label: string;
  isLast?: boolean;
  onClick?: VoidFunction;
}

const Item: React.FC<ItemProps> = ({ label, isLast, children, onClick }) => {
  const canCopy = typeof children === 'string';

  return (
    <>
      <ItemContainer onClick={canCopy ? stopPropagation(Utils.functional.chain(onClick, onClickCopy(children))) : undefined}>
        <BoxFlexApart>
          <Text fontWeight="bold">{label}</Text>
          {canCopy && <ClickableText>Copy</ClickableText>}
        </BoxFlexApart>
        {!!children && <BlockText mt={6}>{children}</BlockText>}
      </ItemContainer>

      {!isLast && <Divider width="calc(100% - 20px)" offset={0} style={{ marginLeft: '20px' }} isSecondaryColor />}
    </>
  );
};

export default Item;
