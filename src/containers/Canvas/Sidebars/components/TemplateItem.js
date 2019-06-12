import React from 'react';

const TemplateItem = (props) => {
  // TODO: add hover popover for full template name
  let title = props.module.title;
  if (title.length > 15) {
    title = title.substring(0, 15);
    title += '...';
  }
  return (
    <div
      className="MenuItem"
      onClick={() => {
        props.onTemplateChoice(props.module);
      }}
    >
      <div className="MenuIcon">
        <img className="MenuIcon" src={props.module.module_icon} alt={props.module.title} />
      </div>
      {title}
    </div>
  );
};

export default TemplateItem;
