import { ClickableText, FlexApart } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs/styled';

const HeadingText = styled.div`
  font-size: 15px;
  color: #62778c;
`;

interface ContainerProps {
  noBottomPadding: boolean;
}

export const Container = styled(FlexApart)<ContainerProps>`
  font-weight: 600;
  padding: 12px 32px;
  ${({ noBottomPadding }) =>
    noBottomPadding &&
    css`
      padding-bottom: 0;
    `}
`;

const ActionText = styled(ClickableText)``;

const Text = styled.span`
  font-weight: 300;
  font-size: 13px;
`;

const Divider = styled.span`
  color: #d4d9e6;
`;

export interface Action {
  action: React.MouseEventHandler<HTMLSpanElement>;
  label: string | JSX.Element;
}

interface ActionMappingProps {
  actions: Action[];
}

export const ActionMapping: React.FC<ActionMappingProps> = ({ actions }) => (
  <>
    {actions.map((action, index) => (
      <React.Fragment key={index}>
        <ActionText onClick={action.action}>
          <Text>{action.label}</Text>
        </ActionText>
        {index !== actions.length - 1 && <Divider> | </Divider>}
      </React.Fragment>
    ))}
  </>
);

interface StepHeadingProps {
  heading: string;
  className?: string;
  actions: Action[];
  noBottomPadding: boolean;
}

const StepHeading: React.FC<StepHeadingProps> = ({ heading, actions, noBottomPadding, className }) => (
  <Container className={className} noBottomPadding={noBottomPadding}>
    <HeadingText>{heading}</HeadingText>
    <div>
      <ActionMapping actions={actions} />
    </div>
  </Container>
);

export default StepHeading;
