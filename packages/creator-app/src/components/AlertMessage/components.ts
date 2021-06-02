import Alert from 'reactstrap/lib/Alert';
import { layout, LayoutProps, position, PositionProps, space, SpaceProps, typography, TypographyProps } from 'styled-system';

import { styled } from '@/hocs';

export type ContainerProps = LayoutProps & PositionProps & SpaceProps & TypographyProps;

export const Container = styled(Alert)<ContainerProps>(layout, position, space, typography);
