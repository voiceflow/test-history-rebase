import React from 'react';

import SubMenu, { SubMenuItem } from '@/components/SubMenu';
import { FeatureFlag } from '@/config/features';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import Canvas from '@/pages/Canvas';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

import { PrototypeDeveloper, PrototypeDisplaySettings } from './components';
import { PROTOTYPE_MENU_OPTIONS } from './constants';

const PrototypePage: React.FC<ConnectedPrototypePageProps> = ({ mode, platform, updatePrototypeMode }) => {
  const prototypeTest = useFeature(FeatureFlag.PROTOTYPE_TEST);
  const isPrototypingMode = usePrototypingMode();

  const renderPrototypePageContent = () => {
    switch (mode) {
      case Prototype.PrototypeMode.CANVAS:
        return <Canvas />;
      case Prototype.PrototypeMode.DISPLAY:
        return <PrototypeDisplaySettings open={isPrototypingMode} />;
      case Prototype.PrototypeMode.DEVELOPER:
        return (
          <>
            <PrototypeDeveloper open={isPrototypingMode} />
            <Canvas />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <>
      {!prototypeTest.isEnabled && <Canvas />}
      {prototypeTest.isEnabled && (
        <>
          <SubMenu
            options={PROTOTYPE_MENU_OPTIONS[platform].map((option: SubMenuItem) => option)}
            onChange={(value: string) => {
              updatePrototypeMode(value as Prototype.PrototypeMode);
            }}
          />
          {renderPrototypePageContent()}
        </>
      )}
    </>
  );
};

const mapStateToProps = { mode: Prototype.prototypeModeSelector, platform: Skill.activePlatformSelector };

const mapDispatchToProps = {
  updatePrototypeMode: Prototype.updatePrototypeMode,
};

type ConnectedPrototypePageProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypePage);
