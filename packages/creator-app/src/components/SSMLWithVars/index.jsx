import { toast } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import * as Diagram from '@/ducks/diagram';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { compose } from '@/utils/functional';
import { getPlatformDefaultVoice } from '@/utils/platform';

const SSMLWithVars = ({ icon = 'alexa', voice, variables, locales, defaultVoice, platform, addGlobalVariable, saveDefaultVoice, ...props }, ref) => {
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

  return (
    <SSML
      ref={ref}
      icon={icon}
      locales={locales}
      // defaultVoice from store is nullable
      voice={voice || defaultVoice || platformDefaultVoice}
      space
      platform={platform}
      variables={vars}
      defaultVoice={defaultVoice || platformDefaultVoice}
      onAddVariable={onAddVariable}
      platformDefaultVoice={platformDefaultVoice}
      onChangeDefaultVoice={saveDefaultVoice}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  variables: Diagram.activeDiagramAllVariablesSelector,
  defaultVoice: Version.activeDefaultVoiceSelector,
  locales: Version.activeLocalesSelector,
};

const mapDispatchToProps = {
  saveDefaultVoice: Version.saveDefaultVoice,
  addGlobalVariable: Version.addGlobalVariable,
};

export default compose(connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }), React.forwardRef)(SSMLWithVars);
