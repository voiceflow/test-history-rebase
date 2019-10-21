import './DisplayEditor.css';

import React from 'react';
import { Tooltip } from 'react-tippy';
import { Input, InputGroup } from 'reactstrap';

import AceEditor from '@/components/AceEditor';
import DisplaySelect from '@/components/DisplaySelect';
import Divider from '@/components/Divider';
import Button from '@/componentsV2/Button';
import { FlexApart } from '@/componentsV2/Flex';
import Link from '@/componentsV2/Link';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { withDisplayModalContext } from '@/containers/CanvasV2/contexts/DisplayModalContext';
import { allDisplaysSelector } from '@/ducks/display';
import { goToDisplays } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { preventDefault } from '@/utils/dom';
import { compose } from '@/utils/functional';

function DisplayEditor({ data, onChange, displays, goToDisplays, displayModal }) {
  const { setDisplayID, setDataSource, setAPLCommands, toggle } = displayModal;
  if (displays.length === 0) {
    return (
      <Section>
        <div className="text-center">
          <img className="mb-4" src="/desktop.svg" alt="user" width="64" />
          <br />
          <label className="dark">No Displays Exist</label>
          <div className="text-muted">You currently have no Multimodal Displays</div>
          <button className="btn btn-secondary mt-4" onClick={goToDisplays}>
            Add Displays
          </button>
        </div>
      </Section>
    );
  }

  const getDatasource = (displayID) => {
    return displays.find((display) => display.id === displayID).datasource || null;
  };

  const updateDatasource = (datasource) => {
    onChange({ datasource });
  };
  const updateDisplay = (displayID) => {
    onChange({ displayID });
    updateDatasource(getDatasource(displayID));
  };
  const updateAPLCommands = (aplCommands) => {
    onChange({ aplCommands });
  };

  const toggleUpdateOnChange = () => onChange({ updateOnChange: !data.updateOnChange });

  const showTestModal = () => {
    setDisplayID(data.displayID);
    setDataSource(data.datasource || '');
    setAPLCommands(data.aplCommands || '');
    toggle();
  };

  return (
    <Content>
      <Section>
        <FlexApart>
          <label className="mb-0">Multimodal Display</label>
          <Link href="" onClick={preventDefault(() => goToDisplays())}>
            See all
          </Link>
        </FlexApart>
        <DisplaySelect value={data.displayID} onChange={updateDisplay} />

        {data.displayID ? (
          <>
            <InputGroup className="mb-0 mt-1">
              <label className="input-group-text w-100 m-0 d-flex">
                <Input addon type="checkbox" checked={data.updateOnChange} onChange={toggleUpdateOnChange} />

                <div className="ml-2 space-between flex-hard">
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
                theme="monokai"
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
                theme="monokai"
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

            <button className="btn-clear btn-block btn-lg" onClick={goToDisplays}>
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
};

const mergeProps = ({ skillID }, { goToDisplays }) => ({
  goToDisplays: () => goToDisplays(skillID),
});

export default compose(
  withDisplayModalContext,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(DisplayEditor);
