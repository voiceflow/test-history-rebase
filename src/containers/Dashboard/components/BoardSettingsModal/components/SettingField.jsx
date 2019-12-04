/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';

export default function SettingField({ hr, label, children, description }) {
  return (
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
}
