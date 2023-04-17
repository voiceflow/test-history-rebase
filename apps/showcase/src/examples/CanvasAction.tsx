import { Canvas } from '@voiceflow/ui';
import React from 'react';

import { withBoxFlexCenter } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBoxFlexCenter({ padding: 40, backgroundColor: '#fff' });

export default createSection('Canvas.Action', 'src/components/Canvas/components/Action/index.tsx', [
  createExample(
    'simple',
    wrapContainer(() => (
      <Canvas.Action
        icon={<Canvas.Action.Icon icon="setV2" />}
        port={
          <Canvas.Action.Port>
            <Canvas.Port />
          </Canvas.Action.Port>
        }
      />
    ))
  ),

  createExample(
    'simple active',
    wrapContainer(() => (
      <Canvas.Action
        active
        icon={<Canvas.Action.Icon icon="setV2" />}
        port={
          <Canvas.Action.Port>
            <Canvas.Port />
          </Canvas.Action.Port>
        }
      />
    ))
  ),

  createExample(
    'with placeholder',
    wrapContainer(() => (
      <Canvas.Action
        icon={<Canvas.Action.Icon icon="setV2" />}
        label={<Canvas.Action.Label secondary>label</Canvas.Action.Label>}
        port={
          <Canvas.Action.Port>
            <Canvas.Port />
          </Canvas.Action.Port>
        }
      />
    ))
  ),

  createExample(
    'with label',
    wrapContainer(() => (
      <Canvas.Action
        icon={<Canvas.Action.Icon icon="setV2" />}
        label={<Canvas.Action.Label>label</Canvas.Action.Label>}
        port={
          <Canvas.Action.Port>
            <Canvas.Port />
          </Canvas.Action.Port>
        }
      />
    ))
  ),

  createExample(
    'with label active',
    wrapContainer(() => (
      <Canvas.Action
        active
        icon={<Canvas.Action.Icon icon="setV2" />}
        port={
          <Canvas.Action.Port>
            <Canvas.Port connected />
          </Canvas.Action.Port>
        }
        label={<Canvas.Action.Label>label</Canvas.Action.Label>}
      />
    ))
  ),

  createExample(
    'chain',
    wrapContainer(() => (
      <>
        <Canvas.Action
          icon={<Canvas.Action.Icon icon="setV2" />}
          port={
            <Canvas.Action.Port>
              <Canvas.Port connected />
            </Canvas.Action.Port>
          }
          label={<Canvas.Action.Label secondary>label</Canvas.Action.Label>}
        />

        <Canvas.Action.Connector />

        <Canvas.Action
          icon={<Canvas.Action.Icon icon="setV2" />}
          port={
            <Canvas.Action.Port>
              <Canvas.Port connected />
            </Canvas.Action.Port>
          }
        />

        <Canvas.Action.Connector />

        <Canvas.Action
          icon={<Canvas.Action.Icon icon="setV2" />}
          port={
            <Canvas.Action.Port>
              <Canvas.Port />
            </Canvas.Action.Port>
          }
          label={<Canvas.Action.Label>label</Canvas.Action.Label>}
        />
      </>
    ))
  ),

  createExample(
    'reversed simple',
    wrapContainer(() => (
      <Canvas.Action
        reversed
        icon={<Canvas.Action.Icon icon="setV2" />}
        port={
          <Canvas.Action.Port>
            <Canvas.Port />
          </Canvas.Action.Port>
        }
      />
    ))
  ),

  createExample(
    'reversed with label',
    wrapContainer(() => (
      <Canvas.Action
        reversed
        icon={<Canvas.Action.Icon icon="setV2" />}
        port={
          <Canvas.Action.Port>
            <Canvas.Port connected />
          </Canvas.Action.Port>
        }
        label={<Canvas.Action.Label>label</Canvas.Action.Label>}
      />
    ))
  ),

  createExample(
    'reversed chain',
    wrapContainer(() => (
      <>
        <Canvas.Action
          reversed
          icon={<Canvas.Action.Icon icon="setV2" />}
          port={
            <Canvas.Action.Port>
              <Canvas.Port />
            </Canvas.Action.Port>
          }
          label={<Canvas.Action.Label>label</Canvas.Action.Label>}
        />

        <Canvas.Action.Connector reversed />

        <Canvas.Action
          reversed
          icon={<Canvas.Action.Icon icon="setV2" />}
          port={
            <Canvas.Action.Port>
              <Canvas.Port connected />
            </Canvas.Action.Port>
          }
        />

        <Canvas.Action.Connector reversed />

        <Canvas.Action
          reversed
          icon={<Canvas.Action.Icon icon="setV2" />}
          port={
            <Canvas.Action.Port>
              <Canvas.Port connected />
            </Canvas.Action.Port>
          }
          label={<Canvas.Action.Label secondary>label</Canvas.Action.Label>}
        />
      </>
    ))
  ),
]);
