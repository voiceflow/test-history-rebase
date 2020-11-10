import React from 'react';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import alexaService from '@/clientV2/platformServices/alexa/handlers';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { DisplayType, ModalType } from '@/constants';
import { createDisplay, updateDisplayData } from '@/ducks/display';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';

import { AdvancedEditorV2, Footer, SplashEditorV2 } from './components';
import { VERSIONS } from './constants';

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

function DisplayEditor({ data, skillID, createDisplay, updateDisplayData, onChange }) {
  const { migrating, displayType, backgroundImage, splashHeader, displayID, document: documentData, aplCommands, jsonFileName, version } = data;

  const datasource = data.dataSource;

  const { open: openModal } = useModals(ModalType.DISPLAY_PREVIEW);
  const cache = React.useRef({ migrating, onChange, version });
  cache.current = { ...cache.current, version, migrating, onChange };

  // avoid preview for SPLASH when datarefactor enabled as we do not have document
  const canCreatePreview =
    (displayType === DisplayType.SPLASH && (!!splashHeader || backgroundImage)) || (displayType === DisplayType.ADVANCED && jsonFileName);

  const openPreviewModal = async () => {
    const apl = aplCommands || '';
    let data = datasource || '';
    let selectedDocument = documentData;

    if (displayType === DisplayType.SPLASH) {
      ({ document: selectedDocument, datasource: data } = await alexaService.getDisplayWithDatasource(splashHeader, backgroundImage));
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

  React.useEffect(() => {
    const handleLegacyMigration = async () => {
      if (!cache.current.version && !cache.current.migrating) {
        cache.current.onChange({ migrating: true });

        let newDisplayID;
        const newDisplayType = displayType;

        cache.current.onChange({
          displayType: newDisplayType,
          displayID: newDisplayID,
          jsonFileName,
          version: VERSIONS.EDITORS_REDESIGN,
        });
      }
    };

    // There is a global issue where on first edit sidebar render, it will render twice and cause a double duplication of the display
    // this is a hacky fix but ensures we dont cause redudant display duplications in the db
    // We can remove this after evgeny's double onmount fix goes out today
    const timeout = setTimeout(handleLegacyMigration, 50);

    return () => clearTimeout(timeout);
  }, []);

  return !version ? null : (
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
        <SplashEditorV2
          skillID={skillID}
          createDisplay={createDisplay}
          splashHeader={splashHeader}
          onChange={onChange}
          backgroundImage={backgroundImage}
          displayID={displayID}
          updateDisplay={updateDisplayData}
        />
      )}
      {displayType === DisplayType.ADVANCED && (
        <AdvancedEditorV2
          datasource={datasource}
          aplCommands={aplCommands}
          createDisplay={createDisplay}
          updateDisplay={updateDisplayData}
          jsonFileName={jsonFileName}
          onChange={onChange}
          document={documentData}
        />
      )}
    </Content>
  );
}
const mapStateToProps = {
  skillID: activeSkillIDSelector,
};

const mapDispatchToProps = {
  createDisplay,
  updateDisplayData,
};

const mergeProps = ({ selected: getDisplayByID }, _, { data }) => ({
  selected: data.displayID && getDisplayByID(data.displayID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DisplayEditor);
