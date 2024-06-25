import composeRef from '@seznam/compose-react-refs';
import type { SvgIconTypes } from '@voiceflow/ui';
import { useSetup } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import type { TextEditorRef } from '@/components/TextEditor/types';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useVariableCreateModal } from '@/hooks/modal.hook';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

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

const SSMLWithVars = React.forwardRef<TextEditorRef, SSMLWithVarsProps>(
  ({ icon = 'alexa', voice, autofocus, ...props }, ref) => {
    const variableCreateModal = useVariableCreateModal();
    const projectTypeConfig = useActiveProjectTypeConfig();

    const ssmlRef = React.useRef<TextEditorRef>(null);

    const locales = useSelector(VersionV2.active.localesSelector);
    const platform = useSelector(ProjectV2.active.platformSelector);
    const variables = useSelector(DiagramV2.active.allEntitiesAndVariablesSelector);
    const projectType = useSelector(ProjectV2.active.projectTypeSelector);
    const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

    const updateDefaultVoice = useDispatch(VersionV2.voice.updateDefaultVoice);

    const onAddVariable = React.useCallback(
      async (name: string) => {
        try {
          const variable = await variableCreateModal.open({ name, folderID: null });

          return { ...variable, isVariable: true };
        } catch {
          return null;
        }
      },
      [variableCreateModal.open]
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
  }
);

export default SSMLWithVars;
