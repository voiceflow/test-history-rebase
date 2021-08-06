import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';
import { Box, MenuContainer, Portal, stopPropagation } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { Manager, Popper, Reference } from 'react-popper';

import { Container } from '@/components/Tooltip/components';
import { useEnableDisable } from '@/hooks';
import { ExpressionTupleV2 } from '@/models';
import { FadeDownDelayedContainer, SlideContainer } from '@/styles/animations';

import { ExpressionDataLogicType, LogicUnitDataType } from '../../types';
import { isConditionInvalid } from '../../utils';
import ConditionDisplay from '../ConditionDisplay';
import ConditionValueSelect from '../ConditionValueSelect';
import ConditionVariableSelect from '../ConditionVariableSelect';
import ConditionLogicSelect from './components/ConditionLogicSelect';

export type ValueSelectExpressionType = ExpressionTypeV2.VARIABLE | ExpressionTypeV2.VALUE;

export interface ConditionDataSelectProps {
  isLogicGroup?: boolean;
  expression: LogicUnitDataType;
  onDelete: () => void;
  onChange: (value: LogicUnitDataType) => void;
}

const ConditionDataSelect: React.FC<ConditionDataSelectProps> = ({ expression, isLogicGroup, onChange, onDelete }) => {
  const popperRef = React.useRef<HTMLElement | null>(null);
  const [isShown, onToggle] = useDismissable(false, { ref: popperRef });
  const [invalidCondition, setInvalidCondition, setValidCondition] = useEnableDisable(false);

  // methods
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
  // side effects
  React.useEffect(() => {
    if (expression.logicInterface && isEmpty(expression.value[0]?.value)) {
      onToggle();
    }
  }, [expression.logicInterface, popperRef]);
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
    <Manager>
      <Reference>
        {({ ref }) => (
          <Box ref={ref} onClick={onToggle}>
            <ConditionDisplay isActive={isShown} error={invalidCondition} expression={expression} onDelete={onDelete} isLogicGroup={isLogicGroup} />
          </Box>
        )}
      </Reference>

      {isShown && (
        <Portal portalNode={document.body}>
          <Popper
            innerRef={(node) => {
              popperRef.current = node;
            }}
            placement="bottom-start"
            modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: 'viewport' } }}
          >
            {({ ref, style, placement }) => (
              <Box ref={ref} style={style} data-placement={placement} onClick={stopPropagation()}>
                <SlideContainer onClick={stopPropagation(null, true)}>
                  <Container style={{ padding: '0px', overflowY: 'hidden' }}>
                    <FadeDownDelayedContainer>
                      <MenuContainer
                        style={{
                          zIndex: 1000,
                          maxWidth: '440px',
                          width: '440px',
                          maxHeight: '350px',
                          padding: '24px 32px',
                          overflowX: 'hidden',
                          overflowY: 'scroll',
                        }}
                        onClick={stopPropagation()}
                      >
                        {/* to add left side value */}
                        <>
                          {expression.logicInterface === ConditionsLogicInterface.VARIABLE && (
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
                          {expression.logicInterface === ConditionsLogicInterface.VALUE && (
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
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default ConditionDataSelect;
