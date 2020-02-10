import React from 'react';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { createDisplay, displayByIDSelector, duplicateDisplay, updateDisplayData } from '@/ducks/display';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { Content } from '@/pages/Canvas/components/Editor';

import { AdvancedEditor, Footer, SplashEditor } from './components';
import { DisplayType, VERSIONS } from './constants';

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
  const { migrating, displayType, backgroundImage, splashHeader, displayID, datasource, aplCommands, jsonFileName, version } = data;
  const { open: openModal } = useModals(MODALS.DISPLAY_PREVIEW);
  const cache = React.useRef({ migrating, onChange, version });
  cache.current = { ...cache.current, version, migrating, onChange };

  const canCreatePreview =
    (displayType === DisplayType.SPLASH && (!!splashHeader || backgroundImage)) || (displayType === DisplayType.ADVANCED && jsonFileName);

  const openPreviewModal = async () => {
    const { document } = selected;
    const apl = aplCommands || '';
    const data = datasource || '';
    const documentData = document;

    openModal({ apl, data, documentData });
  };

  const changeDisplayType = (type) => {
    const resetDataObject = {
      displayType: type,
      splashHeader: textEditorContentAdapter.fromDB(null),
      datasource: null,
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

        // Only duplicate if the legacy display block is not empty
        if (displayID) {
          newDisplayID = await duplicateDisplay(displayID, skillID);
        }

        cache.current.onChange({
          displayType: displayID ? DisplayType.ADVANCED : DisplayType.SPLASH,
          displayID: newDisplayID,
          jsonFileName: newDisplayID,
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
      <Section variant="tertiary" header="Display Type">
        <RadioGroup options={DISPLAY_OPTIONS} checked={displayType} onChange={changeDisplayType} disabled={!!jsonFileName} />
      </Section>
      {displayType === DisplayType.SPLASH ? (
        <SplashEditor
          skillID={skillID}
          createDisplay={createDisplay}
          splashHeader={splashHeader}
          onChange={onChange}
          backgroundImage={backgroundImage}
          displayID={displayID}
          updateDisplay={updateDisplayData}
        />
      ) : (
        <AdvancedEditor
          datasourceJSON={datasource}
          aplCommands={aplCommands}
          createDisplay={createDisplay}
          updateDisplay={updateDisplayData}
          displayID={displayID}
          skillID={skillID}
          jsonFileName={jsonFileName}
          onChange={onChange}
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
