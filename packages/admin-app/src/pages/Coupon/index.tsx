import { PlanType } from '@voiceflow/internal';
import { Input, toast } from '@voiceflow/ui';
import axios from 'axios';
import React from 'react';
import { Button, Col, Form, FormGroup, Input as Select, Label, Table } from 'reactstrap';

import { PageTitle } from '@/components/PageLayout';

interface CouponModel {
  code: string;
  plan: PlanType;
  seats: string;
  duration: string;
  redemptions: string;
}

const Coupon: React.FC = () => {
  const [coupon, setCoupon] = React.useState<Partial<CouponModel>>({});
  const [coupons, setCoupons] = React.useState<CouponModel[]>([]);

  const getCoupons = async () => {
    const data = await axios.get<CouponModel[]>('/admin-api/coupon/get');

    setCoupons(data.data);
  };

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/admin-api/coupon/${id}`);

      getCoupons();
    } catch (e) {
      toast.error('Are you sure the coupon exists?');
    }
  };

  const onSubmit = async () => {
    if (!coupon.code) {
      toast.error('Bad code');
      return;
    }

    if (!parseInt(coupon.duration ?? '', 10)) {
      toast.error('Bad duration');
      return;
    }
    if (!parseInt(coupon.seats ?? '', 10)) {
      toast.error('Bad seats');
      return;
    }
    if (!parseInt(coupon.redemptions ?? '', 10)) {
      toast.error('Bad redemptions');
      return;
    }

    try {
      await axios.post('/admin-api/coupon/', coupon);

      toast.success('Submit Success');

      getCoupons();
    } catch (e) {
      toast.error('Does the code already exist?');
    }
  };

  React.useEffect(() => {
    getCoupons();
  }, []);

  return (
    <>
      <PageTitle>Coupons (Deprecated, please refer to Referrals)</PageTitle>
      <hr />
      <div>
        <Form>
          <FormGroup row>
            <Label for="code" sm={2}>
              Code
            </Label>

            <Col sm={10}>
              <Input
                id="code"
                name="code"
                value={coupon.code}
                onChange={({ currentTarget }) => setCoupon((coupon) => ({ ...coupon, code: currentTarget.value }))}
                placeholder="COUPON CODE"
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="duration" sm={2}>
              Duration (days)
            </Label>

            <Col sm={10}>
              <Input
                id="duration"
                name="duration"
                value={coupon.duration}
                onChange={({ currentTarget }) => setCoupon((coupon) => ({ ...coupon, duration: currentTarget.value }))}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="seats" sm={2}>
              Seats
            </Label>

            <Col sm={10}>
              <Input
                id="seats"
                name="seats"
                value={coupon.seats}
                onChange={({ currentTarget }) => setCoupon((coupon) => ({ ...coupon, seats: currentTarget.value }))}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="redemptions" sm={2}>
              Redemptions
            </Label>

            <Col sm={10}>
              <Input
                id="redemptions"
                name="redemptions"
                value={coupon.redemptions}
                onChange={({ currentTarget }) => setCoupon((coupon) => ({ ...coupon, redemptions: currentTarget.value }))}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="plan" sm={2}>
              Plan
            </Label>

            <Col sm={10}>
              <Select
                id="plan"
                name="plan"
                type="select"
                value={coupon.plan}
                onChange={({ currentTarget }) => setCoupon((coupon) => ({ ...coupon, plan: currentTarget.value as PlanType }))}
              >
                <option value={PlanType.PRO}>Pro</option>
                <option value={PlanType.ENTERPRISE}>Enterprise</option>
              </Select>
            </Col>
          </FormGroup>

          <Button className="w-100 m-3" onClick={onSubmit}>
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
          {coupons.map((coupon) => (
            <tr key={coupon.code}>
              <th scope="row" className="align-middle">
                {coupon.code}
              </th>
              <td>{coupon.duration}</td>
              <td>{coupon.plan}</td>
              <td>{coupon.seats}</td>
              <td>{coupon.redemptions}</td>
              <td>
                <Button color="warning" onClick={() => onDelete(coupon.code)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Coupon;
