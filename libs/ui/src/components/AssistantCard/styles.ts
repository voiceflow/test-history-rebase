import { Text } from '@ui/components/Text';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

const RADIUS = 8;

export const OuterContainer = styled.section`
  width: 100%;
`;

const InnerContainer = styled.div`
  ${transition('filter', 'opacity')}
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;
`;

export const CardActionContainer = styled(InnerContainer)`
  opacity: 0;
  background: rgba(238, 244, 246, 0.7);
`;

export const CardImageContainer = styled(InnerContainer)`
  filter: blur(0);
`;

export const CardContainer = styled.div<{ active?: boolean; isHovered?: boolean }>`
  width: 100%;
  height: 220px;
  background-color: #f9f9f9;
  border: rgb(223, 227, 237) 1px solid;
  border-radius: ${RADIUS}px;
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;
  overflow: hidden;

  &:hover ${CardActionContainer} {
    opacity: 1;
  }

  &:hover ${CardImageContainer} {
    filter: blur(5px);
  }

  ${({ active }) =>
    active &&
    css`
      & ${CardActionContainer} {
        opacity: 1 !important;
      }
      & ${CardImageContainer} {
        filter: blur(5px) !important;
      }
    `}

  ${({ isHovered }) =>
    isHovered &&
    css`
      ${CardActionContainer} {
        opacity: 1;
      }

      ${CardImageContainer} {
        filter: blur(5px);
      }
    `}
`;

export const ProjectImage = styled.div<{ src: string }>`
  width: 80px;
  height: 80px;
  position: absolute;
  background: ${({ src }) => css`url(${src})`} no-repeat center center;
  background-size: cover;

  border-radius: 12px;
  box-shadow: 0px 12px 24px rgba(19, 33, 68, 0.04), 0px 8px 12px rgba(19, 33, 68, 0.04), 0px 4px 4px rgba(19, 33, 68, 0.02),
    0px 2px 2px rgba(19, 33, 68, 0.01), 0px 1px 1px rgba(19, 33, 68, 0.01), 0px 1px 0px rgba(17, 49, 96, 0.03), 0px 0px 0px rgba(17, 49, 96, 0.06);
`;

export const IconContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 11px;
  left: 11px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: rgb(19 33 68 / 6%) 0px 1px 3px 0px, rgb(19 33 68 / 1%) 0px 1px 1px 0px, rgb(19 33 68 / 3%) 0px 1px 0px 0px,
    rgb(19 33 68 / 6%) 0px 0px 0px 1px;
  background-color: #fff;
`;

export const Title = styled(Text)`
  font-weight: 600;
  color: ${colors(ThemeColor.PRIMARY)};
  font-size: 15px;
  width: 100%;
  text-align: left;
  margin-top: 10px;
  text-overflow: ellipsis;
`;

export const SubTitle = styled.div`
  width: 100%;
  font-weight: 400;
  color: ${colors(ThemeColor.SECONDARY)};
  font-size: 13px;
  padding-top: 2px;
  line-height: 17px;

  display: flex;
`;

export const InfoContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
`;

export const Image = styled.div<{ backgroundColor?: string; src?: string }>`
  inset: 0;
  position: absolute;
  background-color: ${({ backgroundColor }) => backgroundColor};
  background-image: url(${({ src }) => src});
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;
`;
