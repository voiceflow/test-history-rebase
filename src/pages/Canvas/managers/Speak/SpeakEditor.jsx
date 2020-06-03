import React from 'react';

import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import SpeakItemList from '@/pages/Canvas/components/SpeakItemList';

import StyledSpeakItem from './StyledSpeakItem';

const MAX_EXPRESSIONS = 22;

const SpeakEditor = ({ data, platform, onChange }) => {
  const { dialogs, randomize } = data;

  const changeRandomize = React.useCallback(
    (randomize) => {
      onChange({ randomize });
    },
    [onChange]
  );

  const updateDialogs = React.useCallback((dialogs) => onChange({ dialogs }), [onChange]);

  return (
    <SpeakItemList
      platform={platform}
      changeRandomize={changeRandomize}
      changeSpeakItems={updateDialogs}
      itemComponent={StyledSpeakItem}
      maxItems={MAX_EXPRESSIONS}
      speakItems={dialogs}
      randomize={randomize}
    />
  );
};

const mapStateToProps = {
  platform: activePlatformSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(SpeakEditor);
