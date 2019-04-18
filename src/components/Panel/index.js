import React from 'react';
import PropTypes from 'prop-types';

export default function Panel({ children, sections, footerRenderer }) {
  const footerContent = footerRenderer && footerRenderer();

  return (
    <div className="panel">
      <div className="panel-body">
        <div className="panel-body-inner">
          {sections
            ? sections.map(
                (s, i) =>
                  s && (
                    <div key={i} className="panel-section">
                      {!!s.label && <label className="form-label">{s.label}</label>}
                      {typeof s.content === 'string' ? <p>{s.content}</p> : s.content}
                    </div>
                  )
              )
            : children}
        </div>
      </div>

      {footerContent && <div className="panel-footer">{footerContent}</div>}
    </div>
  );
}

Panel.propTypes = {
  children: PropTypes.node,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      content: PropTypes.node,
    })
  ),
  footerRenderer: PropTypes.func,
};
