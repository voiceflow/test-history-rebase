import React, { Component } from 'react';

class TemplateCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { template: t, createProject, previewTemplate } = this.props;

    return (
      <div className="px-4 py-2 text-left project-card">
        <div className="card mb-3">
          <div className="template-card-content" style={{ backgroundImage: `url(${t.module_icon})` }}>
            <div className="overlay">
              <div className="overlay-content">
                <div>
                  <div className="edit-button" style={{ color: '#fff' }} onClick={() => createProject(t.module_id)}>
                    Start
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="template-card-body btn-darken" onClick={() => previewTemplate(t)}>
            <i className="far fa-bullseye-pointer" /> Preview
          </div>
        </div>
        <b>{t.title}</b>
        <p className="text-muted">{t.descr}</p>
      </div>
    );
  }
}

export default TemplateCard;
