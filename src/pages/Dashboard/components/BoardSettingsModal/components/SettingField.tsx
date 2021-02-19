/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';

export type SettingFieldProps = {
  label: React.ReactNode;
  hr?: boolean;
  description?: React.ReactNode;
};

const SettingField: React.FC<SettingFieldProps> = ({ hr, label, children, description }) => (
  <>
    <label>{label}</label>

    {children}

    {description && (
      <>
        <br />
        <small className="text-muted">{description}</small>
      </>
    )}

    {hr && <hr />}
  </>
);

export default SettingField;
