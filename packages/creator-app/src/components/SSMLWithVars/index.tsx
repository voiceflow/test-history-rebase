import { SvgIconTypes, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { getPlatformDefaultVoice } from '@/utils/platform';

interface SSMLWithVarsProps {
  icon?: SvgIconTypes.Icon | null;
  value: string;
  voice?: string;
  onBlur: (data: { text: string; slots: string[] }) => void;
  autofocus?: boolean;
  placeholder?: string;
  onChangeVoice: (newVoice: string) => void;
  skipBlurOnUnmount?: boolean;
}

const SSMLWithVars: React.FC<SSMLWithVarsProps> = ({ icon = 'alexa', voice, autofocus, ...props }) => {
  const ssmlRef = React.useRef<{ forceFocusToTheEnd: VoidFunction } | null>(null);

  const locales = useSelector(VersionV2.active.localesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const defaultVoice = useSelector(VersionV2.active.defaultVoiceSelector);

  const addGlobalVariable = useDispatch(Version.addGlobalVariable);
  const updateDefaultVoice = useDispatch(Version.updateDefaultVoice);

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

  useSetup(() => {
    if (autofocus) {
      ssmlRef.current?.forceFocusToTheEnd();
    }
  }, []);

  return (
    <SSML
      ref={ssmlRef}
      icon={icon}
      voice={voice || platformDefaultVoice}
      space
      locales={locales}
      platform={platform}
      variables={vars}
      projectType={projectType}
      defaultVoice={defaultVoice || platformDefaultVoice}
      onAddVariable={onAddVariable}
      platformDefaultVoice={platformDefaultVoice}
      onChangeDefaultVoice={updateDefaultVoice}
      {...props}
    />
  );
};

export default SSMLWithVars;
