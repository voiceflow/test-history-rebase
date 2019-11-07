import { constants } from '@voiceflow/common';
import React from 'react';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import Select from '@/components/Select';
import AudioDrop from '@/components/Uploads/AudioDrop';
import VariableText from '@/components/VariableText';
import { FlexApart } from '@/componentsV2/Flex';
import { AUDIO_FILE_BUCKET_NAME, DialogType } from '@/constants';
import { addRecentVoice, recentVoicesSelector } from '@/ducks/recent';
import { connect } from '@/hocs';
import { compose } from '@/utils/functional';

import withDrag from '../drag';
import AudioTitleContainer from './AudioTitleContainer';
import Container from './SpeakElementContainer';
import Header from './SpeakElementHeader';
import Tip from './SpeakElementTip';
import Toggle from './SpeakElementToggle';

const VOICES = constants.voices;

const SpeakElement = ({ dialog, index, block, onRemove, onUpdate, onToggle, recentVoices, addRecentVoice }) => {
  const isAudio = dialog.type === DialogType.AUDIO;
  const options = recentVoices.length ? [{ label: 'Recent', options: recentVoices }, ...VOICES] : VOICES;

  const updateContent = React.useCallback((content) => onUpdate({ content }), [onUpdate]);
  const updateAudio = React.useCallback((url) => onUpdate({ url }), [onUpdate]);
  const updateVoice = React.useCallback(
    (selected) => {
      onUpdate({ voice: selected.value });
      addRecentVoice(selected);
    },
    [onUpdate, addRecentVoice]
  );

  const toggle = <Toggle isOpen={dialog.open} randomize={block.randomize} index={index} />;

  let component = (
    <>
      <Header>
        <div onClick={onToggle}>
          {toggle}
          Speaking as
        </div>
        <Select className="speak-box" value={{ label: dialog.voice, value: dialog.voice }} onChange={updateVoice} options={options} fullWidth />
        <Button isClose onClick={onRemove} />
      </Header>

      <Collapse isOpen={dialog.open}>
        <VariableText
          className="editor form-control auto-height"
          value={dialog.content}
          placeholder={`Tell ${dialog.voice} what to say`}
          onChange={updateContent}
          disableDrop
        />
        <Tip className="text-muted">{'Press "{" to add variables'}</Tip>
      </Collapse>
    </>
  );

  if (isAudio) {
    const isUploadedFile = dialog.url.includes(AUDIO_FILE_BUCKET_NAME);
    let fileName = '';
    if (isUploadedFile) {
      fileName = dialog.url
        .split('/')
        .pop()
        .split('-')
        .pop();
    }
    const title = isUploadedFile ? fileName : dialog.url;

    component = (
      <>
        <FlexApart>
          <Header>
            {toggle}
            <AudioTitleContainer onClick={onToggle}>Audio: {title}</AudioTitleContainer>
            <Button isClose onClick={onRemove} />
          </Header>
        </FlexApart>
        <div>
          <Collapse isOpen={dialog.open} className="speak-audio">
            <AudioDrop audio={dialog.url} update={updateAudio} />
          </Collapse>
        </div>
      </>
    );
  }

  return <Container>{component}</Container>;
};

const mapStateToProps = {
  recentVoices: recentVoicesSelector,
};

const mapDispatchToProps = {
  addRecentVoice,
};

export default compose(
  withDrag('speak'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SpeakElement);
