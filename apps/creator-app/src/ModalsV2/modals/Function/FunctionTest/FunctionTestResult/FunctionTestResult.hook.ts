import { AnyRecord } from '@voiceflow/common';
import { useEffect, useMemo } from 'react';

import { jsonEditorStyles, outputVarsStyles } from './FunctionTestResult.css';

const RESOLVED_PATH_CONTENT_HEIGHT = 46;
const SECTION_HEADER_HEIGHT = 58;
const SECTION_OPEN_PADDING = 4;
const SECTION_DIVIDER_HEIGHT = 1;
const FOOTER_HEIGHT = 44;
const MIN_OUTPUT_VARS_SECTION_HEIGHT = 50;
const MAX_OUTPUT_VARS_SECTION_HEIGHT = 86;
const PADDINGS = 64;
const MARGIN_BETWEEN_MODALS = 16;

export interface CalculateHeightProps {
  traces: string;
  outputVars: AnyRecord;
  path: AnyRecord;
  isTracesSectionOpened: boolean;
  isOutputVarsSectionOpened: boolean;
  isResolvedPathSectionOpened: boolean;
  inputVariables: number;
}

export const useTestResultModalHeight = ({
  inputVariables,
  isOutputVarsSectionOpened,
  isResolvedPathSectionOpened,
  isTracesSectionOpened,
  outputVars,
  path,
  traces,
}: CalculateHeightProps) => {
  const outputVarsCount = Object.keys(outputVars).length;
  const pathCount = Object.keys(path).length;

  const getAvailableSections = () => {
    const sections = [];
    if (pathCount) sections.push(isResolvedPathSectionOpened);
    if (outputVarsCount) sections.push(isOutputVarsSectionOpened);
    if (traces) sections.push(isTracesSectionOpened);
    return sections;
  };

  const calculateModalDefaultHeight = (): Record<string, number> => {
    const modalSections = getAvailableSections();
    const closedSections = modalSections.filter((s) => !s).length;

    const dividers = modalSections.length * SECTION_DIVIDER_HEIGHT;
    const sections = modalSections.length * SECTION_HEADER_HEIGHT;
    const sectionTopPaddings = closedSections * SECTION_OPEN_PADDING;

    return { sections, dividers, FOOTER_HEIGHT, sectionTopPaddings };
  };

  const calculateOutputVarsSectionHeight = () => {
    if (outputVarsCount === 1) return MIN_OUTPUT_VARS_SECTION_HEIGHT;
    return MAX_OUTPUT_VARS_SECTION_HEIGHT;
  };

  return useMemo(() => {
    let maxHeights = calculateModalDefaultHeight();

    if (isOutputVarsSectionOpened && outputVarsCount) maxHeights = { ...maxHeights, outputContent: calculateOutputVarsSectionHeight() };
    if (isResolvedPathSectionOpened && pathCount) maxHeights = { ...maxHeights, resolvedPath: RESOLVED_PATH_CONTENT_HEIGHT };

    return maxHeights;
  }, [isTracesSectionOpened, traces, outputVars, path, isOutputVarsSectionOpened, isResolvedPathSectionOpened, inputVariables]);
};

// TODO: find a better solution for this
export const useDynamicTracesCodeEditorHeight = ({
  traces,
  outputVars,
  path,
  isTracesSectionOpened,
  isOutputVarsSectionOpened,
  isResolvedPathSectionOpened,
  inputVariables,
}: CalculateHeightProps) => {
  const testResultModalHeights = useTestResultModalHeight({
    traces,
    outputVars,
    path,
    isTracesSectionOpened,
    isOutputVarsSectionOpened,
    isResolvedPathSectionOpened,
    inputVariables,
  });

  const calculateTestFunctionInputsModalHeight = () => {
    if (inputVariables === 0) return 196;
    if (inputVariables === 1) return 240;
    if (inputVariables === 2) return 316;
    return 392;
  };

  const calculateCodeEditorMaxHeight = () => {
    const testFunctionInputsModalHeight = calculateTestFunctionInputsModalHeight();
    const paddings = PADDINGS + MARGIN_BETWEEN_MODALS;
    let calcCss = `100vh - ${testFunctionInputsModalHeight}px - ${paddings}px`;

    Object.values(testResultModalHeights).forEach((height) => {
      calcCss += ` - ${height}px`;
    });

    if (isTracesSectionOpened) calcCss += ` + 6px`;

    return `calc(${calcCss})`;
  };

  const calculateOutputVarsMaxHeight = () => {
    const testFunctionInputsModalHeight = calculateTestFunctionInputsModalHeight();
    const paddings = PADDINGS + MARGIN_BETWEEN_MODALS;
    let calcCss = `100vh - ${testFunctionInputsModalHeight}px - ${paddings}px`;

    Object.entries(testResultModalHeights).forEach(([_, height]) => {
      calcCss += ` - ${height}px`;
    });

    return `calc(${calcCss})`;
  };

  useEffect(() => {
    const maxHeight = calculateCodeEditorMaxHeight();
    const outputVarsMaxHeight = calculateOutputVarsMaxHeight();
    const sectionElement = document.querySelector(`.${outputVarsStyles}`);
    const jsonEditorElement = document.querySelector(`.${jsonEditorStyles}`);

    // sets max height for both code editor and output vars section manually
    // because those section expands dynamically
    // and the max height is not calculated correctly
    jsonEditorElement?.setAttribute('style', `max-height: ${maxHeight}`);

    if (!isTracesSectionOpened || !traces) {
      sectionElement?.setAttribute('style', `max-height: ${outputVarsMaxHeight}`);
    } else {
      sectionElement?.setAttribute('style', 'max-height: 86px');
    }
  }, [isTracesSectionOpened, traces, outputVars, path, isOutputVarsSectionOpened, isResolvedPathSectionOpened, inputVariables]);
};
