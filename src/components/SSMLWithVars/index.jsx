import React from 'react';

import SSML from '@/components/SSML';
import { toast } from '@/components/Toast';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';
import { getPlatformDefaultVoice } from '@/utils/platform';

const SSMLWithVars = (
  { icon = 'alexa', voice, variables, defaultVoice, platform, addGlobalVariable, saveSettings, updateSettings, ...props },
  ref
) => {
  const vars = React.useMemo(() => variables.map((name) => ({ id: name, name, isVariable: true })), [variables]);

  const platformDefaultVoice = getPlatformDefaultVoice(platform);

  const onAddVariable = React.useCallback(
    (name) => {
      try {
        addGlobalVariable(name);

        return { id: name, name, isVariable: true };
      } catch (err) {
        toast.error(err.message);
        return null;
      }
    },
    [addGlobalVariable]
  );

  const onChangeDefaultVoice = React.useCallback((value) => {
    updateSettings({ defaultVoice: value });
    saveSettings({ settings: { defaultVoice: value } }, ['defaultVoice']);
  }, []);

  return (
    <SSML
      ref={ref}
      icon={icon}
      // defaultVoice from store is nullable
      voice={voice || defaultVoice || platformDefaultVoice}
      space
      platform={platform}
      variables={vars}
      defaultVoice={defaultVoice || platformDefaultVoice}
      onAddVariable={onAddVariable}
      platformDefaultVoice={platformDefaultVoice}
      onChangeDefaultVoice={onChangeDefaultVoice}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  variables: allVariablesSelector,
  defaultVoice: Skill.defaultVoiceSelector,
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
  updateSettings: Skill.updateSettings,
  addGlobalVariable: Skill.addGlobalVariable,
};

export default compose(connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }), React.forwardRef)(SSMLWithVars);
