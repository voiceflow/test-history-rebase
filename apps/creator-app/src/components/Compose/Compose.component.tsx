import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react';

type AnyComponent = React.ComponentType<any>;

export type ComponentTupple<C extends AnyComponent> = [C, ComponentProps<C>];

interface ComposeProps extends PropsWithChildren {
  components: Array<AnyComponent | ComponentTupple<AnyComponent>>;
}

export const Compose: React.FC<ComposeProps> = ({ components, children }) => (
  <>
    {components.reduceRight<ReactNode>((acc, config) => {
      if (Array.isArray(config)) {
        const [Component, props] = config;
        return <Component {...props}>{acc}</Component>;
      }

      const Comonent = config;
      return <Comonent>{acc}</Comonent>;
    }, children)}
  </>
);
