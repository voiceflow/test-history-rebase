import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { CSSProperties } from 'styled-components';

import * as S from './styles';

interface SettingSubSectionProps {
  header?: string;
  rightDescription?: JSX.Element | React.ReactNode;
  leftDescription?: JSX.Element | React.ReactNode;
  customHeaderStyling?: CSSProperties;
  descriptionOffset?: number;
  radioButton?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  growInput?: boolean;
}

const SettingSubSection: React.OldFC<SettingSubSectionProps> = ({
  header,
  rightDescription,
  leftDescription,
  customHeaderStyling,
  descriptionOffset,
  radioButton,
  growInput = true,
  topOffset,
  bottomOffset,
  children,
}) => {
  return (
    <SectionV2
      header={
        header && (
          <SectionV2.Header style={customHeaderStyling} pb={12} pt={24}>
            <SectionV2.Title bold secondary>
              {header}
            </SectionV2.Title>
          </SectionV2.Header>
        )
      }
    >
      <SectionV2.Content bottomOffset={bottomOffset || 3} topOffset={topOffset} paddingLeft={radioButton ? '16px' : '32px'}>
        <Box.FlexApart style={{ alignItems: 'flex-start' }}>
          {rightDescription && (
            <Box paddingRight="24px" style={{ alignSelf: 'flex-end', paddingTop: '6px' }}>
              {rightDescription}
            </Box>
          )}
          <Box.Flex style={growInput ? { flexGrow: 1 } : { width: '100%' }}>{children}</Box.Flex>
          {leftDescription && (
            <S.LeftDescription pt={descriptionOffset} radioButtonDescription={radioButton}>
              {leftDescription}
            </S.LeftDescription>
          )}
        </Box.FlexApart>
      </SectionV2.Content>
    </SectionV2>
  );
};

export default SettingSubSection;
