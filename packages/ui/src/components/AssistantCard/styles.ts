import { Link, Text } from '@ui/components/Text';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

export const OuterContainer = styled.section<{ wide?: boolean }>`
  width: 100%;
  ${({ wide }) =>
    !wide &&
    css`
      max-width: 367px;
    `};
`;

export const CardContainer = styled.div<{ active: boolean }>`
  width: 100%;
  height: 220px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: #dfe3ed 1px solid;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover .assistant-card-actions {
    opacity: 1;
  }

  &:hover .assistant-card-image {
    filter: blur(5px);
  }

  ${({ active }) =>
    active &&
    css`
      & .assistant-card-actions {
        opacity: 1 !important;
      }
      & .assistant-card-image {
        filter: blur(5px) !important;
      }
    `}
`;

export const InnerContainer = styled.div`
  ${transition('filter', 'opacity')}
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;

  &.assistant-card-actions {
    opacity: 0;
    background: rgba(238, 244, 246, 0.7);
  }

  &.assistant-card-image {
    filter: blur(0);
  }
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

export const StyledLink = styled(Link)`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

export const IconContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 11px;
  left: 11px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgb(223 224 228 / 80%);
  background-color: #fff;
  box-shadow: 0px 1px 0px rgba(19, 33, 68, 0.03);
`;

export const Title = styled(Text)`
  font-weight: 600;
  color: ${colors(ThemeColor.PRIMARY)};
  font-size: 15px;
  width: 100%;
  text-align: left;
  margin-top: 11px;
`;

export const SubTitle = styled.div`
  width: 100%;
  font-weight: 400;
  color: ${colors(ThemeColor.SECONDARY)};
  font-size: 13px;
  padding-top: 4px;

  display: flex;
`;

export const InfoContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const MembersContainer = styled.div`
  margin-left: -17px;
`;

export const Status = styled.div``;
