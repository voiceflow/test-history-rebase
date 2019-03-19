import * as React from "react";
import * as _ from "lodash";
//Helpers
import { combineValidation, combineAppendValidation, appendValidator } from './../../../helpers/combineHelper'
import {Toolkit}from './../Toolkit'
import { BlockNodeModel } from "./../models/BlockNodeModel";
import { BlockPortLabel } from "./BlockPortLabelWidget";
import { BaseWidget} from "./../main.js";
import Textarea from 'react-textarea-autosize';
import AnimateHeight from 'react-animate-height'
import { Tooltip } from 'react-tippy'

const toolkit = new Toolkit()
export class BlockNodeWidget extends BaseWidget {
	constructor(props) {
		super("srd-default-node", props);
		this.state={
			dropdownOpen: false,
			edit: false,
			name: props.node ? props.node.name : ''
		};
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.removeTemp = this.removeTemp.bind(this);
		this.addTemp = this.addTemp.bind(this);
		this.combineNode = this.combineNode.bind(this);
		this.close = this.close.bind(this);
		this.addCommand = this.addCommand.bind(this)
	}

	static getDerivedStateFromProps(props){
		if (_.includes(props.diagramEngine.getDiagramModel().nodes, c => c.id === props.node.id)) {
			props.node.updateDimensions(props.diagramEngine.getNodeDimensions(props.node))
		}
		return null;
	}
	componentDidMount(){
		if (_.includes(this.props.diagramEngine.getDiagramModel().nodes, c => c.id === this.props.node.id)) {
			this.props.node.updateDimensions(this.props.diagramEngine.getNodeDimensions(this.props.node))
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.node.selected && prevProps.node.edit){
			this.close();
		}
	}

	addCommand(e){
		if(this.props.nodeProps.disabled) return
		const engine = this.props.diagramEngine
		const node = new BlockNodeModel('New Command', null, toolkit.UID())
		node.parentCombine = this.props.node
		node.extras = {
			alexa: {
					intent: null,
					mappings: [],
					resume: true
			},
			google: {
					intent: null,
					mappings: [],
					resume: true
			},
			type: 'command'
		}
		engine.setSuperSelect(node)
		node.setSelected()
		e.preventDefault()
		e.stopPropagation()
		this.props.node.combines.push(node)
		engine.enableRepaintEntities([this.props.node]);
		engine.repaintCanvas(false)
	}

