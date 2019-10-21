import React from 'react';

import ButtonGroup from '@/components/ButtonGroup';
import { styled } from '@/hocs';

const ContentContainer = styled.div`
  margin-top: ${(props) => (props.maxHeight ? '16px' : '')};
`;

function ButtonGroupRouter({ maxHeight, routes, routeProps, selected, onChange, containerComponent: ContainerComponent = React.Fragment }) {
  const activeRoute = routes.find(({ value }) => value === selected) || routes[0];

  return (
    <>
      <ContainerComponent>
        <ButtonGroup options={routes} selected={selected || activeRoute.value} onChange={onChange} />
      </ContainerComponent>
      <ContentContainer maxHeight={maxHeight}>{activeRoute && <activeRoute.component {...routeProps} />}</ContentContainer>
    </>
  );
}

export default ButtonGroupRouter;
