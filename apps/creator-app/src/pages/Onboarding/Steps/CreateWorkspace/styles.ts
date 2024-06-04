import { Animations, Input } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Animations.FadeLeft)<{ width?: number; textAlign?: string }>`
  ${({ width }) =>
    width
      ? css`
          width: ${width}px;
        `
      : css`
          width: 480px;
        `};

  ${({ textAlign = 'center' }) => css`
    text-align: ${textAlign};
  `};

  padding-top: 65px;
`;

export const LabelContainer = styled.div`
  text-align: center;
  color: #8da2b5;
  line-height: 22px;
  font-size: 15px;
  margin-top: 12px;
  margin-bottom: 40px;
`;

export const WorkspaceNameInput = styled(Input)`
  border: 1px solid rgb(210, 218, 226);
  text-align: center;
  box-shadow: rgba(17, 49, 96, 0.06) 0px 0px 3px 0px;
  width: 420px;
  height: 57px;
  border-radius: 5px;
  font-size: 18px;
  margin-bottom: 40px;
  line-height: normal;

  ::placeholder {
    color: #8da2b5 !important;
    font-size: 18px !important;
    line-height: 34px;
  }

  :focus {
    box-shadow: none;
  }
`;