	generatePort(port) {
		if (port.parent){
			return <BlockPortLabel model={port} key={port.id} diagramEngine={this.props.diagramEngine} isLast={this.props.isLast} isMoving={this.props.node.isMoveInside} />;
		}
		return null;
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	addTemp(e, isTop = false){
		if (this.props.node.parentCombine && this.props.node.parentCombine.extras.type === 'god' && e.buttons === 1 && combineAppendValidation(this.props.node) && appendValidator(this.props.diagramEngine.getSuperSelect())) {
			if ((combineAppendValidation(_.last(this.props.node.parentCombine.combines)) || combineAppendValidation(this.props.diagramEngine.getSuperSelect())) && combineAppendValidation(this.props.diagramEngine.getSuperSelect())) {
				let idx = _.findIndex(this.props.node.parentCombine.combines, c => c.id === this.props.node.id);
				this.props.node.parentCombine.combines.splice(idx + 1, 0, 'temp')
				this.props.diagramEngine.enableRepaintEntities([this.props.node.parentCombine, this.props.diagramEngine.getSuperSelect()]);
				this.props.diagramEngine.repaintCanvas(false)
			} else if (combineAppendValidation(_.last(this.props.node.parentCombine.combines)) && !combineAppendValidation(this.props.diagramEngine.getSuperSelect()) && _.last(this.props.node.parentCombine.combines) !== 'temp') {
				this.props.node.parentCombine.combines.push('temp')
				this.props.diagramEngine.enableRepaintEntities([this.props.node.parentCombine, this.props.diagramEngine.getSuperSelect()]);
				this.props.diagramEngine.repaintCanvas(false)
			}
		} else if(!_.isEmpty(this.props.node.combines) && this.props.node.extras.type === 'god') {
			if (e.buttons === 1 && combineAppendValidation(this.props.diagramEngine.getSuperSelect()) && appendValidator(this.props.diagramEngine.getSuperSelect()) && isTop) {
				this.props.node.combines.splice(0, 0, 'temp')
				this.props.diagramEngine.enableRepaintEntities([this.props.node, this.props.diagramEngine.getSuperSelect()]);
				this.props.diagramEngine.repaintCanvas(false)
			} else if (this.props.node.parentCombine && combineAppendValidation(_.last(this.props.node.parentCombine.combines)) && e.buttons === 1 && combineAppendValidation(this.props.diagramEngine.getSuperSelect()) && appendValidator(this.props.diagramEngine.getSuperSelect()) && !isTop) {
				this.props.node.combines.push('temp')
				this.props.diagramEngine.enableRepaintEntities([this.props.node, this.props.diagramEngine.getSuperSelect()]);
				this.props.diagramEngine.repaintCanvas(false)
			}
		}
	}

	removeTemp(e){
		if ((this.props.node.parentCombine && _.includes(this.props.node.parentCombine.combines, 'temp')) || (!_.isEmpty(this.props.node.combines) && _.includes(this.props.node.combines, 'temp'))) {
			if (this.props.node.parentCombine && combineAppendValidation(this.props.diagramEngine.getSuperSelect()) && !this.props.diagramEngine.getSuperSelect().parentCombine) {
				_.remove(this.props.node.parentCombine.combines, c => c === 'temp')
				this.props.diagramEngine.enableRepaintEntities([this.props.node.parentCombine, this.props.diagramEngine.getSuperSelect()]);
				this.props.diagramEngine.repaintCanvas(false)
			} else if (combineAppendValidation(this.props.diagramEngine.getSuperSelect()) && !this.props.diagramEngine.getSuperSelect().parentCombine) {
				_.remove(this.props.node.combines, c => c === 'temp')
				this.props.diagramEngine.enableRepaintEntities([this.props.node, this.props.diagramEngine.getSuperSelect()]);
				this.props.diagramEngine.repaintCanvas(false)
			}
		}
	}

	close() {
		if (!this.props.preview) {
			this.props.node.name = this.state.name;
			if (this.props.node.extras.type === 'flow'){
				this.props.nodeProps.renameFlow(this.props.node.extras.diagram_id, this.state.name)
			}
			this.props.node.setLocked(false);
			this.props.node.edit = false
			this.forceUpdate();
		}
	}

	combineNode(e = null) {
		let current = this.props.diagramEngine.getSuperSelect();
		let target_node = this.props.node
		if ((!combineAppendValidation(target_node) && !combineAppendValidation(current))) {
			this.props.nodeProps.setCanvasError(`Cannot combine blocks of type ${current.extras.type} and ${target_node.extras.type}`)
		}
		if (combineValidation(current, target_node, this.props.nodeProps.setCanvasError) && (combineAppendValidation(current) || (combineAppendValidation(target_node)))) {
			let selected = this.props.diagramEngine.getSuperSelect()
			let engine = this.props.diagramEngine
			let targetNode = target_node
			var node;
			if (targetNode.extras && targetNode.extras.type !== "god" ) {
				e.nodeHover = true;
				node = new BlockNodeModel('Combine Block', null, toolkit.UID())
				node.extras.type = "god"
				if (!(combineAppendValidation(targetNode))) {
					let temp = selected;
					selected = targetNode;
					targetNode = temp
				}
				// node.ports = {}
				let selected_ports = selected.getPorts()
				let target_ports = targetNode.getPorts()
				for (var name in selected_ports) {
					let port = selected_ports[name]
					// port.parent=null
					if (!port.in) {
						port.parent = node
						node.ports[name] = _.clone(port);
					}
				}
				for (var name2 in target_ports) {
					let port = target_ports[name2]
					// port.parent = null
					if (port.in) {
						port.parent = node
						node.ports[name2] = _.clone(port)
					}
				}
				targetNode.parentCombine = node;
				selected.parentCombine = node;
				node.x = targetNode.x
				node.y = targetNode.y
				targetNode.x = targetNode.x + 25
				targetNode.y = targetNode.y + 40
				selected.x = targetNode.x
				selected.y = targetNode.y + 40
				node.combines = [targetNode.serialize()]
				node.combines.push(selected.serialize());
				if (selected && targetNode) {
					selected.remove()
					targetNode.remove()
				}
				node.setSelected()
				engine.getDiagramModel().clearSelection()
				engine.setSuperSelect(node)
				engine.getDiagramModel().addNode(node)
				engine.enableRepaintEntities([node]);
				engine.repaintCanvas(false);
			}
			this.props.diagramEngine.enableRepaintEntities([current]);
			this.props.diagramEngine.repaintCanvas(false);
		}
	}
	// {this.props.node.extras && this.props.node.extras.reads ? <div className="block-reads">{this.props.node.extras.reads}</div> : null}
	onMouseEnter() {
		this.setState({
			dropdownOpen: true,
		})
	}

	onMouseLeave() {
		this.setState({
			dropdownOpen: false,
		})
	}

	render() {
		if(this.props.node.extras.type === 'comment'){
			return <div className={`srd-default-node ${this.props.node.extras.type}`}>
        <Textarea value={this.props.node.name} readOnly={this.props.locked} onChange={e => {this.props.node.name = e.target.value; this.forceUpdate()}} onBlur={()=>{
          if(!this.props.node.name.trim()){
            this.props.diagramEngine.getDiagramModel().removeNode(this.props.node)
            this.forceUpdate()
          }
        }}/>
			</div>
		}
		const fade = this.props.node.fade ? " faded-node" : ""

		return (
			<div className={`srd-default-node ${this.props.node.extras.type !== 'card' ? this.props.node.extras.type : 'kard'} ${this.props.isLast ? 'last' : ''} ${this.props.selected ? 'selected' : 'no-select'} ${this.props.node.isMoving && this.props.node.parentCombine ? 'moving' : ''} ${fade}`}
				data-nodeid = {
					this.props.node.id
				}
				onMouseDown={(e) => {
					if (this.props.onClick && !e.didRun){
						this.props.onClick()
						e.didRun = true
					} else if (!e.didRun){
						this.props.diagramEngine.setSuperSelect(this.props.node)
					}
					if(this.props.node.extras.type !== 'story'){
						var nodeElement = toolkit.closest(e.target, ".node[data-nodeid]");
						this.nodeElement = nodeElement
					}
					window.getSelection ? window.getSelection().empty() : document.selection.empty()
				}}
				onMouseUp = {(e) => {
					if (this.props.diagramEngine.getSuperSelect() && this.props.diagramEngine.getSuperSelect() !== this.props.node && this.props.diagramEngine.getSuperSelect().isMoving && !this.props.diagramEngine.getSuperSelect().isMoveInside) {
						this.combineNode(e)
					}
				}}
				onMouseEnter = { e => {
					if (this.props.node.parentCombine){
						this.removeTemp(e)
						if (this.props.diagramEngine.getSuperSelect() && this.props.diagramEngine.getSuperSelect().isMoving && !this.props.diagramEngine.getSuperSelect().isMoveInside) {
							this.addTemp(e)
						}
						e.stopPropagation()
					}
				}}
				onMouseLeave={e => {
					if (!_.isEmpty(this.props.node.combines) && this.props.diagramEngine.getSuperSelect() && !this.props.diagramEngine.getSuperSelect().parentCombine){
						_.remove(this.props.node.combines, c => c === 'temp')
						this.forceUpdate()
					}
				}}
				key={this.props.node.id}
			>
				{this.props.node.linter && this.props.node.linter.length > 0 &&
					<Tooltip
						target="tooltip"
						className="linter-badge"
						position="left"
						onShow={this.updateHeight}
						html={<div className="linter-tooltip">
							<div className="linter-title">
								Block Errors
							</div>
							{this.props.node.linter.map((s, i) => {
								return (
									<div className="linter-element d-flex justify-content-start" key={i}>
									<div className="my-1 mx-1">
										<span className="linter-number">
											{i + 1}
										</span>
									</div>
									<span className="linter-text">
										{s}
									</span>
									</div>
								)
							})}
						</div>}>
						<img className="warning-logo" src="/badge.svg" alt="logo"/>
					</Tooltip>
				}
				{this.props.node.extras && this.props.node.extras.type === 'god' ? <div className='w-100'
					style={{height: 12}}
					onMouseEnter = {
					e => {
						this.removeTemp(e)
						if (this.props.diagramEngine.getSuperSelect() && this.props.diagramEngine.getSuperSelect().isMoving && !this.props.diagramEngine.getSuperSelect().isMoveInside) {
							this.addTemp(e, true)
						}
						e.stopPropagation()
					}
				}
				/> : null}
				<div className={this.bem("__title") + ' no-select'}
					style={this.props.isLast ? undefined : {paddingTop: '10px'}}
					onMouseEnter = {e => {
						this.removeTemp(e)
						if (this.props.diagramEngine.getSuperSelect() && this.props.diagramEngine.getSuperSelect().isMoving && !this.props.diagramEngine.getSuperSelect().isMoveInside){
							this.addTemp(e, true)
						}
						e.stopPropagation()
					}}
				>
					{
						this.props.node.extras.type === 'story' ?
						<div className="home-block">
						{
							this.props.node.extras.type === 'story' &&
							<Tooltip
								className="float-left menu-tip-home"
								position="left"
								title="This is where your project begins"
								distance={18}
							><img src={'/home.svg'} height={11} width={11} alt="home"/></Tooltip>
						}
							<div className="home-title">{this.props.nodeProps.diagram ? (this.props.nodeProps.diagram.name === 'ROOT' ? 'Home' : this.props.nodeProps.diagram.name) : 'Flow'}</div>
							<div className="faux-start-block">Start</div>
							{!!this.props.node.combines && !!this.props.node.combines.length && <React.Fragment>
								<hr/>
								<Tooltip
									className="float-left menu-tip-command"
									position="left"
									title = "Commands can be accessed by the user from anywhere in your skill. For example, if a user says “Alexa, help” while in your skill, they will activate the help flow. Once a user is done the help flow they will be returned to the wherever they previously were in the skill."
									distance={18}
									color={"#8da2b5"}
								>?</Tooltip>
								<div className="home-title">Commands</div>
							</React.Fragment>}
						</div> :
						<div className={this.bem("__name")} style={this.props.node.parentCombine ? {fontSize: '13px', textAlign: 'left', padding: '0 10px', fontWeight: '500'} : {padding: '0 40px'}}>
							{this.props.node.edit ? 
									<input
										name="name"
										value={this.state.name}
										onChange={this.handleChange}
										onKeyDown={(e) => e.keyCode===13 && this.close()}
										style={{background: 'none', border: 'none', outline: 'none', textAlign: 'center', width: '100px'}}
										autoFocus
									/>:
							< span > {
								_.trim(this.props.node.name) ?
								this.props.node.name :
								_.startCase(this.props.node.extras.type === 'god' ? 'Combine Block' : this.props.node.extras.type)
							} </span>}
							{
								this.props.node.extras.type ==='command' && !!this.props.node.parentCombine 
								&& this.props.node.parentCombine.extras.type ==='story' && this.props.node.extras['alexa'] &&
								this.props.nodeProps.hasFlow(this.props.node.extras['alexa'].diagram_id) &&
								<div className="command-right">
									<button
										className="btn btn-black btn-sm"
										onMouseDown={(e) => e.stopPropagation()}
										onMouseUp={()=>this.props.nodeProps.enterFlow(this.props.node.extras['alexa'].diagram_id)}>
										<i className="fas fa-clone mr-1"/>Enter Flow
									</button>
								</div>
							}
					</div>}
				</div>
				<div className={this.bem("__ports")}
						onMouseEnter={e => {
							this.removeTemp(e)
							if (this.props.diagramEngine.getSuperSelect() && this.props.diagramEngine.getSuperSelect().isMoving && !this.props.diagramEngine.getSuperSelect().isMoveInside) {
								if (!_.isEmpty(this.props.node.combines) && _.head(this.props.node.combines).y >= this.props.diagramEngine.getSuperSelect().y){
									this.addTemp(e, true)
								} else {
									this.addTemp(e)
								}
							}
							e.stopPropagation()
						}}
				>
					<div className={`${this.bem("__in")} ${this.props.node.extras.type !== 'card' && this.props.node.extras.type}`}>
						{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}
					</div>
					{!_.isEmpty(this.props.node.combines) &&
						<div className="combine-node"
							ref = {
								ref => {
									if (ref && !_.isEmpty(this.props.node.combines)) {
										this.props.diagramEngine.setCombineCanvas(ref);
									}
								}
							}
						>
							{_.map(this.props.node.combines,(node, idx) => {
										if (!(node instanceof String) && node.id){
											return React.createElement(
													BlockNodeWidget,
													{
														diagramEngine: this.props.diagramEngine,
														key: node.id,
														isLast: idx === this.props.node.combines.length-1,
														selected: this.props.diagramEngine.getSuperSelect() && this.props.diagramEngine.getSuperSelect().id===node.id,
														node: new BlockNodeModel().deSerialize(node, this.props.diagramEngine, this.props.node, node.fade, node.linter),
														nodeProps: this.props.nodeProps,
														onClick: () => {
															this.props.diagramEngine.setSuperSelect(new BlockNodeModel().deSerialize(node, this.props.diagramEngine, this.props.node, node.fade, node.linter))
														},
													},
													this.props.diagramEngine.generateWidgetForNode(new BlockNodeModel().deSerialize(node, this.props.diagramEngine, this.props.node, node.fade, node.linter))
												)
										} else {
											return <AnimateHeight
												key={idx}
												duration={1000}
												height={'auto'}>
													<div className="rearrange-placeholder"
													style={{height: '40px'}}
													key={idx} />
											</AnimateHeight>
										}
							})}
						</div>
					}
					{
						this.props.node.extras.type === 'module' &&
							<React.Fragment>
								<img className="rounded ModuleIcon" draggable={false} src={this.props.node.extras.module_icon} alt={this.props.node.extras.title}/>
								<h5 className="ml-1">(Vers. {this.props.node.extras.version_id})</h5>
							</React.Fragment>
					}
					{ this.props.node.extras.type === 'flow' && this.props.nodeProps.hasFlow(this.props.node.extras.diagram_id) && <button
						className="btn btn-black btn-sm mt-1 mx-2"
						onMouseDown={(e) => e.stopPropagation()}
						onMouseUp={()=>this.props.nodeProps.enterFlow(this.props.node.extras.diagram_id)}>
						<i className="fas fa-clone mr-1"/>Enter Flow
					</button>}
					<div className={`${this.bem("__out")} ${this.props.node.extras.type !== 'card' && this.props.node.extras.type}`}>
						{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
					</div>
				</div>
				{this.props.node.extras.type === 'story' && <div id="add-command" onMouseUp={this.addCommand}>
						<Tooltip
							position="bottom"
							title="Add Command"
							distance={18}
						>
							<button className="round-btn">
								<i className="fal fa-plus"/>
							</button>
						</Tooltip>
					</div>
				}
			</div>
		);
	}
}