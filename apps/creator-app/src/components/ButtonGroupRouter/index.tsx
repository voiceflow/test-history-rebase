import React from 'react';

import ButtonGroup from '@/components/ButtonGroup';
import { styled } from '@/hocs/styled';

interface ContentContainerProps {
  maxHeight?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  margin-top: ${(props) => (props.maxHeight ? '16px' : '')};
`;

export type ButtonGroupRouterProps<T> = ContentContainerProps & {
  maxHeight?: boolean;
  routes: any[];
  routeProps: any;
  selected: T;
  onChange?: (value: T) => void;
  containerComponent: React.FC<React.PropsWithChildren>;
};

const ButtonGroupRouter = <T extends any>({
  maxHeight,
  routes,
  routeProps,
  selected,
  onChange,
  containerComponent: ContainerComponent = React.Fragment,
}: ButtonGroupRouterProps<T>) => {
  const activeRoute = routes.find(({ value }) => value === selected) || routes[0];

  return (
    <>
      <ContainerComponent>
        <ButtonGroup options={routes} selected={selected || activeRoute.value} onChange={onChange} />
      </ContainerComponent>
      <ContentContainer maxHeight={maxHeight}>{activeRoute && <activeRoute.component {...routeProps} />}</ContentContainer>
    </>
  );
};

export default ButtonGroupRouter;
