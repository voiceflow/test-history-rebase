import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { Diagram } from '@/ducks';
import { useSelector } from '@/hooks';

import { expressionOverflow, setText, variableContainer } from './SetV3StepItem.css';

export const SetV3StepItem: React.FC<{ item: Realtime.NodeData.SetExpressionV2; withPort?: boolean }> = ({
  item,
  withPort,
}) => {
  const { variable: variableID, expression, label } = item;

  const variablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);
  const variable = variableID ? variablesMap[variableID] : null;

  if (label) return <>{label}</>;

  const getVariableContent = () => {
    if (!variable) {
      return null;
    }

    let maxWidth = '212px';
    let maxChars = 22;
    if (withPort && !expression) {
      maxWidth = '160px';
      maxChars = 14;
    } else if (!item.expression) {
      maxWidth = '170px';
      maxChars = 17;
    } else if (withPort) {
      maxWidth = '186px';
      maxChars = 19;
    }

    if (variable.name.length > maxChars) {
      return (
        <div className={variableContainer} style={{ maxWidth }}>
          {'{'}
          <Box>{variable.name.slice(0, maxChars)}...</Box>
          {'}'}
        </div>
      );
    }

    return (
      <div style={{ maxWidth }} className={variableContainer}>
        {' { '}
        {variable.name}
        {' } '}
      </div>
    );
  };

  const getExpressionContent = (to?: boolean) => {
    if (!expression) {
      return null;
    }

    if (String(expression).length > 60) {
      return (
        <div style={{ display: 'inline' }}>
          {to ? <div className={setText}> to </div> : ''}
          {String(expression)}
        </div>
      );
    }
    return (
      <div style={{ display: 'inline' }}>
        {to ? <div className={setText}> to </div> : ''}
        {String(expression)}
      </div>
    );
  };

  const variableContent = getVariableContent();

  if (variableContent && expression) {
    return (
      <div>
        <div style={{ display: 'inline' }}>
          <div style={{ display: 'flex' }}>
            <div className={setText}>Set </div>
            {variableContent}
          </div>
        </div>
        <div className={expressionOverflow}>
          <div>{getExpressionContent(true)}</div>
        </div>
      </div>
    );
  }

  if (variableContent) {
    return (
      <div style={{ display: 'flex' }}>
        <div className={setText}>Set </div>
        {variableContent}
        <div className={setText}> to...</div>
      </div>
    );
  }

  if (expression) {
    return (
      <div>
        <div className={setText}>Set variable to </div>
        <div>{getExpressionContent(false)}</div>
      </div>
    );
  }

  return <div className={setText}>Set variable</div>;
};
