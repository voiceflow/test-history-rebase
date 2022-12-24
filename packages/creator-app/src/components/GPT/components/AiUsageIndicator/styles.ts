import { styled } from '@/hocs/styled';

export const Container = styled.div`
  position: relative;
`;

export const StatusText = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  color: #132144;
  font-size: 11px;
  font-weight: 600;
  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
`;

export const UsageBarContainer = styled.div`
  position: absolute;
  top: 20px;
  right: -10px;
`;
