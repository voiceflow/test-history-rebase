import React from 'react';

import SubMenu, { SubMenuItem } from '@/components/SubMenu';
import { FeatureFlag } from '@/config/features';
import { PROTOTYPE_MENU_OPTIONS } from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { ConnectedProps } from '@/types';

const PrototypePage: React.FC<ConnectedPrototypePageProps> = ({ platform }) => {
  const prototypeTest = useFeature(FeatureFlag.PROTOTYPE_TEST);

  return <>{prototypeTest.isEnabled && <SubMenu options={PROTOTYPE_MENU_OPTIONS[platform].map((option: SubMenuItem) => option)} />}</>;
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

type ConnectedPrototypePageProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrototypePage);
