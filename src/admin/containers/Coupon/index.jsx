import axios from 'axios';
import React from 'react';
import { Button, Col, Form, FormGroup, Input as Select, Label, Table } from 'reactstrap';

import { AdminTitle } from '@/admin/styles';
import Input from '@/componentsV2/Input';
import { toast } from '@/componentsV2/Toast';

class Coupon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coupons: [],
      coupon: { plan: 1 },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.delete = this.delete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getCoupons();
  }

  async getCoupons() {
    const data = await axios.get('/admin-api/coupon/get');
    this.setState({ coupons: data.data });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState((s) => ({ coupon: { ...s.coupon, [name]: value } }));
  }

  async delete(id) {
    try {
      await axios.delete(`/admin-api/coupon/${id}`);
    } catch (e) {
      toast.error('Are you sure the coupon exists?');
    }
    this.getCoupons();
  }

  async onSubmit() {
    if (!this.state.coupon.code) {
      return toast.error('Bad code');
    }
    if (!parseInt(this.state.coupon.duration, 10)) {
      return toast.error('Bad duration');
    }
    if (!parseInt(this.state.coupon.seats, 10)) {
      return toast.error('Bad seats');
    }
    if (!parseInt(this.state.coupon.redemptions, 10)) {
      return toast.error('Bad redemptions');
    }
    try {
      await axios.post('/admin-api/coupon/', this.state.coupon);
      toast.success('Submit Success');
    } catch (e) {
      toast.error('Does the code already exist?');
    }
    this.getCoupons();
  }

  render() {
    return (
      <>
        <AdminTitle>Coupons</AdminTitle>
        <hr />
        <div>
          <Form>
            <FormGroup row>
              <Label for="code" sm={2}>
                Code
              </Label>
              <Col sm={10}>
                <Input name="code" id="code" value={this.state.coupon.code} onChange={this.handleInputChange} placeholder="COUPON CODE" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="duration" sm={2}>
                Duration (days)
              </Label>
              <Col sm={10}>
                <Input name="duration" id="duration" value={this.state.coupon.duration} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="seats" sm={2}>
                Seats
              </Label>
              <Col sm={10}>
                <Input name="seats" id="seats" value={this.state.coupon.seats} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="redemptions" sm={2}>
                Redemptions
              </Label>
              <Col sm={10}>
                <Input name="redemptions" id="redemptions" value={this.state.coupon.redemptions} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="plan" sm={2}>
                Plan
              </Label>
              <Col sm={10}>
                <Select name="plan" id="plan" type="select" value={this.state.coupon.plan} onChange={this.handleInputChange}>
                  <option value="1">Pro</option>
                  <option value="2">Business</option>
                </Select>
              </Col>
            </FormGroup>
            <Button className="w-100 m-3" onClick={this.onSubmit}>
              Submit
            </Button>
          </Form>
        </div>
        <Table striped hover>
          <thead>
            <tr>
              <th>Code</th>
              <th>Duration</th>
              <th>Plan</th>
              <th>Seats</th>
              <th>Redemptions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.coupons.map((t) => (
              <tr key={t.code}>
                <th scope="row" className="align-middle">
                  {t.code}
                </th>
                <td>{t.duration}</td>
                <td>{t.plan}</td>
                <td>{t.seats}</td>
                <td>{t.redemptions}</td>
                <td>
                  <Button color="warning" onClick={() => this.delete(t.code)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

export default Coupon;
