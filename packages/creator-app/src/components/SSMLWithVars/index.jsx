import { toast } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { compose, connect } from '@/hocs';
import { getPlatformDefaultVoice } from '@/utils/platform';

const SSMLWithVars = (
  { icon = 'alexa', voice, variables, locales, defaultVoice, platform, addGlobalVariable, updateDefaultVoice, ...props },
  ref
) => {
  const vars = React.useMemo(() => variables.map((name) => ({ id: name, name, isVariable: true })), [variables]);
  const platformDefaultVoice = getPlatformDefaultVoice(platform);

  const onAddVariable = React.useCallback(
    async (name) => {
      try {
        await addGlobalVariable(name, CanvasCreationType.EDITOR);

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
      onChangeDefaultVoice={updateDefaultVoice}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  variables: DiagramV2.active.allSlotsAndVariablesSelector,
  defaultVoice: VersionV2.active.defaultVoiceSelector,
  locales: VersionV2.active.localesSelector,
};

const mapDispatchToProps = {
  updateDefaultVoice: Version.updateDefaultVoice,
  addGlobalVariable: Version.addGlobalVariable,
};

export default compose(connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }), React.forwardRef)(SSMLWithVars);
