import { ExpressionTupleV2, ExpressionTypeV2 } from '@voiceflow/general-types';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Box, { Flex } from '@/components/Box';
import Checkbox, { CheckboxType } from '@/components/Checkbox';
import { MenuContainer } from '@/components/Menu';
import Portal from '@/components/Portal';
import Text from '@/components/Text';
import { useEnableDisable, useSetup } from '@/hooks';
import { useDismissable } from '@/hooks/dismiss';
import { stopPropagation } from '@/utils/dom';

import { ExpressionDisplayLabel } from '../constants';
import { ExpressionDataLogicType, LogicUnitDataType } from '../types';
import { isConditionInvalid } from '../utils';
import ConditionDisplay from './ConditionDisplay';
import ConditionLogicSelect from './ConditionLogicSelect';
import ConditionValueSelect from './ConditionValueSelect';
import ConditionVariableSelect from './ConditionVariableSelect';

export type ConditionDataSelectProps = {
  expression: LogicUnitDataType;

  onDelete: () => void;
  onChange: (value: LogicUnitDataType) => void;
};

const ConditionDataSelect: React.FC<ConditionDataSelectProps> = ({ expression, onChange, onDelete }) => {
  const popperRef = React.useRef<HTMLElement>(null);
  const [isShown, onToggle] = useDismissable(false, { autoDismiss: true, ref: popperRef });
  const [invalidCondition, setInvalidCondition, setValidCondition] = useEnableDisable(false);

  useSetup(() => {
    if (expression.logicInterface && isEmpty(expression.value[0]?.value)) {
      onToggle();
    }
  }, [expression.logicInterface]);

  React.useEffect(() => {
    // if pop-up is open remove error
    if (isShown && invalidCondition) {
      setValidCondition();
    }

    // if pop-up is close show error
    if (!isShown && isConditionInvalid(expression)) {
      setInvalidCondition();
    }
  }, [isShown, invalidCondition]);

  const onValueUpdate = React.useCallback(
    (key: number) => (values: { value: string }) => {
      onChange({
        ...expression,
        value: expression.value.map((data: any, index: number) => (index === key ? { ...data, ...values } : data)) as ExpressionTupleV2,
      });
    },
    [onChange]
  );

  const onLogicUpdate = React.useCallback(
    (logic: ExpressionDataLogicType) => {
      onChange({ ...expression, type: logic });
    },
    [onChange]
  );

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Box ref={ref} onClick={stopPropagation(onToggle)}>
            <ConditionDisplay error={invalidCondition} expression={expression} onDelete={onDelete} />
          </Box>
        )}
      </Reference>

      {isShown && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={(node) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              popperRef.current = node;
            }}
            placement="bottom-start"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }}
          >
            {({ ref, style, placement }) => (
              <Box ref={ref} style={style} data-placement={placement} onClick={stopPropagation()}>
                <MenuContainer
                  style={{ zIndex: 1000, maxWidth: '440px', width: '440px', padding: '24px 32px', overflowX: 'hidden', overflowY: 'auto' }}
                  onClick={stopPropagation()}
                >
                  {/* to add left side value */}
                  <>
                    {expression.value[0]?.type === ExpressionTypeV2.VARIABLE && (
                      <ConditionVariableSelect value={expression.value[0].value} onChange={onValueUpdate(0)} />
                    )}

                    {expression.value[0]?.type === ExpressionTypeV2.VALUE && (
                      <ConditionValueSelect value={expression.value[0].value} onChange={onValueUpdate(0)} />
                    )}
                  </>

                  {/* display logic and input field for right side once left side value is saved */}
                  <>
                    {expression.value[0]?.value && (
                      <Box mb={16} mt={24}>
                        <Flex mb={12}>
                          <Checkbox type={CheckboxType.RADIO} value={expression.type} checked />
                          <Text>{ExpressionDisplayLabel[expression.type]}</Text>
                        </Flex>

                        <Box mb={16}>
                          {/* casting as string because the value will always be string */}
                          <ConditionValueSelect value={expression.value[1]?.value as string} onChange={onValueUpdate(1)} />
                        </Box>

                        <ConditionLogicSelect onChange={onLogicUpdate} value={expression.type} />
                      </Box>
                    )}
                  </>
                </MenuContainer>
              </Box>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default ConditionDataSelect;
