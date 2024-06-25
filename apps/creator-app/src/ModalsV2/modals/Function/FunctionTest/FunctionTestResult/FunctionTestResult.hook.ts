import type { AnyRecord } from '@voiceflow/common';
import { useLayoutEffect, useMemo } from 'react';

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
  paths: string[];
  isTracesSectionOpened: boolean;
  isOutputVarsSectionOpened: boolean;
  isResolvedPathSectionOpened: boolean;
  numInputVariables: number;
}

export const useTestResultModalHeight = ({
  numInputVariables,
  isOutputVarsSectionOpened,
  isResolvedPathSectionOpened,
  isTracesSectionOpened,
  outputVars,
  paths,
  traces,
}: CalculateHeightProps) => {
  const outputVarsCount = Object.keys(outputVars).length;

  return useMemo(() => {
    const getAvailableSections = () => {
      const sections = [];
      if (paths.length) sections.push(isResolvedPathSectionOpened);
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

    let maxHeights = calculateModalDefaultHeight();

    if (isOutputVarsSectionOpened && outputVarsCount)
      maxHeights = { ...maxHeights, outputContent: calculateOutputVarsSectionHeight() };
    if (isResolvedPathSectionOpened && paths.length)
      maxHeights = { ...maxHeights, resolvedPath: RESOLVED_PATH_CONTENT_HEIGHT };

    return maxHeights;
  }, [
    isTracesSectionOpened,
    traces,
    outputVars,
    paths,
    isOutputVarsSectionOpened,
    isResolvedPathSectionOpened,
    numInputVariables,
  ]);
};

// TODO: find a better solution for this
export const useDynamicTracesCodeEditorHeight = ({
  traces,
  outputVars,
  paths,
  isTracesSectionOpened,
  isOutputVarsSectionOpened,
  isResolvedPathSectionOpened,
  numInputVariables,
}: CalculateHeightProps) => {
  const testResultModalHeights = useTestResultModalHeight({
    traces,
    outputVars,
    paths,
    isTracesSectionOpened,
    isOutputVarsSectionOpened,
    isResolvedPathSectionOpened,
    numInputVariables,
  });

  const calculateTestFunctionInputsModalHeight = () => {
    if (numInputVariables === 0) return 196;
    if (numInputVariables === 1) return 240;
    if (numInputVariables === 2) return 316;
    return 392;
  };

  const calculateCodeEditorMaxHeight = () => {
    const testFunctionInputsModalHeight = calculateTestFunctionInputsModalHeight();
    const paddings = PADDINGS + MARGIN_BETWEEN_MODALS;
    let calcCss = `100vh - ${testFunctionInputsModalHeight}px - ${paddings}px`;

    Object.values(testResultModalHeights).forEach((height) => {
      calcCss += ` - ${height}px`;
    });

    // TODO: magic number
    if (isTracesSectionOpened) calcCss += ' + 14px';

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

  useLayoutEffect(() => {
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
  }, [
    isTracesSectionOpened,
    traces,
    outputVars,
    paths,
    isOutputVarsSectionOpened,
    isResolvedPathSectionOpened,
    numInputVariables,
  ]);
};
