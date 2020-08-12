import Alert from 'reactstrap/lib/Alert';
import { LayoutProps, PositionProps, SpaceProps, TypographyProps, layout, position, space, typography } from 'styled-system';

import { styled } from '@/hocs';

export type ContainerProps = LayoutProps & PositionProps & SpaceProps & TypographyProps;

export const Container = styled(Alert)<ContainerProps>(layout, position, space, typography);
