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
  children?: string;
}

const Item = ({ label, isLast, children, onClick }: ItemProps): React.ReactElement => {
  return (
    <>
      <ItemContainer onClick={children ? stopPropagation(Utils.functional.chain(onClick, onClickCopy(children))) : undefined}>
        <BoxFlexApart>
          <Text fontWeight="bold">{label}</Text>
          <ClickableText>Copy</ClickableText>
        </BoxFlexApart>
        {!!children && <BlockText mt={6}>{children}</BlockText>}
      </ItemContainer>

      {!isLast && <Divider width="calc(100% - 20px)" offset={0} style={{ marginLeft: '20px' }} isSecondaryColor />}
    </>
  );
};

export default Item;
