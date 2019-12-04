import React from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { amznIDSelector } from '@/ducks/publish/alexa';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

const LogIndicator = ({ page, skillID, amznID, platform }) => {
  if (!amznID || platform !== PlatformType.ALEXA) {
    return null;
  }

  return page === 'logs' ? (
    <div className="log-icon ml-3">
      <SvgIcon icon="logs" />
    </div>
  ) : (
    <Link to={`/creator_logs/${skillID}`} className="log-icon ml-3">
      <SvgIcon icon="logs" />
    </Link>
  );
};

export const mapStateToProps = {
  platform: activePlatformSelector,
  skillID: activeSkillIDSelector,
  amznID: amznIDSelector,
};

export default connect(mapStateToProps)(LogIndicator);
