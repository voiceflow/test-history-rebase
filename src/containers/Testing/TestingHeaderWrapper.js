import styled from 'styled-components';

import Button from '@/components/Button';
import { flexCenterStyles } from '@/componentsV2/Flex';

export const TestingBackButton = styled.div`
  cursor: pointer;
  font-size: 18px;
  width: 80px;
  line-height: 18px;
  border-right: 1px solid rgb(234, 239, 244);
  height: inherit;
  display: flex;
  align-items: center;
`;

export const StartSubButton = styled.div`
  position: absolute;
  top: 6px;
  right: 7px;
  display: flex;
  width: 30px;
  height: 30px;
  color: #fff;
  background-color: #00000030;
  border-radius: 100%;
  transition: all 0.2s;
  justify-content: center;
  align-items: center;
`;

export const SeparatorDot = styled.span`
  color: #8da2b5;
  margin: 0 12px;
`;

export const Timer = styled.span`
  color: #8da2b5;
`;

export const StartButton = styled(Button)`
  position: relative;
  ${flexCenterStyles};

  height: 42px;
  padding: 11px 58px 12px 22px;
  color: #fff !important;
  font-weight: 500;
  font-size: 15px;
  text-transform: none;
  background: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
  border: none;
  border-radius: 50px;
  box-shadow: 0 0 4px 0 rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: linear-gradient(0deg, #2c85ff, #2c85ff);
    border: none;
    box-shadow: 0px 4px 8px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
  }
  &:active {
    background: linear-gradient(0deg, #2c85ff, #2c85ff);
    border: none;
    box-shadow: 0px 7px 12px rgba(17, 49, 96, 0.16), 0px 0px 4px rgba(17, 49, 96, 0.08);
  }
`;
