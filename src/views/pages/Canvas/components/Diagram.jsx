export const Diagram = props => {
    return (
         <div
            key={this.props.diagram_id}
            id="diagram"
            className={this.props.preview ? " no-padding" : ""}
            onDrop={this.onDrop}
            onDragOver={e => e.preventDefault()}
            onMouseLeave={()=>this.diagram_focus=false}
            onContextMenu={this.generateBlockMenu}
        >
            <WidgetBar
                toggleKeyboard={this.props.toggleKeyboard}
                keyboardHelp={this.props.keyboardHelp}
                engine={this.state.engine}
                setOpen={this.props.setOpen}
                update={(engine) => this.setState({ engine: engine })}
            />
            { this.props.skill.diagram !== this.props.diagram_id && <FlowBar
                    deleteFlow={this.deleteFlow}
                    copyFlow={this.copyFlow}
                    enterFlow={this.enterFlow}
                    preview={this.props.preview}
                    diagram={diagram}
                />
            }
            {this.props.blockMenu}
            <SRD.DiagramWidget
                diagramEngine={this.state.engine}
                allowLooseLinks={false}
                locked={this.props.preview}
                onConfirm={this.props.onConfirm}
                onDeleteIntentNode={this.onDeleteIntentNode.bind(this)}
                nodeProps={{
                    hasFlow: this.hasFlow,
                    enterFlow: this.enterFlow,
                    removeNode: this.removeNode,
                    diagram: diagram,
                    removeCombineNode: this.removeCombineNode,
                }}
                removeHandler={(node) => {
                    if (this.props.undoEvents.length >= 10) {
                        this.props.shiftUndo()
                    }
                    this.props.addUndo(node, 'remove')
                    this.props.clearRedo()
                }}
                forceRepaint={this.forceRepaint}
                live_mode={this.props.live_mode}
                clickDiagram={this.clickDiagram}
                editorOpen={this.props.open}
            />
        </div>
    )
}