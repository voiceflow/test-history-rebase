import React from 'react';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/componentsV2/Section';
import { DisplayType, MODALS } from '@/constants';
import { Content } from '@/containers/CanvasV2/components/Editor';
import { useModals } from '@/contexts/ModalsContext';
import { createDisplay, displayByIDSelector, duplicateDisplay, updateDisplayData } from '@/ducks/display';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

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

function DisplayEditor({ data, skillID, createDisplay, updateDisplayData, duplicateDisplay, selected, onChange }) {
  const { displayType, backgroundImage, splashHeader, displayID, datasource, aplCommands, jsonFileName } = data;
  const { open: openModal } = useModals(MODALS.DISPLAY_PREVIEW);
  const isLegacyConditional = !!displayID && !splashHeader && !backgroundImage && displayType === DisplayType.ADVANCED && !jsonFileName;
  const [isLegacyData, setIsLegacyData] = React.useState(isLegacyConditional);

  React.useEffect(() => {
    const handleLegacyMigration = async () => {
      if (isLegacyData) {
        const newDisplayID = await duplicateDisplay(displayID, skillID);

        onChange({ displayID: newDisplayID, jsonFileName: newDisplayID });
        setIsLegacyData(false);
      }
    };

    handleLegacyMigration();
  }, []);

  const canCreatePreview =
    (displayType === DisplayType.SPLASH && (!!splashHeader || backgroundImage)) || (displayType === DisplayType.ADVANCED && jsonFileName);

  const openPreviewModal = () => {
    const { document, datasource: displayDatasource } = selected;
    const apl = aplCommands || document;
    const data = datasource || displayDatasource;
    openModal({ apl, data });
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

  return (
    <Content footer={() => <Footer openPreviewModal={openPreviewModal} canRenderPreview={canCreatePreview} />}>
      <Section variant="tertiary" header="Display Type">
        <RadioGroup options={DISPLAY_OPTIONS} checked={displayType} onChange={changeDisplayType} />
      </Section>
      <Section isDividerNested>
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
      </Section>
    </Content>
  );
}
const mapStateToProps = {
  skillID: activeSkillIDSelector,
  selected: displayByIDSelector,
};

const mapDispatchToProps = {
  createDisplay,
  updateDisplayData,
  duplicateDisplay,
};

const mergeProps = ({ selected: getDisplayByID }, _, { data }) => ({
  selected: data.displayID && getDisplayByID(data.displayID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DisplayEditor);
