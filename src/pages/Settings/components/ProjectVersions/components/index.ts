import Flex, { FlexCenter } from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

export const Descriptor = styled(DescriptorContainer)`
  padding: 0 32px;
  margin: 17px 0;
`;

const tableStyling = css`
  display: flex;
  justify-content: center;
  padding-left: 12px;
  height: 46px;
  border-top: solid 1px #eaeff4;

  & > :nth-child(1) {
    flex: 3;
  }
  & > :nth-child(2) {
    flex: 8;
  }
  & > :nth-child(3) {
    flex: 2;
  }
`;

export const TableContainer = styled.div`
  min-height: 400px;
  padding-left: 32px;
  padding-bottom: 10px;
`;

export const TableHeader = styled(Flex)`
  ${tableStyling};
  font-size: 13px;
  color: #62778c;
`;

export const TableRow = styled(Flex)`
  ${tableStyling};
  font-size: 15px;
  height: 60px;

  ${SvgIcon.Container} {
    display: inline-block;
    margin-right: 6px;
    position: relative;
    top: 1px;
  }
`;

export const IconContainer = styled(FlexCenter)`
  margin-left: -32px;
  height: 320px;
`;
