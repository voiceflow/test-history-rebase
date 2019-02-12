import React from "react";

export class BaseWidget extends React.Component {
	constructor(name, props) {
		super(props);
		this.className = name;
	}

	bem(selector) {
		return (this.props.baseClass || this.className) + selector + " ";
	}

	getClassName() {
		return (
			(this.props.baseClass || this.className) + " " + (this.props.className ? this.props.className + " " : "")
		);
	}

	getProps() {
		return {
			...((this.props.extraProps) || {}),
			className: this.getClassName()
		};
	}
}
