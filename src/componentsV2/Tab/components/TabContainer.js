import { baseButtonStyles } from '@/componentsV2/Button/components/BaseButton';
import { css, styled, transition } from '@/hocs';

const TabContainer = styled.button`
  ${baseButtonStyles}
  position: relative;
  height: 100%;
  padding: 0 24px;
  background: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  text-transform: capitalize;
  user-select: none;
  cursor: pointer;
  color: #949db0;
  ${transition()};

  &:hover {
    text-decoration: none;
    color: #848da0;
  }

  ::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    overflow: hidden;
    height: 2px;
    transition: width 0.2s linear, opacity 0.2s linear;
    background-color: #5d9df5;
    opacity: 0;
  }

  ${({ isActive }) =>
    isActive
      ? css`
          color: #5d9df5;
          font-weight: 600;
          cursor: pointer;

          &:hover {
            color: #5d9df5;
          }
          ::before {
            opacity: 1;
            width: 100%;
            transition: width 0.2s linear;
          }
        `
      : css`
          color: #949db0;
        `};
`;

export default TabContainer;
