import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Portal, stopPropagation, useCachedValue, usePopper } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { Container } from '@/components/Tooltip/components';
import { useEnableDisable } from '@/hooks';
import { FadeDownDelayedContainer, SlideContainer } from '@/styles/animations';

import { ExpressionDataLogicType, LogicUnitDataType } from '../../types';
import { isConditionInvalid } from '../../utils';
import ConditionDisplay from '../ConditionDisplay';
import ConditionValueSelect from '../ConditionValueSelect';
import ConditionVariableSelect from '../ConditionVariableSelect';
import ConditionLogicSelect from './components/ConditionLogicSelect';
import MenuContainer from './components/MenuContainer';

export type ValueSelectExpressionType = Node.Utils.ExpressionTypeV2.VARIABLE | Node.Utils.ExpressionTypeV2.VALUE;

export interface ConditionDataSelectProps {
  isLogicGroup?: boolean;
  expression: LogicUnitDataType;
  onDelete: () => void;
  onChange: (value: LogicUnitDataType) => void;
}

const ConditionDataSelect: React.FC<ConditionDataSelectProps> = ({ expression, isLogicGroup, onChange, onDelete }) => {
  const popper = usePopper({
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { rootBoundary: 'viewport' } },
    ],
  });

  const dismissableRef = useCachedValue(popper.popperElement as Element);
  const [isShown, onToggle] = useDismissable(false, { ref: dismissableRef });
  const [invalidCondition, setInvalidCondition, setValidCondition] = useEnableDisable(false);

  // methods
  const onValueUpdate = React.useCallback(
    (key: number) => (values: { value: string }) => {
      onChange({
        ...expression,
        value: expression.value.map((data: any, index: number) => (index === key ? { ...data, ...values } : data)) as Realtime.ExpressionTupleV2,
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
  // side effects
  React.useEffect(() => {
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

  return (
    <>
      <Box ref={popper.setReferenceElement} onClick={onToggle}>
        <ConditionDisplay isActive={isShown} error={invalidCondition} expression={expression} onDelete={onDelete} isLogicGroup={isLogicGroup} />
      </Box>

      {isShown && (
        <Portal portalNode={document.body}>
          <Box ref={popper.setPopperElement} style={popper.styles.popper} onClick={stopPropagation()} {...popper.attributes.popper}>
            <SlideContainer onClick={stopPropagation(null, true)}>
              <Container style={{ padding: '0px', overflowY: 'hidden' }}>
                <FadeDownDelayedContainer>
                  <MenuContainer onClick={stopPropagation()}>
                    {/* to add left side value */}
                    <>
                      {expression.logicInterface === Node.Utils.ConditionsLogicInterface.VARIABLE && (
                        <>
                          <ConditionVariableSelect value={String(expression.value[0]?.value)} onChange={onValueUpdate(0)} />
                          <Box mt={24}>
                            <ConditionLogicSelect
                              onLogicUpdate={onLogicUpdate}
                              logicValue={expression.type as ExpressionDataLogicType}
                              conditionValue={String(expression.value[1]?.value)}
                              onConditionValueUpdate={onValueUpdate(1)}
                              onClose={onToggle}
                            />
                          </Box>
                        </>
                      )}

                      {/* display logic and input field for right side once left side value is saved */}
                      {expression.logicInterface === Node.Utils.ConditionsLogicInterface.VALUE && (
                        <>
                          <ConditionValueSelect value={String(expression.value[0]?.value)} onChange={onValueUpdate(0)} />
                          <Box mt={24}>
                            <ConditionLogicSelect
                              onLogicUpdate={onLogicUpdate}
                              logicValue={expression.type as ExpressionDataLogicType}
                              conditionValue={String(expression.value[1]?.value)}
                              onConditionValueUpdate={onValueUpdate(1)}
                              onClose={onToggle}
                            />
                          </Box>
                        </>
                      )}
                    </>
                  </MenuContainer>
                </FadeDownDelayedContainer>
              </Container>
            </SlideContainer>
          </Box>
        </Portal>
      )}
    </>
  );
};

export default ConditionDataSelect;
