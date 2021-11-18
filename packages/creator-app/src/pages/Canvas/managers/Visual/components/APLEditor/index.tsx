import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { ModalType } from '@/constants';
import * as APL from '@/ducks/apl';
import { useDispatch, useModals } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { Footer, JSONEditor, SplashEditor } from './components';
import { APL_OPTIONS } from './constants';

const APLEditor: NodeEditor<Node.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ data, onChange }) => {
  const resolveAPL = useDispatch(APL.resolveAPL);

  const previewModal = useModals(ModalType.APL_PREVIEW);

  const { aplType, imageURL, title, document: documentData, aplCommands, jsonFileName, datasource } = data;

  const canCreatePreview =
    (aplType === Node.Visual.APLType.SPLASH && !!(title || imageURL)) || (aplType === Node.Visual.APLType.JSON && !!jsonFileName);

  const openPreviewModal = async () => {
    const result = await resolveAPL(data);

    previewModal.open({ apl: result.apl, commands: result.commands, displayData: result.data });
  };

  const onChangeAPLType = (newAPLType: Node.Visual.APLType) => {
    onChange({
      aplType: newAPLType,
      title: '',
      imageURL: '',
      document: '',
      datasource: '',
      aplCommands: '',
      jsonFileName: '',
    });
  };

  return (
    <Content footer={() => <Footer openPreviewModal={openPreviewModal} canRenderPreview={canCreatePreview} />}>
      <Section>
        <FormControl label="Display Type" contentBottomUnits={0}>
          <RadioGroup
            options={APL_OPTIONS}
            checked={aplType}
            onChange={onChangeAPLType}
            disabled={!!jsonFileName && aplType === Node.Visual.APLType.JSON}
          />
        </FormControl>
      </Section>

      {aplType === Node.Visual.APLType.SPLASH && <SplashEditor title={title || ''} onChange={onChange} imageURL={imageURL || ''} />}

      {aplType === Node.Visual.APLType.JSON && (
        <JSONEditor datasource={datasource} aplCommands={aplCommands} jsonFileName={jsonFileName || ''} onChange={onChange} document={documentData} />
      )}
    </Content>
  );
};

export default APLEditor;
