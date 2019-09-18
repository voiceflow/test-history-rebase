import { Link } from 'react-router-dom';

import { styled } from '@/hocs';

export const ProductListWrapper = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 32px 0;
`;

export const BackButtonContainer = styled.div`
  display: flex;
  padding: 0 10px 20px 50px;
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

export const Container = styled.div`
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid #eaeff4;
  transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;
  position: relative;
  width: 600px;

  &:hover {
    border-color: transparent;
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);
  }
`;

export const Icon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #d4d9e6;
  background-size: cover;
  background: ${({ background }) => background && `url(${background}) no-repeat center`};
`;

export const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`;

export const Title = styled.div`
  font-size: 15px;
  margin-bottom: 4px;
`;

export const SubTitle = styled.div`
  font-size: 13px;
  margin-bottom: 20px;
  color: #8da2b5;
`;

export const Description = styled.div`
  font-size: 15px;
  color: #62778c;
`;

export const Status = styled.div`
  padding-left: 10px;
  position: absolute;
  right: 24px;
  top: 64px;
`;

export const TooltipInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const StatusText = styled.div`
  margin-bottom: 10px;
`;
