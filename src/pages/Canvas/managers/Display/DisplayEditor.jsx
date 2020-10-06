import React from 'react';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import client from '@/clientV2';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { DisplayType, ModalType } from '@/constants';
import { createDisplay, displayByIDSelector, duplicateDisplay, updateDisplayData } from '@/ducks/display';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature, useModals } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';

import { AdvancedEditor, AdvancedEditorV2, Footer, SplashEditor, SplashEditorV2 } from './components';
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

function DisplayEditor({ data, skillID, createDisplay, updateDisplayData, selected, onChange, duplicateDisplay }) {
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const { migrating, displayType, backgroundImage, splashHeader, displayID, document: documentData, aplCommands, jsonFileName, version } = data;

  const datasource = dataRefactor.isEnabled ? data.dataSource : data.datasource;

  const { open: openModal } = useModals(ModalType.DISPLAY_PREVIEW);
  const cache = React.useRef({ migrating, onChange, version });
  cache.current = { ...cache.current, version, migrating, onChange };

  // avoid preview for SPLASH when datarefactor enabled as we do not have document
  const canCreatePreview =
    (displayType === DisplayType.SPLASH && (!!splashHeader || backgroundImage)) || (displayType === DisplayType.ADVANCED && jsonFileName);

  const openPreviewModal = async () => {
    const apl = aplCommands || '';
    let data = datasource || '';
    let selectedDocument = !dataRefactor.isEnabled ? selected.document : documentData;

    if (dataRefactor.isEnabled && displayType === DisplayType.SPLASH) {
      ({ document: selectedDocument, datasource: data } = await client.alexaService.getDisplayWithDatasource(splashHeader, backgroundImage));
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
        let newDisplayType = displayType;

        // Only duplicate if the legacy display block is not empty
        if (!dataRefactor.isEnabled && displayID) {
          newDisplayID = await duplicateDisplay(displayID, skillID);
        }

        if (!dataRefactor.isEnabled) {
          newDisplayType = displayID ? DisplayType.ADVANCED : DisplayType.SPLASH;
        }

        cache.current.onChange({
          displayType: newDisplayType,
          displayID: newDisplayID,
          jsonFileName: dataRefactor.isEnabled ? jsonFileName : newDisplayID,
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

      {displayType === DisplayType.SPLASH && !dataRefactor.isEnabled && (
        <SplashEditor
          skillID={skillID}
          createDisplay={createDisplay}
          splashHeader={splashHeader}
          onChange={onChange}
          backgroundImage={backgroundImage}
          displayID={displayID}
          updateDisplay={updateDisplayData}
        />
      )}
      {displayType === DisplayType.SPLASH && dataRefactor.isEnabled && (
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
      {displayType === DisplayType.ADVANCED && !dataRefactor.isEnabled && (
        <AdvancedEditor
          display={selected}
          datasource={datasource}
          aplCommands={aplCommands}
          createDisplay={createDisplay}
          updateDisplay={updateDisplayData}
          displayID={displayID}
          skillID={skillID}
          jsonFileName={jsonFileName}
          onChange={onChange}
        />
      )}
      {displayType === DisplayType.ADVANCED && dataRefactor.isEnabled && (
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
  selected: displayByIDSelector,
};

const mapDispatchToProps = {
  createDisplay,
  duplicateDisplay,
  updateDisplayData,
};

const mergeProps = ({ selected: getDisplayByID }, _, { data }) => ({
  selected: data.displayID && getDisplayByID(data.displayID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DisplayEditor);
