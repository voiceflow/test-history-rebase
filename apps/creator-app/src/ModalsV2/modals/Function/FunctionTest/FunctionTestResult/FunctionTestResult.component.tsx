import { FunctionVariable } from '@voiceflow/dtos';
import { clsx } from '@voiceflow/style';
import { DataTypes, download } from '@voiceflow/ui';
import {
  Box,
  CodeEditor,
  Collapsible,
  CollapsibleHeader,
  CollapsibleHeaderButton,
  Divider,
  Link,
  Mapper,
  Text,
  Theme,
  Tokens,
  Variable,
} from '@voiceflow/ui-next';
import React from 'react';

import { PreviewResultFooter } from '@/components/Preview/PreviewResultFooter/PreviewResultFooter.component';

import {
  fullWidthStyle,
  jsonCollapsibleStyles,
  jsonEditorStyles,
  mapperStyles,
  outputVarsStyles,
  rhsMapperStyles,
  sectionRecipe,
  testResults,
} from './FunctionTestResult.css';
import { useDynamicTracesCodeEditorHeight } from './FunctionTestResult.hook';
import { IFunctionTestResult } from './FunctionTestResult.interface';

export interface IFunctionTestResultExtra {
  error?: boolean;
  disabled?: boolean;
  hasResolvedPath?: boolean;
  hasOutputVars?: boolean;
  onDownloadLogs?: () => void;
  outputVariableDeclarations: FunctionVariable[];
}

export const FunctionTestResult: React.FC<IFunctionTestResultExtra & IFunctionTestResult> = ({
  disabled = false,
  numInputVariables,
  outputVariableDeclarations,
  functionsTestResponse,
  isTraceOpened: isTracesSectionOpened,
  setIsTraceOpened: setIsTracesSectionOpened,
  isResolvedPathOpened: isResolvedPathSectionOpened,
  setIsResolvedPathOpened: setIsResolvedPathSectionOpened,
  isOutputVarsOpened: isOutputVarsSectionOpened,
  setIsOutputVarsOpened: setIsOutputVarsSectionOpened,
}) => {
  const error = functionsTestResponse?.success === false;
  const latencyMS = Math.round(functionsTestResponse?.latencyMS);
  const path = Object.entries(functionsTestResponse?.runtimeCommands?.next || {});
  const outputVars = functionsTestResponse?.runtimeCommands?.outputVars ?? {};
  const traces = JSON.stringify(functionsTestResponse?.runtimeCommands.trace);
  const onDownloadLogsClick = () => {
    download(`logs.json`, JSON.stringify(functionsTestResponse), DataTypes.JSON);
  };

  useDynamicTracesCodeEditorHeight({
    isTracesSectionOpened,
    traces,
    numInputVariables,
    outputVars: Object.entries(outputVars || {}),
    isOutputVarsSectionOpened,
    isResolvedPathSectionOpened,
    path,
  });

  const formatFunctionValue = (value: unknown) => {
    if (typeof value === 'string') {
      return `"${value}"`;
    }

    if (typeof value === 'undefined') {
      return `undefined`;
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return value;
  };

  return (
    <div className={testResults}>
      {!!path.length && !error && (
        <>
          <Collapsible
            isDisabled={disabled}
            isOpen={isResolvedPathSectionOpened}
            isEmpty={false}
            showDivider={false}
            contentClassName={sectionRecipe({ disabled })}
            header={
              <Box width="100%" onClick={() => setIsResolvedPathSectionOpened(!isResolvedPathSectionOpened)}>
                <CollapsibleHeader isDisabled={disabled} label="Resolved path" className={fullWidthStyle} isOpen={isResolvedPathSectionOpened}>
                  {() => <CollapsibleHeaderButton disabled={disabled} isOpen={isResolvedPathSectionOpened} />}
                </CollapsibleHeader>
              </Box>
            }
          >
            {path.map(([pathName, pathValue]) => (
              <Mapper
                key={pathName}
                equalityIcon="arrow"
                leftHandSide={[
                  <Text variant="basic" color={Theme.vars.color.font.default} key={pathName}>
                    Path
                  </Text>,
                ]}
                rightHandSide={[
                  <Text key={pathValue} variant="basic" className={clsx(rhsMapperStyles, mapperStyles)}>
                    {pathValue}
                  </Text>,
                ]}
              />
            ))}
          </Collapsible>

          <Divider noPadding />
        </>
      )}

      {!!outputVariableDeclarations.length && !error && (
        <>
          <Collapsible
            isDisabled={disabled}
            isOpen={isOutputVarsSectionOpened}
            isEmpty={false}
            showDivider={false}
            contentClassName={clsx(sectionRecipe({ disabled }), outputVarsStyles)}
            header={
              <Box width="100%" onClick={() => setIsOutputVarsSectionOpened(!isOutputVarsSectionOpened)}>
                <CollapsibleHeader isDisabled={disabled} label="Output variables" className={fullWidthStyle} isOpen={isOutputVarsSectionOpened}>
                  {() => <CollapsibleHeaderButton disabled={disabled} isOpen={isOutputVarsSectionOpened} />}
                </CollapsibleHeader>
              </Box>
            }
          >
            <Box direction="column" className={mapperStyles}>
              {outputVariableDeclarations.map(({ id, name }) => (
                <Mapper
                  key={id}
                  equalityIcon="equal"
                  leftHandSide={<Variable label={name} key={id} size="large" />}
                  rightHandSide={
                    <Text
                      variant="basic"
                      className={rhsMapperStyles}
                      color={outputVars[name] ? Theme.vars.color.font.default : Tokens.colors.neutralDark.neutralsDark100}
                    >
                      {`${formatFunctionValue(outputVars[name])}`}
                    </Text>
                  }
                />
              ))}
            </Box>
          </Collapsible>

          <Divider noPadding />
        </>
      )}

      <Collapsible
        contentClassName={jsonCollapsibleStyles}
        isDisabled={disabled || !traces}
        showDivider={false}
        isEmpty={!traces}
        isOpen={isTracesSectionOpened}
        header={
          <Box width="100%" onClick={() => setIsTracesSectionOpened(!isTracesSectionOpened)}>
            <CollapsibleHeader isDisabled={disabled} label="Traces" className={fullWidthStyle} isOpen={isTracesSectionOpened}>
              {() => <CollapsibleHeaderButton disabled={disabled} isOpen={isTracesSectionOpened} />}
            </CollapsibleHeader>
          </Box>
        }
      >
        <CodeEditor className={jsonEditorStyles} disabled={disabled} readOnly theme="light" language="json" isFunctionEditor value={[traces]} />
      </Collapsible>

      <PreviewResultFooter status={error ? 'error' : 'success'} latency={latencyMS} disabled={disabled}>
        <Link size="small" label="Download logs" weight="semiBold" variant="primary" onClick={onDownloadLogsClick} disabled={disabled} />
      </PreviewResultFooter>
    </div>
  );
};
