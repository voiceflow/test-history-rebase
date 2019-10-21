import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import { ListManagerContainer } from '@/components/ListManager';
import SlotSelect from '@/components/SlotSelect';
import Flex, { FlexApart } from '@/componentsV2/Flex';
import { PlatformType } from '@/constants';
import { setError } from '@/ducks/modal';
import { isLiveSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { preventDefault, swallowKeyPress } from '@/utils/dom';

import SlotSynonymManager from './SlotSynonymManager';

const BLANK_SPACE_PATTERN = /\s/g;
const LOWERCASE_ALPHA_PATTERN = /^[_a-z]+$/;

const isSlotDisabled = (slotType, platform) =>
  (/AMAZON/.test(slotType) && platform !== PlatformType.ALEXA) || (/^@sys\./.test(slotType) && platform !== PlatformType.GOOGLE);

class SlotInput extends React.PureComponent {
  state = {
    text: '',
    text_error: null,
    name: this.props.value?.name || '',
    nameError: null,
  };

  toggleCollapse = () => this.props.onUpdate({ open: !this.props.value.open });

  onChangeName = ({ target }) => {
    const input = target.value.toLowerCase().replace(BLANK_SPACE_PATTERN, '_');

    let nameError;
    if (!LOWERCASE_ALPHA_PATTERN.test(input) && input.length > 0) {
      nameError = 'Slot names can only contain lowercase letters and underscores';
    } else {
      nameError = null;
    }

    this.setState({
      name: input,
      nameError,
    });
  };

  onSaveName = preventDefault(() => {
    const { value, onUpdate, setError, nameExists } = this.props;
    const trimmedName = this.state.name.trim();

    if (!trimmedName || trimmedName === value.name) {
      // do nothing
    } else if (this.state.nameError) {
      setError(this.state.nameError);
      this.setState({ nameError: null });
    } else if (nameExists(this.state.name)) {
      // save name with error callback
      setError('A slot already exists with this name');
      this.setState({ name: value?.name || '' });
    } else {
      onUpdate({ name: trimmedName });
    }
  });

  render() {
    // TODO:
    const { value, platform, onRemove, onUpdate, isLive } = this.props;
    const { name, nameError } = this.state;
    const disabled = value.selected && isSlotDisabled(value.selected.value, platform);

    const updateSelected = (selected) => onUpdate({ selected });
    const updateInputs = (inputs) => onUpdate({ inputs });

    return (
      <>
        <FlexApart>
          <Flex>
            <span className="collapse-indicator" onClick={this.toggleCollapse}>
              <i className={cn('fas', 'fa-caret-right', 'rotate', { 'fa-rotate-90': value.open })} />
            </span>
            <Tooltip className="flex-hard" theme="warning" arrow position="bottom-start" open={!!nameError} distance={5} html={nameError}>
              <input
                placeholder="Enter Slot Name"
                type="text"
                value={name}
                onChange={this.onChangeName}
                onBlur={this.onSaveName}
                onKeyPress={swallowKeyPress(13)}
                className="interaction-name-input name-input"
              />
            </Tooltip>
          </Flex>
          <Button isClose onClick={onRemove} disabled={isLive} />
        </FlexApart>
        <Collapse isOpen={value.open}>
          {disabled && (
            <div className="unavailable-input text-muted">
              <div>
                <i className="fas fa-frown" />
              </div>
              This Slot Type is Unavailable on {platform === PlatformType.GOOGLE ? 'Google Assistant' : 'Alexa'}
            </div>
          )}
          <ListManagerContainer className={cn({ faded: disabled })}>
            <SlotSelect value={value.selected} onChange={updateSelected} fullWidth />
            <SlotSynonymManager items={value.inputs} onChange={updateInputs} />
          </ListManagerContainer>
        </Collapse>
      </>
    );
  }
}

const mapStateToProps = {
  isLive: isLiveSelector,
};

const mapDispatchToProps = {
  setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotInput);
