import { Box, BoxFlex, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { VARIABLE_DESCRIPTION } from '@/components/Canvas/constants';
import Checkbox from '@/components/Checkbox';
import { InteractionModelTabType } from '@/constants';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import { useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { EmptyDash } from '@/pages/NLUManager/components';
import { useIsCheckedItem } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { TableMeta } from '../../constants';
import TableItem from '../TableItem';
import NameBox from '../TableItem/NameBox';

const VariableItem: React.FC<{ item: Variable }> = ({ item }) => {
  const VariableTableColumnMeta = TableMeta[InteractionModelTabType.VARIABLES].columns;
  const { toggleCheckedItem } = React.useContext(NLUManagerContext);
  const { isChecked } = useIsCheckedItem(item.id);
  const description = VARIABLE_DESCRIPTION[item.name];
  const { mergedVariablesMap } = useOrderedVariables();

  const isBuiltIn = mergedVariablesMap[item.id]?.type === VariableType.BUILT_IN;
  const checkDisabled = isBuiltIn;
  const CheckBoxWrapper = checkDisabled ? TippyTooltip : React.Fragment;
  const checkboxWrapperProps = checkDisabled ? { title: 'Built-in variables cannot be deleted' } : {};
  const checkboxWrapperStyles = checkDisabled ? { opacity: 0.5, cursor: 'disabled' } : {};
  return (
    <TableItem isBuiltIn={isBuiltIn} itemType={InteractionModelTabType.VARIABLES} item={item}>
      <Box display="inline-block" style={checkboxWrapperStyles}>
        <CheckBoxWrapper {...checkboxWrapperProps}>
          <Checkbox disabled={checkDisabled} checked={isChecked} onChange={() => toggleCheckedItem(item.id)} />
        </CheckBoxWrapper>
      </Box>
      <NameBox flex={VariableTableColumnMeta[0].flexWidth} name={item.name} />
      <Box flex={VariableTableColumnMeta[1].flexWidth} style={{ textTransform: 'capitalize' }}>
        {item.type}
      </Box>
      <Box flex={VariableTableColumnMeta[2].flexWidth} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        <TippyTooltip delay={500} title={description}>
          {description || (
            <BoxFlex alignItems="center" style={{ height: '100%' }}>
              <EmptyDash />
            </BoxFlex>
          )}
        </TippyTooltip>
      </Box>
    </TableItem>
  );
};

export default VariableItem;
