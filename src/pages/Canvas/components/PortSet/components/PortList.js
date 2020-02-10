import List from '@/components/List';
import { flexStyles } from '@/componentsV2/Flex';
import { css, styled } from '@/hocs';
import PortContainer from '@/pages/Canvas/components/Port/components/PortContainer';
import PortLabel from '@/pages/Canvas/components/Port/components/PortLabel';

const PortList = styled(List)`
  ${flexStyles}
  flex-direction: column;

  ${({ direction }) => css`
    ${direction === 'out'
      ? css`
          flex: 1;
          align-items: flex-end;

          & ${PortContainer} {
            border-radius: 5px 0 0 5px;
          }
        `
      : css`
          align-items: flex-start;

          & ${PortLabel} {
            order: 1;
          }

          & ${PortContainer} {
            border-radius: 0 5px 5px 0;
            order: 0;
          }
        `}
  `}
`;
export default PortList;
