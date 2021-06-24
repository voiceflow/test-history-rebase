import { ClickableText, FlexApart } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs';

const HeadingText = styled.div`
  font-size: 15px;
  color: #62778c;
`;

export const Container = styled(FlexApart)`
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

export const ActionMapping = ({ actions = [] }) => (
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

const StepHeading = ({ heading, actions = [], noBottomPadding, className }) => (
  <Container className={className} noBottomPadding={noBottomPadding}>
    <HeadingText>{heading}</HeadingText>
    <div>
      <ActionMapping actions={actions} />
    </div>
  </Container>
);

export default StepHeading;
