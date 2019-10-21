import React from 'react';
import { Input, InputGroup } from 'reactstrap';

import Button from '@/componentsV2/Button';
import { FlexEnd } from '@/componentsV2/Flex';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { useManager } from '@/hooks';

import SpeakElement from './components/SpeakElement';

const MAX_DIALOGS = 50;

const speakFactory = (type) => ({
  type,
  open: true,
  ...(type === 'voice' ? { voice: 'Alexa', content: [] } : { url: '' }),
});

function SpeakEditor({ data, onChange }) {
  const toggleRandomized = () => onChange({ randomize: !data.randomize });
  const { items, onAdd, onReorder, mapManaged } = useManager(data.dialogs, (dialogs) => onChange({ dialogs }), { factory: speakFactory });

  return (
    <Content>
      {mapManaged((dialog, { key, index, onUpdate, onRemove, toggleOpen }) => (
        <SpeakElement
          dialog={dialog}
          block={data}
          index={index}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onToggle={toggleOpen}
          reorder={onReorder}
          key={key}
        />
      ))}
      {items.length < MAX_DIALOGS && (
        <Section>
          <FlexEnd>
            <Button className="mr-3" variant="secondary" icon="comment" onClick={() => onAdd('voice')}>
              Speech
            </Button>
            <Button variant="secondary" icon="volume" onClick={() => onAdd('audio')}>
              Audio
            </Button>
          </FlexEnd>
          <InputGroup className="my-3">
            <label className="input-group-text w-100 text-left">
              <Input addon type="checkbox" checked={!!data.randomize} onChange={toggleRandomized} />
              <span className="ml-3">Output Random Entry</span>
            </label>
          </InputGroup>
        </Section>
      )}
    </Content>
  );
}

export default SpeakEditor;
