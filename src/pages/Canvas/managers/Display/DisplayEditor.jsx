import React from 'react';

import client from '@/client';
import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { DisplayType, ModalType } from '@/constants';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';

import { AdvancedEditor, Footer, SplashEditor } from './components';

const DISPLAY_OPTIONS = [
  {
    id: DisplayType.SPLASH,
    label: 'Splash',
  },
  {
    id: DisplayType.ADVANCED,
    label: 'Advanced',
  },
];

function DisplayEditor({ data, skillID, onChange }) {
  const { migrating, displayType, backgroundImage, splashHeader, document: documentData, aplCommands, jsonFileName } = data;

  const datasource = data.dataSource;

  const { open: openModal } = useModals(ModalType.DISPLAY_PREVIEW);
  const cache = React.useRef({ migrating, onChange });
  cache.current = { ...cache.current, migrating, onChange };

  // avoid preview for SPLASH when datarefactor enabled as we do not have document
  const canCreatePreview =
    (displayType === DisplayType.SPLASH && (!!splashHeader || backgroundImage)) || (displayType === DisplayType.ADVANCED && jsonFileName);

  const openPreviewModal = async () => {
    const apl = aplCommands || '';
    let data = datasource || '';
    let selectedDocument = documentData;

    if (displayType === DisplayType.SPLASH) {
      ({ document: selectedDocument, datasource: data } = await client.platform.alexa.handlers.getDisplayWithDatasource(
        splashHeader,
        backgroundImage
      ));
    }

    openModal({ apl, data, documentData: selectedDocument });
  };

  const changeDisplayType = (type) => {
    const resetDataObject = {
      displayType: type,
      splashHeader: textEditorContentAdapter.fromDB(null),
      datasource: null,
      document: null,
      backgroundImage: null,
      jsonFileName: null,
    };
    onChange(resetDataObject);
  };

  return (
    <Content footer={() => <Footer openPreviewModal={openPreviewModal} canRenderPreview={canCreatePreview} />}>
      <Section>
        <FormControl label="Display Type" contentBottomUnits={0}>
          <RadioGroup
            options={DISPLAY_OPTIONS}
            checked={displayType}
            onChange={changeDisplayType}
            disabled={!!jsonFileName && displayType === DisplayType.ADVANCED}
          />
        </FormControl>
      </Section>

      {displayType === DisplayType.SPLASH && (
        <SplashEditor skillID={skillID} splashHeader={splashHeader} onChange={onChange} backgroundImage={backgroundImage} />
      )}
      {displayType === DisplayType.ADVANCED && (
        <AdvancedEditor datasource={datasource} aplCommands={aplCommands} jsonFileName={jsonFileName} onChange={onChange} document={documentData} />
      )}
    </Content>
  );
}
const mapStateToProps = {
  skillID: activeSkillIDSelector,
};

export default connect(mapStateToProps)(DisplayEditor);
