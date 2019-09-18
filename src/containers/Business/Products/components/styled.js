import { Link } from 'react-router-dom';

import { css, styled } from '@/hocs';

export const DescriptionSection = styled.div`
  margin-bottom: 10px;

  ${({ color }) =>
    color &&
    css`
      color: #62778c;
    `}

  ul {
    padding-top: 10px;
  }

  span {
    font-weight: 600;
  }
`;

export const PopoverLink = styled.div`
  color: #5d9df5;
  cursor: pointer;
`;

export const CollapseWrapper = styled.div`
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  padding: 10px;
`;

export const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardBody = styled.div`
  padding-top: 10px;
  font-size: 13px;
`;

export const TextHeader = styled.div`
  color: ${({ color }) => color};
  padding-bottom: 10px;
`;

export const BackButtonContainer = styled.div`
  display: flex;
  padding: 20px 40px 20px 70px;
  width: 100%;
  justify-content: flex-start;
`;

export const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #8da2b5;

  & > * {
    padding-right: 10px;
  }

  &:hover {
    text-decoration: none;
    color: #62778c;
  }
`;
