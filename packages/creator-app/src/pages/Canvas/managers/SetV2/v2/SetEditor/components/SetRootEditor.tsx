import { Button, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import HelpTooltip from '@/pages/Canvas/managers/SetV2/components/HelpTooltip';

import { SET_SECTION_ID } from '../constants';
import SetItem from './SetItem';

const SetRootEditor: React.FC = () => {
  // to do: remove it
  const [setList, updateSetList] = React.useState([1]);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <Button variant={Button.Variant.PRIMARY} onClick={() => updateSetList([...setList, setList.length + 1])} squareRadius>
            Add Set
          </Button>
        </EditorV2.DefaultFooter>
      }
    >
      <EditorV2.PersistCollapse namespace={['SetSection', SET_SECTION_ID]} defaultCollapsed={false}>
        {({ collapsed }) => (
          <SectionV2.Sticky disabled={collapsed}>
            {() => (
              <>
                <SectionV2.SimpleSection>
                  <Input placeholder="Enter set label" />
                </SectionV2.SimpleSection>
                <SectionV2.Divider />
              </>
            )}
          </SectionV2.Sticky>
        )}
      </EditorV2.PersistCollapse>
      {setList.map((id) => (
        <>
          <SetItem key={id} id={id} />
          <SectionV2.Divider />
        </>
      ))}
    </EditorV2>
  );
};

export default SetRootEditor;
