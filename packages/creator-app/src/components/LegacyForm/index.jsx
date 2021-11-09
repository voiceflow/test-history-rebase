import { Utils } from '@voiceflow/common';
import cn from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import transform from 'lodash/transform';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { IS_DEVELOPMENT } from '@/config';
import { autoFocusCreator, getTransform } from '@/utils/forms';

import { PropsBridgeUpdater } from '../PropsBridge';

export default class Form extends Component {
  static propTypes = {
    id: PropTypes.string,
    onRef: PropTypes.func,
    onBlur: PropTypes.func,
    validateOnMount: PropTypes.bool,
    scheme: PropTypes.object,
    children: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onLayout: PropTypes.func,
    className: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    transforms: PropTypes.object,
    initialValues: PropTypes.object,
    resetToInitialFields: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    component: 'div',
    transforms: {},
    initialValues: {},
  };

  static getDiff(object, base) {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = value;
      }
    });
  }

  static getIn(...opts) {
    return Utils.object.getIn(...opts);
  }

  static setIn(...opts) {
    return Utils.object.setIn(...opts);
  }

  static isEmpty(object) {
    return isEmpty(object);
  }

  static getLabelById(array, findById) {
    const item = array.find(({ id }) => id === findById);

    return item ? item.label : null;
  }

  static async validateYupSchemeField(scheme, field, values, errors = {}) {
    const res = {
      errors,
      isValid: true,
    };

    try {
      await scheme.validateAt(field, values);

      res.errors = Utils.object.setIn(res.errors, field, null);
    } catch ({ path, inner, message }) {
      res.isValid = !(path || inner);

      if (!inner || inner.length === 0) {
        res.errors = Utils.object.setIn(res.errors, path, message);
      } else {
        inner.forEach((err) => {
          if (!Utils.object.getIn(res.errors, err.path)) {
            res.errors = Utils.object.setIn(res.errors, err.path, err.message);
          }
        });
      }
    }

    return res;
  }

  static async validateYupScheme(scheme, values) {
    let isValid = true;
    let errors = {};

    for (let i = 0; i < scheme._nodes.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const res = await Form.validateYupSchemeField(scheme, scheme._nodes[i], values, errors);

      isValid = isValid && res.isValid;
      ({ errors } = res);
    }

    return {
      errors,
      isValid,
    };
  }

  state = {
    errors: {},
    values: { ...this.props.initialValues },
    isValid: true,
    submitCount: 0,
    isSubmitting: false,
    validationsInProgress: {},
  };

  _callBlurAfterChange = false;

  componentDidMount() {
    const { onLayout, validateOnMount } = this.props;

    validateOnMount && this.validateAllFields();
    onLayout && onLayout();
  }

  componentDidUpdate() {
    const { onLayout } = this.props;

    onLayout && onLayout();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  onChange = (field, value) => {
    const { onChange } = this.props;

    this.setState(
      ({ values }) => ({ values: Utils.object.setIn(values, field, value) }),
      () => {
        if (this._callBlurAfterChange) {
          this.onBlur(field);

          this._callBlurAfterChange = false;
        }

        onChange && onChange(field, value, this.state);
      }
    );
  };

  onBlur = async (field) => {
    let { values, errors, isValid } = this.state;
    const { validationsInProgress } = this.state;
    const { scheme, onBlur, transforms, initialValues, resetToInitialFields } = this.props;

    const transform = getTransform(transforms, field);
    let _value = Utils.object.getIn(values, field);

    if (typeof transform === 'function') {
      _value = transform(_value, { values, errors });
      values = Utils.object.setIn(values, field, _value);
    }

    if (resetToInitialFields && !_value && resetToInitialFields.includes(field)) {
      _value = Utils.object.getIn(initialValues, field);
      values = Utils.object.setIn(values, field, _value);
    }

    if (scheme) {
      this.setState({ validationsInProgress: { ...validationsInProgress, [field]: true } });

      const res = await Form.validateYupSchemeField(scheme, field, values, errors);

      errors = res.errors;
      isValid = isValid && res.isValid;
    }

    this.setState(
      {
        values,
        errors,
        isValid,
        validationsInProgress: { ...validationsInProgress, [field]: false },
      },
      onBlur ? () => onBlur(field, this.state) : undefined
    );
  };

  onAdd = (field, val = '') => {
    this.setState(({ values }) => {
      const value = Utils.object.getIn(values, field);

      return {
        values: Utils.object.setIn(values, field, [...(value.length === 0 ? [val, cloneDeep(val)] : [val]), ...value]),
      };
    });
  };

  onRemove = (field, i) => {
    const { onBlur } = this.props;

    this.setState(
      ({ values, errors }) => ({
        values: Utils.object.setIn(
          values,
          field,
          (Utils.object.getIn(values, field) || []).filter((_, j) => i !== j)
        ),
        errors: Utils.object.setIn(
          errors,
          field,
          (Utils.object.getIn(errors, field) || []).filter((_, j) => i !== j)
        ),
      }),
      onBlur ? () => onBlur('field', this.state) : undefined
    );
  };

  onChangeAndBlur = (field, value) => {
    this._callBlurAfterChange = true;
    this.onChange(field, value);
  };

  onSubmit = async () => {
    let { errors, isValid, submitCount } = this.state;
    const { values, isSubmitting } = this.state;
    const { onSubmit, initialValues, scheme } = this.props;

    if (isSubmitting) {
      return;
    }

    if (scheme) {
      this.setState({
        validationsInProgress: Object.keys(scheme._nodes).reduce((obj, key) => Object.assign(obj, { [key]: true }), {}),
      });

      const res = await Form.validateYupScheme(scheme, values);

      ({ errors, isValid } = res);
    }

    submitCount += 1;

    this.setState(
      {
        errors,
        isValid,
        submitCount,
        isSubmitting: isValid,
        validationsInProgress: scheme ? Object.keys(scheme._nodes).reduce((obj, key) => Object.assign(obj, { [key]: false }), {}) : {},
      },
      isValid && onSubmit
        ? async () => {
            const diff = Form.getDiff(values, initialValues);

            await onSubmit({ diff, values, isChanged: !isEmpty(diff) });

            if (!this._unmounted) {
              this.setState({ isSubmitting: false });
            }
          }
        : undefined
    );
  };

  async validateAllFields() {
    let { errors, isValid } = this.state;
    const { values } = this.state;
    const { scheme } = this.props;

    if (scheme) {
      this.setState({
        validationsInProgress: Object.keys(scheme._nodes).reduce((obj, key) => Object.assign(obj, { [key]: true }), {}),
      });

      const res = await Form.validateYupScheme(scheme, values);

      ({ errors, isValid } = res);
    }

    this.setState({
      errors,
      isValid,
      validationsInProgress: scheme ? Object.keys(scheme._nodes).reduce((obj, key) => Object.assign(obj, { [key]: false }), {}) : {},
    });
  }

  render() {
    const { values, errors, isValid, submitCount, isSubmitting, validationsInProgress } = this.state;

    const {
      id,
      onRef,
      onBlur,
      scheme,
      children,
      onChange,
      onSubmit,
      onLayout,
      className,
      component: RComponent,
      transforms,
      initialValues,
      resetToInitialFields,
      ...wrapperProps
    } = this.props;

    const autoFocus = autoFocusCreator(errors);

    return (
      <RComponent {...wrapperProps} ref={onRef} className={cn('form', className)}>
        {!!id && <PropsBridgeUpdater id={`${id}-form`} isValid={isValid} handleSubmit={this.onSubmit} isSubmitting={isSubmitting} />}

        {children({
          values,
          errors,
          isValid,
          autoFocus,
          handleAdd: this.onAdd,
          handleBlur: this.onBlur,
          submitCount,
          handleRemove: this.onRemove,
          handleSubmit: this.onSubmit,
          handleChange: this.onChange,
          isSubmitting,
          handleChangeAndBlur: this.onChangeAndBlur,
          validationsInProgress,
        })}

        {IS_DEVELOPMENT &&
          Object.keys(errors).map((key) => {
            const value = errors[key];
            const isObject = typeof value === 'object';

            if (!value) {
              return null;
            }

            // eslint-disable-next-line no-nested-ternary
            return isObject ? (
              Object.values(value).some((v) => v) ? (
                <span key={key} className="form-hint text-danger">
                  {key}: {JSON.stringify(value)}
                </span>
              ) : null
            ) : (
              <span key={key} className="form-hint text-danger">
                {key}: {value}
              </span>
            );
          })}
      </RComponent>
    );
  }
}
