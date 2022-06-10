import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS_V2 } from '@/components/AceEditor';
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

function RequestBody({ body, content, bodyInputType, onChange, factory }) {
  const { onAdd, mapManaged } = useManager(body ?? [], (body) => onChange({ body }), { factory });

  const [aceContent, setAceContent] = React.useState(content);
  const setBodyDataType = (type) => onChange({ bodyInputType: type });

  React.useEffect(() => {
    setAceContent(content);
  }, [content]);

  const LineItemSection = bodyInputType !== BodyTabs.RAW_INPUT ? LineItemsSection : Section;

  let form = null;
  if (bodyInputType === 'formData' || bodyInputType === 'urlEncoded') {
    form = mapManaged((obj, { key, onRemove, onUpdate }) => (
      <MetaDataLineItem prefix="KEY" keyPlaceholder="Enter Key" onRemove={onRemove} onUpdate={(key) => onUpdate({ key })} value={obj.key} key={key}>
        <PrefixVariableInput
          placeholder="Enter value or {variable}"
          prefix="VALUE"
          value={obj.val}
          onChange={(newValue) => onUpdate({ val: newValue })}
        />
      </MetaDataLineItem>
    ));
  } else if (bodyInputType === 'rawInput') {
    form = (
      <AceEditor
        placeholder="Enter Body Content"
        value={aceContent}
        onChange={(newValue) => setAceContent(newValue)}
        onBlur={() => onChange({ content: aceContent })}
        mode="javascript"
        hasBorder
        setOptions={ACE_EDITOR_OPTIONS_V2}
      />
    );
  }

  return (
    <>
      <Section style={{ marginBottom: '-20px' }}>
        <RadioGroup options={BODY_OPTIONS} checked={bodyInputType} onChange={setBodyDataType} />
      </Section>

      <LineItemSection header={bodyInputType !== BodyTabs.RAW_INPUT ? 'Body Assignments' : null} onAdd={onAdd} dividers={false}>
        {form}
      </LineItemSection>
    </>
  );
}

export default RequestBody;
