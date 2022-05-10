import { css, styled, transition } from '@ui/styles';

export const Container = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  height: 38px;
  padding: 3px;
  border-radius: 8px;
  background-color: #f6f7f9;
`;

export const Tab = styled.button<{ isActive?: boolean }>`
  ${transition('background', 'box-shadow', 'color')}
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0px;
  height: 32px;
  padding: 0 10px;
  font-weight: 600;
  border-radius: 6px;
  overflow: hidden;

  ${({ isActive }) =>
    isActive
      ? css`
          background-color: #ffffff;
          background-image: linear-gradient(to bottom, var(--white), #fdfdfd);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03);
          color: #132144;
        `
      : css`
          color: #62778c;
          background: transparent;
        `}
`;

export const Label = styled.span`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
