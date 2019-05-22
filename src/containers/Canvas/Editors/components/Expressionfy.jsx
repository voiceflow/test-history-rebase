import React, { Component } from 'react';
import { symbols, arithmetic } from './Expression.config'

const expressionfy = (expression, depth=0) => {
    if(!expression)return <div>err</div>;
    if(depth > 8){
        // return a blank
        return <span className="math unknown">?</span>;
    }else if(expression.type === 'advance'){
        if(!expression.value.text) return <span className="math unknown">?</span>;
        let value = expression.value.text.split("\n").filter(x=>!(x===''||/\s+/.test(x))).join(", ");
        return <span className="math brackets">( {value.split(/\{([a-zA-Z0-9_]*)\}/g)
        .map((v,i)=>i%2===0?v:(<span className="math variable" key={v}>{v}</span>))} )</span>;
    }else if(expression.type === 'value'){
        let value = expression.value.toString();
        if(!expression.value){
            return <span className="math unknown">?</span>;
        }else if(isNaN(value)){
            return <span className="value">{value.replace(/"/g, "'")}</span>;
        }else{
            return <span className="math value">{parseInt(value, 10)}</span>;
        }
    }else if(expression.type === 'variable'){
        if(expression.value){
            return <span className="math variable">{expression.value}</span>
        }else{
            return <span className="math unknown">?</span>;
        }
    }else{
        if(expression.type === 'not'){
            return <span className="brackets">( <span className="not">NOT</span> {expressionfy(expression.value)} )</span>
        }else if(arithmetic.includes(expression.type)){
            let first = expressionfy(expression.value[0]);
            if(first.props.className && first.props.className.substring(0,4) !== 'math'){
                first = <span className="NaN"></span>;
            }
            let second = expressionfy(expression.value[1]);
            if(second.props.className && second.props.className.substring(0,4) !== 'math'){
                second = <span className="NaN"></span>;
            }

            return <span className="math brackets">
            ( {first} {symbols[expression.type]} {second} )
            </span>
        }else if(expression.type){
            return <span className="brackets">
            ( {expressionfy(expression.value[0])} <span className={expression.type}>{symbols[expression.type]}</span> {expressionfy(expression.value[1])} )
            </span>
        }
        return null;
    }
}

class Expressionfy extends Component {

    render() {
        if(!this.props.expression) return null;
        return <div className="expressionfy">{expressionfy(this.props.expression)}</div>;
    }
}

export default Expressionfy;
