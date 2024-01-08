import { DataTypes, download } from '@voiceflow/ui';
import {
  Box,
  CodeEditor,
  Collapsible,
  CollapsibleHeader,
  CollapsibleHeaderButton,
  Divider,
  DotSeparator,
  Link,
  Mapper,
  Text,
  Tokens,
  Variable,
} from '@voiceflow/ui-next';
import React from 'react';

import { jsonCollapsibleStyles, jsonEditorStyles, mapperStyles, rhsMapperStyles, sectionRecipe } from './FunctionTestResult.css';
import { IFunctionTestResult } from './FunctionTestResult.interface';

const { colors } = Tokens;
export interface IFunctionTestResultExtra {
  error?: boolean;
  disabled?: boolean;
  hasResolvedPath?: boolean;
  hasOutputVars?: boolean;
  onDownloadLogs?: () => void;
}

export const FunctionTestResult: React.FC<IFunctionTestResultExtra & IFunctionTestResult> = ({ disabled = false, functionsTestResponse }) => {
  const error = functionsTestResponse?.success === false;
  const latencyMS = Math.round(functionsTestResponse?.latencyMS);
  const path = Object.entries(functionsTestResponse?.runtimeCommands?.next || {});
  const outputVars = Object.entries(functionsTestResponse?.runtimeCommands?.outputVars || {});
  const traces = [JSON.stringify(functionsTestResponse?.runtimeCommands.trace)];

  const onDownloadLogsClick = () => {
    download(`logs.json`, JSON.stringify(functionsTestResponse), DataTypes.JSON);
  };

  return (
    <>
      {!!path.length && !error && (
        <>
          <Collapsible
            isDisabled={disabled}
            isOpen={true}
            isEmpty={false}
            showDivider={false}
            contentClassName={sectionRecipe({ disabled })}
            header={
              <CollapsibleHeader isDisabled={disabled} label="Resolved path">
                {({ isOpen }) => <CollapsibleHeaderButton disabled={disabled} isOpen={isOpen} />}
              </CollapsibleHeader>
            }
          >
            {path.map(([pathName, pathValue]) => (
              <Mapper
                key={pathName}
                equalityIcon="arrow"
                leftHandSide={[<Variable label={pathName} key="0" />]}
                rightHandSide={[
                  <Text key={pathValue} variant="basic" className={rhsMapperStyles}>
                    {pathValue}
                  </Text>,
                ]}
              />
            ))}
          </Collapsible>

          <Divider noPadding />
        </>
      )}
      {!!outputVars.length && !error && (
        <>
          <Collapsible
            isDisabled={disabled}
            isOpen={true}
            isEmpty={false}
            showDivider={false}
            contentClassName={sectionRecipe({ disabled })}
            header={
              <CollapsibleHeader isDisabled={disabled} label="Output variables">
                {({ isOpen }) => <CollapsibleHeaderButton disabled={disabled} isOpen={isOpen} />}
              </CollapsibleHeader>
            }
          >
            <Box direction="column" className={mapperStyles}>
              {outputVars.map(([key, value]) => (
                <Mapper
                  key={key}
                  equalityIcon="arrow"
                  leftHandSide={[<Variable label={key} key={key} />]}
                  rightHandSide={[
                    <Text key={value} variant="basic" className={rhsMapperStyles}>
                      {value}
                    </Text>,
                  ]}
                />
              ))}
            </Box>
          </Collapsible>

          <Divider noPadding />
        </>
      )}
      {!!traces.length && (
        <>
          <Collapsible
            contentClassName={jsonCollapsibleStyles}
            isDisabled={disabled}
            showDivider={false}
            isEmpty={false}
            isOpen={error}
            header={
              <CollapsibleHeader isDisabled={disabled} label="Traces">
                {({ isOpen }) => <CollapsibleHeaderButton disabled={disabled} isOpen={isOpen} />}
              </CollapsibleHeader>
            }
          >
            <CodeEditor className={jsonEditorStyles} disabled={disabled} readOnly theme="light" language="json" isFunctionEditor value={traces} />
          </Collapsible>

          <Divider noPadding />
        </>
      )}

      <Box px={24} py={12} justify="space-between" align="center" className={sectionRecipe({ disabled })}>
        <Box gap={11} align="center">
          <Text variant="caption" weight="semiBold" color={error ? colors.alert.alert700 : colors.success.success600}>
            {error ? 'Error' : 'Success'}
          </Text>
          <DotSeparator light />
          <Text variant="caption" color={colors.neutralDark.neutralsDark50}>
            {latencyMS}ms
          </Text>
        </Box>
        <Link
          disabled={disabled}
          className={sectionRecipe({ disabled })}
          label="Download logs"
          variant="primary"
          size="small"
          weight="semiBold"
          onClick={onDownloadLogsClick}
        />
      </Box>
    </>
  );
};
