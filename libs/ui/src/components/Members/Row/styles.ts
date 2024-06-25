import Select from '@ui/components/Select';
import { css, styled } from '@ui/styles';

export const Container = styled.div<{ inset?: boolean; border?: boolean }>`
  flex-grow: 1;
  display: flex;
  position: relative;
  padding: 16px 32px;
  gap: 16px;
  align-items: center;

  ${({ border, inset }) =>
    border &&
    css`
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        left: ${inset ? '32px' : '0'};
        bottom: 0;
        border-top: 1px solid #eaeff4;
      }
    `}
`;

export const Info = styled.div`
  overflow: hidden;
  flex: 1;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Name = styled.div`
  margin-bottom: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Badge = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  color: #3d82e2;
  font-weight: 700;
  margin-left: 8px;

  border-radius: 11px;
  box-shadow:
    0px 1px 0px rgba(19, 33, 68, 0.12),
    0px 0px 1px rgba(19, 33, 68, 0.2);
  background-color: #ffffff;
  display: inline-flex;
  padding: 3px 8px;
`;

export const Email = styled.div`
  color: #62778c;
  font-size: 13px;
`;

export const RoleSelectContainer = styled.div`
  margin-right: -12px;
  display: flex;
  align-items: center;

  ${Select.SearchInput} {
    padding-left: 12px;
  }
`;
