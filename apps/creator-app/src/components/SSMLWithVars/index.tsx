import composeRef from '@seznam/compose-react-refs';
import { SvgIconTypes, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import { TextEditorRef } from '@/components/TextEditor/types';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getErrorMessage } from '@/utils/error';

interface SSMLWithVarsProps {
  icon?: SvgIconTypes.Icon | null;
  value: string;
  voice?: string | null;
  onBlur: (data: { text: string; slots: string[] }) => void;
  onEmpty?: (isEmpty: boolean) => void;
  onFocus?: VoidFunction;
  readOnly?: boolean;
  isActive?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  onChangeVoice: (newVoice: string) => void;
  skipBlurOnUnmount?: boolean;
}

const SSMLWithVars = React.forwardRef<TextEditorRef, SSMLWithVarsProps>(({ icon = 'alexa', voice, autofocus, ...props }, ref) => {
  const projectTypeConfig = useActiveProjectTypeConfig();

  const ssmlRef = React.useRef<TextEditorRef>(null);

  const locales = useSelector(VersionV2.active.localesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const addGlobalVariable = useDispatch(VersionV2.addGlobalVariable);
  const updateDefaultVoice = useDispatch(VersionV2.voice.updateDefaultVoice);

  const onAddVariable = React.useCallback(
    async (name: string) => {
      try {
        await addGlobalVariable(name, CanvasCreationType.EDITOR);

        return { id: name, name, isVariable: true };
      } catch (err) {
        toast.error(getErrorMessage(err));
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
      ref={composeRef(ref, ssmlRef)}
      icon={icon}
      voice={voice || defaultVoice}
      space
      locales={locales}
      platform={platform}
      variables={variables}
      projectType={projectType}
      defaultVoice={defaultVoice}
      onAddVariable={onAddVariable}
      platformDefaultVoice={projectTypeConfig.project.voice}
      onChangeDefaultVoice={updateDefaultVoice}
      {...props}
    />
  );
});

export default SSMLWithVars;
