import UIButton from '@ui/components/Button';
import { css, styled } from '@ui/styles';

export const Button = styled(UIButton.DarkButton)`
  padding: 10px 12px;
  margin: 8px -12px -4px -12px;
`;

export const Content = styled.div<{ $animateFill?: boolean }>`
  ${({ $animateFill }) =>
    $animateFill &&
    css`
      transition: opacity 0.37s, transform 0.22s;
      transition-delay: 0.005s;
      transition-timing-function: ease;

      .tippy-box[data-placement^='top'] & {
        transform: translateY(20px) scale(0);
        transform-origin: center bottom;
      }

      .tippy-box[data-placement^='top'] .tippy-content[data-state='hidden'] & {
        transform: translateY(20px) scale(0);
      }

      .tippy-box[data-placement^='bottom'] & {
        transform: translateY(-20px) scale(0);
        transform-origin: center top;
      }

      .tippy-box[data-placement^='bottom'] .tippy-content[data-state='hidden'] & {
        transform: translateY(-20px) scale(0);
      }

      .tippy-box[data-placement^='right'] & {
        transform: translateX(-20px) scale(0);
        transform-origin: left center;
      }

      .tippy-box[data-placement^='right'] .tippy-content[data-state='hidden'] & {
        transform: translateX(-20px) scale(0);
      }

      .tippy-box[data-placement^='left'] & {
        transform: translateX(20px) scale(0);
        transform-origin: right center;
      }

      .tippy-box[data-placement^='left'] .tippy-content[data-state='hidden'] & {
        transform: translateX(20px) scale(0);
      }

      .tippy-box .tippy-content[data-state='visible'] & {
        opacity: 1;
        transform: translateX(0) scale(1);
      }

      .tippy-box .tippy-content[data-state='hidden'] & {
        opacity: 0;
      }
    `}
`;
