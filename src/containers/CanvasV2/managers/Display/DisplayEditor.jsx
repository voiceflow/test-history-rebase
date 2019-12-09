import React from 'react';
import { Tooltip } from 'react-tippy';
import { InputGroup } from 'reactstrap';

import AceEditor from '@/components/AceEditor';
import Checkbox from '@/components/Checkbox';
import DisplaySelect from '@/components/DisplaySelect';
import Divider from '@/components/Divider';
import Button from '@/componentsV2/Button';
import { FlexApart } from '@/componentsV2/Flex';
import Link from '@/componentsV2/Link';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { withDisplayModalContext } from '@/containers/CanvasV2/contexts/DisplayModalContext';
import { allDisplaysSelector } from '@/ducks/display';
import { goToDisplays, goToNewDisplay } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { preventDefault } from '@/utils/dom';
import { compose } from '@/utils/functional';

function DisplayEditor({ data, onChange, displays, goToDisplays, goToNewDisplay, displayModal }) {
  const { setDisplayID, setDataSource, setAPLCommands, toggle } = displayModal;

  const getDatasource = React.useCallback((displayID) => displays.find((display) => display.id === displayID).datasource || null, [displays]);

  const updateDatasource = React.useCallback((datasource) => onChange({ datasource }), [onChange]);

  const updateDisplay = React.useCallback(
    (displayID) => {
      onChange({ displayID });
      updateDatasource(getDatasource(displayID));
    },
    [onChange, updateDatasource, getDatasource]
  );

  const updateAPLCommands = React.useCallback((aplCommands) => onChange({ aplCommands }), [onChange]);

  const toggleUpdateOnChange = React.useCallback(() => onChange({ updateOnChange: !data.updateOnChange }), [data.updateOnChange, onChange]);

  const showTestModal = () => {
    setDisplayID(data.displayID);
    setDataSource(data.datasource || '');
    setAPLCommands(data.aplCommands || '');
    toggle();
  };

  if (displays.length === 0) {
    return (
      <Section>
        <div className="text-center">
          <img className="mb-4" src="/desktop.svg" alt="user" width="64" />
          <br />
          <label className="dark">No Displays Exist</label>
          <div className="text-muted">You currently have no Multimodal Displays</div>
          <button className="btn btn-secondary mt-4" onClick={goToNewDisplay}>
            Add Displays
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Content>
      <Section>
        <FlexApart>
          <label className="mb-0">Multimodal Display</label>
          <Link href="" onClick={preventDefault(goToDisplays)}>
            See all
          </Link>
        </FlexApart>
        <DisplaySelect value={data.displayID} onChange={updateDisplay} />

        {data.displayID ? (
          <>
            <InputGroup className="mb-0 mt-1">
              <label className="input-group-text w-100 m-0 d-flex">
                <Checkbox checked={data.updateOnChange} onChange={toggleUpdateOnChange} />

                <div className="space-between flex-hard">
                  <span>Update on Variable Changes</span>
                  <span>
                    <Tooltip
                      className="menu-tip"
                      title="When this option is checked, the multimodal display will update whenever a change is detected in any of the variables used in the Data Source JSON"
                      position="bottom"
                      theme="block"
                    >
                      ?
                    </Tooltip>
                  </span>
                </div>
              </label>
            </InputGroup>
            <div>
              <Divider />
              <Button className="mb-2" variant="secondary" icon="powerOff" onClick={showTestModal} fullWidth>
                Test Display
              </Button>
              <label>Data Source JSON</label>
              <AceEditor
                name="datasource_editor"
                mode="json_custom"
                onChange={updateDatasource}
                fontSize={14}
                showPrintMargin={false}
                showGutter
                highlightActiveLine
                value={data.datasource || ''}
                editorProps={{
                  $blockScrolling: true,
                  $rules: {
                    start: [
                      {
                        token: 'highlightWords',
                        regex: 'word1|word2|word3|phrase one|phrase number two|etc',
                      },
                    ],
                  },
                }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                  useWorker: false,
                }}
              />
              <label className="mt-2">APL Commands</label>
              <AceEditor
                name="apl_commands_editor"
                mode="json_custom"
                onChange={updateAPLCommands}
                fontSize={14}
                showPrintMargin={false}
                showGutter
                highlightActiveLine
                value={data.aplCommands || ''}
                editorProps={{
                  $blockScrolling: true,
                  $rules: {
                    start: [
                      {
                        token: 'highlightWords',
                        regex: 'word1|word2|word3|phrase one|phrase number two|etc',
                      },
                    ],
                  },
                }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                  useWorker: false,
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Divider>or</Divider>

            <button className="btn-clear btn-block btn-lg" onClick={goToNewDisplay}>
              Create new visual
            </button>
          </>
        )}
      </Section>
    </Content>
  );
}

const mapStateToProps = {
  displays: allDisplaysSelector,
  skillID: activeSkillIDSelector,
};

const mapDispatchToProps = {
  goToDisplays,
  goToNewDisplay,
};

const mergeProps = ({ skillID }, { goToDisplays, goToNewDisplay }) => ({
  goToDisplays: () => goToDisplays(skillID),
  goToNewDisplay: () => goToNewDisplay(skillID),
});

export default compose(
  withDisplayModalContext,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(DisplayEditor);
