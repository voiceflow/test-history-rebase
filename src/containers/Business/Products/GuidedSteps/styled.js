import { FormGroup } from 'reactstrap';

import BaseButton from '@/components/Button';
import { css, styled } from '@/hocs';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;

  ${({ centered }) =>
    centered &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

export const GuidedStepsWrapper = styled.div``;

export const BackButton = styled(BaseButton)`
  top: 135px;
  left: 120px;
  position: fixed;
  width: 60px;
  height: 60px;
`;

export const RadioButtonGroup = styled(FormGroup)`
  display: flex;

  & > * {
    margin-right: 30px;
  }
`;

export const RadioButtonLabel = styled.label`
  font-weight: 400 !important;
`;

export const SubSection = styled.div`
  margin-bottom: 16px;

  ${({ flex }) =>
    flex &&
    css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
    `}

  ${({ topAlign }) =>
    topAlign &&
    css`
      align-items: flex-start;
    `}

  .small_input {
    width: 120px;
  }
`;

export const ProductDetailsContainer = styled.div`
  background: #fff;
  width: 600px;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
`;

export const Text = styled.span`
  padding: 0 10px;
  white-space: nowrap;
  color: #62778c;

  ${({ small }) =>
    small &&
    css`
      font-size: 11px;
    `};

  ${({ error }) =>
    error &&
    css`
      color: #dc3545;
    `};

  ${({ noPadding }) =>
    noPadding &&
    css`
      padding: 0;
    `};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
