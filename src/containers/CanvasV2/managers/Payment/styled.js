import { FlexApart } from '@/componentsV2/Flex';
import { styled } from '@/hocs';

export const LabelTitle = styled(FlexApart)`
  margin-bottom: 6px;
`;

export const SeeAll = styled.div`
  color: #5d9df5;
  cursor: pointer;
`;

export const Separator = styled.div`
  position: relative;
  width: 100%;
  margin: 20px 0;
  border-top: 0.5px solid #eaeff4;

  & > div {
    position: absolute;
    top: -10px;
    left: 43%;
    padding: 0 15px;
    color: #8da2b5;
    font-weight: 600;
    font-size: 12px;
    background-color: #fff;
  }
`;
