import React, {Component} from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

class Multiple extends Component {

 	constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);

        if(!Array.isArray(props.list) || props.list.length === 0){
            this.props.update(['']);
        }
    }

    handleChange(e) {
        let list = this.props.list;
        list[e.target.name] = e.target.value;
        this.props.update(list);
    }

    delete(i) {
        let list = this.props.list;

        if(list.length > 1){
            list.splice(i ,1);
            this.props.update(list);
        }
    }

    add() {
        let list = this.props.list;
        list.push('');
        this.props.update(list);
    }

	render() {
        if(!this.props.list) return null;

        return <div className="multiple">
            {this.props.list.map((element, i) =>
                <div key={i} className="super-center">
                    <span className="px-2 font-weight-bold">{i + 1}.</span>
                    <InputGroup>
                        {this.props.prepend ? 
                            <InputGroupAddon addonType="prepend">{this.props.prepend}</InputGroupAddon> :
                            null
                        }
                        <Input 
                            name={i} 
                            value={this.props.list[i]} 
                            onChange={this.handleChange}
                            placeholder={this.props.placeholder}
                        />
                        { this.props.list.length > 1 ?
                            <InputGroupAddon addonType="append">
                                <Button onClick={()=>this.delete(i)}>×</Button>
                            </InputGroupAddon> : null
                        }
                  </InputGroup>
                </div>
            )}

            { this.props.max && this.props.list.length >= this.props.max ? null :
                <Button block color='primary' className="dash-button" onClick={this.add}>{this.props.add}</Button>
            }
        </div>;
	}
}

export default Multiple;