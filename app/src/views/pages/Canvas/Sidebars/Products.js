import _ from 'lodash';
import React, { PureComponent } from 'react'
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label } from 'reactstrap';

class Products extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
        	new_product: ''
        }

        this.addProduct = this.addProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    addProduct(e){
        if(e) e.preventDefault();
        let products = this.props.products;
        let new_product = this.state.new_product;
        if(!products.includes(new_product)) {
            this.props.addProduct(null, new_product);
            this.setState({
                new_product: ''
            });
        }else{
            alert('Invalid Product');
        }
        return false
    }

    deleteProduct(product){
        let products = this.props.products
        let index = products.indexOf(product)
        if (index !== -1) products.splice(index, 1)
        this.props.deleteProduct(product)
        this.forceUpdate();
    }

    render() {
        return <React.Fragment>
            <form onSubmit={this.addProduct}>
                <FormGroup className="mb-0">
                    <Label>Add New Product</Label>
                    <InputGroup>
                        <Input className="form-control-border left"  name="new_product" value={this.state.new_product} onChange={this.handleChange} maxLength="16" placeholder="Product Name"/>
                        <InputGroupAddon addonType="append"><Button type="submit" className="new_product"><i className="fas fa-plus"/></Button></InputGroupAddon>
                    </InputGroup>
                </FormGroup>
            </form>
            <h1 className="down-arrow"><i className="far fa-long-arrow-alt-down"></i></h1>
            <div>
                <Label>Products</Label>
                <div className="products">
                    {this.props.products ? _.map(this.props.products, product => {
                        return <div key={product.id} className="product">
                            {product.name} <span onClick={() => this.deleteProduct(product)}><i className="fas fa-times"></i></span>
                        </div>
                    }) : <span className="text-muted">No Existing Products</span>}
                </div>
            </div>
        </React.Fragment>
    }
}

export default Products;
