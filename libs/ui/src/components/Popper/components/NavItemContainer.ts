import { flexApartStyles } from '@/components/Flex';
import { styled, transition } from '@/styles';

const NavItemContainer = styled.div`
  ${flexApartStyles}

  width: 100%;
  height: 42px;
  padding: 11px 24px;
  cursor: pointer;
  position: relative;
  font-size: 15px;
  user-select: none;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), #eef4f6);
    border-top: 1px solid rgba(238, 244, 246, 0);
    border-bottom: 1px solid rgba(238, 244, 246, 0);
    opacity: 0;
    z-index: -1;

    ${transition('opacity', 'border')};

    content: '';
  }

  .active & {
    cursor: default;

    &:before {
      border-color: #dfe3ed;
      opacity: 1;
    }
  }
`;

export default NavItemContainer;
