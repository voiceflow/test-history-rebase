import React, { Component } from 'react';

class SkillTemplates extends Component {
  render() {
    return (
      <div className="rotate cols">
        {this.props.templates.map((template, i) => {
          return (
            <div key={i} className="col" onTouchStart={() => this.classList.toggle('hover')}>
              <div
                className={`container${this.props.template === template.value ? ' selected' : ''}`}
                onClick={template.soon ? null : () => this.props.onUpdate(template.value)}
              >
                <div className="front" style={template.image ? { backgroundImage: `url(${template.image})` } : null}>
                  <div className="inner">
                    <h1>{template.name}</h1>
                    {template.soon ? <span>Coming Soon</span> : null}
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p>{template.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default SkillTemplates;
