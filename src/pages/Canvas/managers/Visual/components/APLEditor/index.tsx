import { APLStepData, APLType } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { ModalType } from '@/constants';
import * as APL from '@/ducks/apl';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { ConnectedProps } from '@/types';

import { Footer, JSONEditor, SplashEditor } from './components';
import { APL_OPTIONS } from './constants';

const APLEditor: React.FC<NodeEditorPropsType<APLStepData> & ConnectedAPLEditorProps> = ({ data, onChange, resolveAPL }) => {
  const { aplType, imageURL, title, document: documentData, aplCommands, jsonFileName, datasource } = data;

  const previewModal = useModals(ModalType.APL_PREVIEW);

  const canCreatePreview = (aplType === APLType.SPLASH && !!(title || imageURL)) || (aplType === APLType.JSON && !!jsonFileName);

  const openPreviewModal = async () => {
    const result = await resolveAPL(data);

    previewModal.open({ apl: result.apl, commands: result.commands, displayData: result.data });
  };

  const onChangeAPLType = (newAPLType: APLType) => {
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
          <RadioGroup options={APL_OPTIONS} checked={aplType} onChange={onChangeAPLType} disabled={!!jsonFileName && aplType === APLType.JSON} />
        </FormControl>
      </Section>

      {aplType === APLType.SPLASH && <SplashEditor title={title || ''} onChange={onChange} imageURL={imageURL || ''} />}

      {aplType === APLType.JSON && (
        <JSONEditor datasource={datasource} aplCommands={aplCommands} jsonFileName={jsonFileName || ''} onChange={onChange} document={documentData} />
      )}
    </Content>
  );
};

const mapDispatchToProps = {
  resolveAPL: APL.resolveAPL,
};

type ConnectedAPLEditorProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(APLEditor) as React.FC<NodeEditorPropsType<APLStepData>>;
