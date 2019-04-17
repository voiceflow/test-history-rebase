import React, { Fragment } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { autoFocusCreator } from 'utils/forms';

import Input from '../Input';
import Button from '../Button';
import GroupFormInline from '../GroupFormInline';

export default function InputsList(props) {
  const {
    onAdd,
    onBlur,
    values,
    errors,
    loaders,
    valueKey,
    onChange,
    onRemove,
    children,
    minLength,
    maxLength,
    placeholder,
    placeholders,
    onEnterPress,
    withAddButton,
    inputMaxLength,
    secondRowRenderer,
    ...inputProps
  } = props;

  const autoFocus = autoFocusCreator(errors);

  const mappedValues = values.length > 0 ? values : [''];

  const actionsClassName = cn('__control-static', {
    '__type-action': !withAddButton,
    '__type-actions': withAddButton,
  });

  return mappedValues.map((value, i) => {
    const firstRow = (
      <GroupFormInline
        cols={[
          {
            content: children ? (
              children(value, i)
            ) : (
              <Input
                value={typeof value === 'object' ? value[valueKey] : value}
                error={errors[i]}
                onBlur={e => onBlur && onBlur(i, e)}
                loader={loaders && loaders[i]}
                readOnly={loaders && loaders[i]}
                onChange={({ target }) => onChange && onChange(i, target.value)}
                autoFocus={autoFocus(i)}
                maxLength={inputMaxLength}
                placeholder={placeholder || placeholders[i]}
                onEnterPress={e => onEnterPress && onEnterPress(i, e)}
                {...inputProps}
              />
            ),
            className: '__is-stretched',
          },
          {
            content: (
              <Fragment>
                <Button
                  icon="clear"
                  onClick={() => onRemove(i)}
                  disabled={mappedValues.length <= minLength}
                  className="btn-form-action"
                />

                {withAddButton && i === 0 && (
                  <Button
                    icon="add"
                    onClick={onAdd}
                    disabled={values.length >= maxLength}
                    className="btn-form-action"
                  />
                )}
              </Fragment>
            ),
            className: actionsClassName,
          },
        ]}
        className="__nowrap"
      />
    );

    return (
      <div key={i} className="form-group">
        {secondRowRenderer ? (
          <Fragment>
            <div className="form-group">{firstRow}</div>
            <div className="form-group">
              <GroupFormInline
                cols={[
                  { content: secondRowRenderer(value, i), className: '__is-stretched' },
                  { content: null, className: actionsClassName },
                ]}
                className="__nowrap"
              />
            </div>
          </Fragment>
        ) : (
          firstRow
        )}
      </div>
    );
  });
}

InputsList.propTypes = {
  onAdd: PropTypes.func,
  onBlur: PropTypes.func,
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  ),
  errors: PropTypes.arrayOf(PropTypes.string),
  loaders: PropTypes.arrayOf(PropTypes.bool),
  valueKey: PropTypes.string,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  children: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  onEnterPress: PropTypes.func,
  placeholders: PropTypes.arrayOf(PropTypes.string),
  withAddButton: PropTypes.bool,
  inputMaxLength: PropTypes.number,
  secondRowRenderer: PropTypes.func,
};

InputsList.defaultProps = {
  values: [''],
  errors: [],
  valueKey: 'value',
  minLength: 1,
  placeholders: [],
  withAddButton: true,
};
