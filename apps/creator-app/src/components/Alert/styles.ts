import { BoxProps, boxStyles } from '@voiceflow/ui/src/components/Box';
import { BlockText } from '@voiceflow/ui/src/components/Text'
import { css, styled } from '@voiceflow/ui/src/styles';

export const Title = styled(BlockText)`
  font-weight: 600;
`;

export enum Variant {
  DANGER = 'danger',
  DEFAULT = 'default',
  WARNING = 'warning',
  UNSTYLED = 'unstyled',
}

const COLORS: Record<Variant, ReturnType<typeof css>> = {
  [Variant.DANGER]: css`
    color: #721c24;
    background: #f8d7da;
  `,

  [Variant.DEFAULT]: css`
    color: #3a6b93;
    background: #e3eff8;

    ${Title} {
      color: #284d6c;
    }
  `,

  [Variant.WARNING]: css`
    color: #856404;
    background: #fff3cd;
  `,

  [Variant.UNSTYLED]: css``,
};

export interface ContainerProps extends BoxProps {
  variant?: Variant;
}

export const Container = styled.div<ContainerProps>`
  font-size: 13px;
  position: relative;
  padding: 16px 20px;
  border-radius: 8px;
  line-height: 20px;

  ${({ variant = Variant.DEFAULT }) => COLORS[variant]}

  ${boxStyles}
`;
