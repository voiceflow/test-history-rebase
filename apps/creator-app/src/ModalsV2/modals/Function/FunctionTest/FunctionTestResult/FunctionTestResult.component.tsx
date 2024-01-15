import { clsx } from '@voiceflow/style';
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
  Theme,
  Tokens,
  Variable,
} from '@voiceflow/ui-next';
import React, { useMemo, useState } from 'react';

import {
  fullWidthStyle,
  jsonCollapsibleStyles,
  jsonEditorStyles,
  mapperStyles,
  rhsMapperStyles,
  sectionRecipe,
  testResults,
} from './FunctionTestResult.css';
import { IFunctionTestResult } from './FunctionTestResult.interface';

const { colors } = Tokens;
export interface IFunctionTestResultExtra {
  error?: boolean;
  disabled?: boolean;
  hasResolvedPath?: boolean;
  hasOutputVars?: boolean;
  onDownloadLogs?: () => void;
}

export const FunctionTestResult: React.FC<IFunctionTestResultExtra & IFunctionTestResult> = ({
  disabled = false,
  inputVariables,
  functionsTestResponse,
}) => {
  const error = functionsTestResponse?.success === false;
  const latencyMS = Math.round(functionsTestResponse?.latencyMS);
  const path = Object.entries(functionsTestResponse?.runtimeCommands?.next || {});
  const outputVars = Object.entries(functionsTestResponse?.runtimeCommands?.outputVars || {});
  const traces = JSON.stringify(functionsTestResponse?.runtimeCommands.trace);
  const onDownloadLogsClick = () => {
    download(`logs.json`, JSON.stringify(functionsTestResponse), DataTypes.JSON);
  };
  const [isResolvedPathSectionOpened, setIsResolvedPathSectionOpened] = useState<boolean>(true);
  const [isOutputVarsSectionOpened, setIsOutputVarsSectionOpened] = useState<boolean>(true);
  const [isTracesSectionOpened, setIsTracesSectionOpened] = useState<boolean>(false);

  const inputsVariant = useMemo(() => {
    if (inputVariables === 0) {
      return 'empty';
    }

    if (inputVariables === 1) {
      return 'min';
    }

    if (inputVariables === 2) {
      return 'medium';
    }

    return 'max';
  }, [inputVariables]);

  const sectionsVariant = useMemo(() => {
    if (error) return 'none';
    if (isResolvedPathSectionOpened && isOutputVarsSectionOpened) return 'opened';
    if (isResolvedPathSectionOpened && !isOutputVarsSectionOpened) return 'resolvedPathOpened';
    if (!isResolvedPathSectionOpened && isOutputVarsSectionOpened) return 'outputOpened';
    return 'closed';
  }, [isResolvedPathSectionOpened, isOutputVarsSectionOpened]);

  return (
    <div className={testResults({ inputs: inputsVariant, sections: sectionsVariant })}>
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
                <CollapsibleHeader isDisabled={disabled} label="Resolved path" className={fullWidthStyle}>
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

      {!!outputVars.length && !error && (
        <>
          <Collapsible
            isDisabled={disabled}
            isOpen={isOutputVarsSectionOpened}
            isEmpty={false}
            showDivider={false}
            contentClassName={sectionRecipe({ disabled, limited: outputVars.length > 2 && isTracesSectionOpened })}
            header={
              <Box width="100%" onClick={() => setIsOutputVarsSectionOpened(!isOutputVarsSectionOpened)}>
                <CollapsibleHeader isDisabled={disabled} label="Output variables" className={fullWidthStyle}>
                  {() => <CollapsibleHeaderButton disabled={disabled} isOpen={isOutputVarsSectionOpened} />}
                </CollapsibleHeader>
              </Box>
            }
          >
            <Box direction="column" className={mapperStyles}>
              {outputVars.map(([key, value]) => (
                <Mapper
                  key={key}
                  equalityIcon="equal"
                  leftHandSide={<Variable label={key} key={key} size="large" />}
                  rightHandSide={
                    <Text
                      variant="basic"
                      className={rhsMapperStyles}
                      color={value ? Theme.vars.color.font.default : Tokens.colors.neutralDark.neutralsDark100}
                    >
                      {value ? `"${value}"` : 'Undefined'}
                    </Text>
                  }
                />
              ))}
            </Box>
          </Collapsible>

          <Divider noPadding />
        </>
      )}

      {!error && (
        <Collapsible
          contentClassName={jsonCollapsibleStyles({ inputs: inputsVariant, sections: sectionsVariant })}
          isDisabled={disabled || !traces || error}
          showDivider={false}
          isEmpty={!traces}
          isOpen={isTracesSectionOpened}
          header={
            <Box width="100%" onClick={() => setIsTracesSectionOpened(!isTracesSectionOpened)}>
              <CollapsibleHeader isDisabled={disabled} label="Traces" className={fullWidthStyle}>
                {() => <CollapsibleHeaderButton disabled={disabled} isOpen={isTracesSectionOpened} />}
              </CollapsibleHeader>
            </Box>
          }
        >
          <CodeEditor className={jsonEditorStyles} disabled={disabled} readOnly theme="light" language="json" isFunctionEditor value={[traces]} />
        </Collapsible>
      )}

      {error && (
        <Collapsible
          contentClassName={jsonCollapsibleStyles({ inputs: inputsVariant, sections: sectionsVariant })}
          isDisabled={true}
          showDivider={false}
          isEmpty={!traces}
          isOpen={true}
          header={
            <CollapsibleHeader isDisabled={disabled} label="Traces">
              {({ isOpen }) => <CollapsibleHeaderButton disabled={disabled} isOpen={isOpen} />}
            </CollapsibleHeader>
          }
        >
          <CodeEditor className={jsonEditorStyles} disabled={disabled} readOnly theme="light" language="json" isFunctionEditor value={[traces]} />
        </Collapsible>
      )}

      <Divider noPadding />

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
    </div>
  );
};
