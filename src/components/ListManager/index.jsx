import React from 'react';

import List from '@/components/List';
import { preventDefault, swallowKeyPress, withKeyPress } from '@/utils/dom';
import { identity } from '@/utils/functional';

import { ListManagerContainer, ListManagerDivider, ListManagerForm, ListManagerItem, PressEnterContainer, Validation } from './components';

export * from './components';

class ListManager extends React.Component {
  state = {
    formValue: '',
    isEditing: false,
  };

  componentWillUnmount() {
    this.addItem();
  }

  addItem = () => {
    const { validate } = this.props;
    const { formValue } = this.state;
    const trimmedValue = formValue && formValue.trim();

    if (trimmedValue && !validate?.(trimmedValue)) {
      this.props.onAdd(trimmedValue);
      this.setState({ formValue: '', isEditing: false });
    }
  };

  addOnEnter = withKeyPress(13, preventDefault(this.addItem));

  updateValidation = (formValue) => this.setState({ formValue, isEditing: true });

  onManagerItemKeyPress = swallowKeyPress(13);

  render() {
    const {
      placeholder,
      items,
      mapManaged,
      extractValue = identity,
      inputComponent: InputComponent,
      formComponent: FormComponent = ListManagerForm,
      validate,
      showHelpText,
      formComponentProps,
      inputComponentProps,
    } = this.props;
    const { formValue } = this.state;
    const showText = showHelpText && !items.length && this.state.isEditing && formValue;

    return (
      <ListManagerContainer>
        <Validation
          {...formComponentProps}
          validate={validate}
          component={FormComponent}
          value={formValue}
          onChange={this.updateValidation}
          placeholder={placeholder}
          onKeyPress={this.addOnEnter}
        />
        {showText && (
          <PressEnterContainer>
            <small className="text-muted">
              Press '<b>Enter</b>' to add
            </small>
          </PressEnterContainer>
        )}
        {!!items.length && (
          <>
            <ListManagerDivider />
            <List>
              {mapManaged((item, { key, onUpdate, onRemove }) => (
                // this is fine as long as items are immutable
                <ListManagerItem key={key}>
                  <div>
                    <Validation
                      {...inputComponentProps}
                      validate={validate}
                      component={InputComponent}
                      value={extractValue(item)}
                      onChange={onUpdate}
                      onKeyPress={this.onManagerItemKeyPress}
                    />
                  </div>
                  <i onClick={onRemove} className="fas fa-minus-circle trash-icon" />
                </ListManagerItem>
              ))}
            </List>
          </>
        )}
      </ListManagerContainer>
    );
  }
}

export default ListManager;
