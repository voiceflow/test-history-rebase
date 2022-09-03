import UIButton from '@ui/components/Button';
import { styled } from '@ui/styles';

export const Button = styled(UIButton.DarkButton)`
  padding: 10px 0px;
  margin: 8px -12px -4px -12px;
`;

export const Content = styled.div`
  transition: opacity 0.37s, transform 0.22s;
  transition-delay: 0.005s;
  transition-timing-function: ease;

  .tippy-popper[x-placement^='top'] & {
    transform: translateY(20px) scale(0);
    transform-origin: center bottom;
  }

  .tippy-popper[x-placement^='top'] .tippy-tooltip .leave + .tippy-tooltip-content & {
    transform: translateY(20px) scale(0);
  }

  .tippy-popper[x-placement^='bottom'] & {
    transform: translateY(-20px) scale(0);
    transform-origin: center top;
  }

  .tippy-popper[x-placement^='bottom'] .tippy-tooltip .leave + .tippy-tooltip-content & {
    transform: translateY(-20px) scale(0);
  }

  .tippy-popper[x-placement^='right'] & {
    transform: translateX(-20px) scale(0);
    transform-origin: left center;
  }

  .tippy-popper[x-placement^='right'] .tippy-tooltip .leave + .tippy-tooltip-content & {
    transform: translateX(-20px) scale(0);
  }

  .tippy-popper[x-placement^='left'] & {
    transform: translateX(20px) scale(0);
    transform-origin: right center;
  }

  .tippy-popper[x-placement^='left'] .tippy-tooltip .leave + .tippy-tooltip-content & {
    transform: translateX(20px) scale(0);
  }

  .tippy-popper .tippy-tooltip .enter + .tippy-tooltip-content & {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  .tippy-popper .tippy-tooltip .leave + .tippy-tooltip-content & {
    opacity: 0;
  }
`;
