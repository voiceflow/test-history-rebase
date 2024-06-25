import type { SectionV2Types } from '@voiceflow/ui';
import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { Description, RadioGroupContainer, RadioGroupDescription, Title } from './components';
import * as S from './styles';

interface SubSectionProps extends React.PropsWithChildren {
  header?: React.ReactNode;
  splitView?: boolean;
  headerProps?: SectionV2Types.HeaderProps;
  contentProps?: SectionV2Types.ContentProps;
}

const SubSection: React.FC<SubSectionProps> = ({ header, children, splitView, headerProps, contentProps }) => (
  <SectionV2
    header={
      header && (
        <SectionV2.Header topUnit={3} bottomUnit={1.375} {...headerProps}>
          <SectionV2.Title bold secondary>
            {header}
          </SectionV2.Title>
        </SectionV2.Header>
      )
    }
    minHeight={0}
  >
    <SectionV2.Content bottomOffset={3} {...contentProps}>
      {splitView ? (
        <S.SplitContainer>
          {React.Children.map(children, (child) => (
            <Box flex={1}>{child}</Box>
          ))}
        </S.SplitContainer>
      ) : (
        children
      )}
    </SectionV2.Content>
  </SectionV2>
);

export default Object.assign(SubSection, {
  Title,
  Description,
  RadioGroupContainer,
  RadioGroupDescription,
});
