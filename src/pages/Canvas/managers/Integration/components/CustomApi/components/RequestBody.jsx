import React from 'react';

import AceEditor from '@/components/AceEditor';
import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { useManager } from '@/hooks';

import MetaDataLineItem from '../../MetaDataLineItem';
import PrefixVariableInput from '../../PrefixVariableInput';
import LineItemsSection from './LineItemsSection';

const BodyTabs = {
  FORM_DATA: 'formData',
  FORM_URL_ENCODED: 'urlEncoded',
  RAW_INPUT: 'rawInput',
};

const BODY_OPTIONS = [
  {
    id: BodyTabs.FORM_DATA,
    label: 'Form Data',
  },
  {
    id: BodyTabs.FORM_URL_ENCODED,
    label: 'URL Encoded',
  },
  {
    id: BodyTabs.RAW_INPUT,
    label: 'Raw',
  },
];

const ACE_EDITOR_OPTIONS = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
  useWorker: false,
};

function RequestBody({ body, content, bodyInputType, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(body, (body) => onChange({ body }), { factory });

  const [aceContent, setAceContent] = React.useState(content);
  const setBodyDataType = (type) => onChange({ bodyInputType: type });

  React.useEffect(() => {
    setAceContent(content);
  }, [content]);

  const LineItemSection = bodyInputType !== BodyTabs.RAW_INPUT ? LineItemsSection : Section;

  return (
    <>
      <Section style={{ marginBottom: '-20px' }}>
        <RadioGroup options={BODY_OPTIONS} checked={bodyInputType} onChange={setBodyDataType} />
      </Section>

      <LineItemSection header={bodyInputType !== BodyTabs.RAW_INPUT ? 'Body Assignments' : null} onAdd={onAdd} dividers={false}>
        {(bodyInputType === 'formData' || bodyInputType === 'urlEncoded') &&
          mapManaged((obj, { key, onRemove, onUpdate }) => (
            <MetaDataLineItem
              prefix="KEY"
              onlyItem={items.length === 1}
              keyPlaceholder="Enter Key"
              onRemove={onRemove}
              onUpdate={(key) => onUpdate({ key })}
              value={obj.key}
              key={key}
            >
              <PrefixVariableInput
                placeholder="Enter value or {variable}"
                prefix="VALUE"
                value={obj.val}
                onChange={(newValue) => onUpdate({ val: newValue })}
              />
            </MetaDataLineItem>
          ))}

        {bodyInputType && bodyInputType === 'rawInput' && (
          <AceEditor
            placeholder="Enter Body Content"
            value={aceContent}
            onChange={(newValue) => setAceContent(newValue)}
            onBlur={() => onChange({ content: aceContent })}
            name="code"
            mode="javascript"
            setOptions={ACE_EDITOR_OPTIONS}
          />
        )}
      </LineItemSection>
    </>
  );
}

export default RequestBody;
