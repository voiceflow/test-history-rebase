import React from 'react';

import AceEditor from '@/components/AceEditor';
import { styled } from '@/hocs';
import { useManager } from '@/hooks';

import MetaDataLineItem from '../components/MetaDataLineItem';
import PrefixVariableInput from '../components/PrefixVariableInput';
import StepContainer from '../components/StepContainer';
import StepContentContainer from '../components/StepContentContainer';

const BodyTabs = {
  FORM_DATA: 'formData',
  FORM_URL_ENCODED: 'urlEncoded',
  RAW_INPUT: 'rawInput',
};

const BodyDataTypeContainer = styled.div`
  margin-top: 14px;
`;

const BodyDataTypeOption = styled.div`
  display: inline-flex;
  cursor: pointer;
  font-size: 13px;
  margin-right: 16px;
  font-weight: 600;
  color: #62778c;
  align-items: center;

  input {
    margin: 0 4px;
    margin-right: 8px;
  }

  label {
    margin: 0;
  }
`;

const ACE_EDITOR_OPTIONS = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
  useWorker: false,
};

function RequestBody({ data, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(data.body, (body) => onChange({ body }), { factory });
  const { bodyInputType } = data;

  const setBodyDataType = (type) => onChange({ bodyInputType: type });

  return (
    <StepContainer>
      <StepContentContainer>
        <BodyDataTypeContainer>
          <BodyDataTypeOption>
            <input
              id="formData"
              type="radio"
              value="formData"
              checked={data.bodyInputType === BodyTabs.FORM_DATA}
              onChange={() => setBodyDataType(BodyTabs.FORM_DATA)}
            />
            <label htmlFor="formData">Form Data</label>
          </BodyDataTypeOption>
          <BodyDataTypeOption>
            <input
              id="urlEncoded"
              type="radio"
              value="urlEncoded"
              checked={data.bodyInputType === BodyTabs.FORM_URL_ENCODED}
              onChange={() => setBodyDataType(BodyTabs.FORM_URL_ENCODED)}
            />
            <label htmlFor="urlEncoded">URL Encoded</label>
          </BodyDataTypeOption>
          <BodyDataTypeOption>
            <input
              id="rawInput"
              type="radio"
              value="rawInput"
              checked={data.bodyInputType === BodyTabs.RAW_INPUT}
              onChange={() => setBodyDataType(BodyTabs.RAW_INPUT)}
            />
            <label htmlFor="rawInput">Raw</label>
          </BodyDataTypeOption>
        </BodyDataTypeContainer>
        {(bodyInputType === 'formData' || bodyInputType === 'urlEncoded') &&
          mapManaged((obj, { key, index, onRemove, onUpdate }) => (
            <MetaDataLineItem
              prefix="KEY"
              firstItem={index === 0}
              onlyItem={items.length === 1}
              keyPlaceholder="Enter Key"
              onRemove={onRemove}
              onAdd={onAdd}
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
        {data.bodyInputType && data.bodyInputType === 'rawInput' && (
          <AceEditor
            placeholder="Enter Body Content"
            value={data.content}
            onChange={(newValue) => onChange({ content: newValue })}
            name="code"
            className="mt-3"
            mode="javascript"
            fontSize={14}
            showPrintMargin={false}
            showGutter
            highlightActiveLine
            editorProps={{ $blockScrolling: true }}
            setOptions={ACE_EDITOR_OPTIONS}
          />
        )}
      </StepContentContainer>
    </StepContainer>
  );
}

export default RequestBody;
