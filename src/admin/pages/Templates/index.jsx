import axios from 'axios';
import React from 'react';
import { Button, Col, Form, FormGroup, Label, Table } from 'reactstrap';

import { AdminTitle } from '@/admin/styles';
import Input from '@/components/Input';
import { toast } from '@/components/Toast';
import Toggle from '@/components/Toggle';

class Template extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      templates: [],
      template: {
        template_index: '-1',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getTemplates();
  }

  async getTemplates() {
    const data = await axios.get('/admin-api/template/get');
    this.setState({ templates: data.data });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState((s) => ({ template: { ...s.template, [name]: value } }));
  }

  async deleteTemplate(id) {
    try {
      await axios.delete(`/admin-api/template/${id}`);
    } catch (e) {
      toast.error('Are you sure the project exists?');
    }
    this.getTemplates();
  }

  async onSubmit() {
    if (!parseInt(this.state.template.module_project_id, 10)) {
      return toast.error('Bad Project ID');
    }
    if (!parseInt(this.state.template.template_index, 10)) {
      return toast.error('Bad Order');
    }
    try {
      if (this.state.template.module_id) {
        await axios.put(`/admin-api/template/${this.state.template.module_id}`, this.state.template);
      } else {
        await axios.post('/admin-api/template/', this.state.template);
      }
      toast.success('Submit Success');
    } catch (e) {
      toast.error('Are you sure the project exists?');
    }

    this.getTemplates();
  }

  render() {
    const curorder = parseInt(this.state.template.template_index, 10);

    return (
      <>
        <AdminTitle>Templates</AdminTitle>
        <hr />
        <div>
          <Form>
            <FormGroup row>
              <Label for="id" sm={2}>
                ID
              </Label>
              <Col sm={8}>
                <Input
                  name="module_id"
                  id="id"
                  value={this.state.template.module_id}
                  onChange={this.handleInputChange}
                  placeholder="NEW TEMPLATE"
                  readOnly
                  disabled
                />
              </Col>
              <Col sm={2}>
                <Button color="warning" onClick={() => this.setState((s) => ({ template: { ...s.template, module_id: '' } }))}>
                  Clear ID
                </Button>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="title" sm={2}>
                Title
              </Label>
              <Col sm={10}>
                <Input name="title" id="title" value={this.state.template.title} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="descr" sm={2}>
                Description
              </Label>
              <Col sm={10}>
                <Input name="descr" id="descr" value={this.state.template.descr} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="icon" sm={2}>
                Icon URL
              </Label>
              <Col sm={10}>
                <Input name="module_icon" id="icon" value={this.state.template.module_icon} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="project" sm={2}>
                Project ID
              </Label>
              <Col sm={10}>
                <Input name="module_project_id" id="project" value={this.state.template.module_project_id} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="order" sm={2}>
                Order
              </Label>
              <Col sm={8}>
                <Input name="template_index" id="order" value={this.state.template.template_index} onChange={this.handleInputChange} />
              </Col>
              <Col sm={2} className="space-between">
                <label>Hidden: </label>
                <Toggle
                  checked={curorder < 0}
                  disabled={false}
                  onChange={() => this.handleInputChange({ target: { name: 'template_index', value: -curorder } })}
                />
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
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Icon</th>
              <th>Project ID</th>
              <th>Order (DESC)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.templates.map((t) => (
              <tr key={t.module_id}>
                <th scope="row" className="align-middle">
                  {t.module_id}
                </th>
                <td>{t.title}</td>
                <td>{t.descr}</td>
                <td>
                  <img src={t.module_icon} height="100px" alt="" />
                </td>
                <td>{t.module_project_id}</td>
                <td>{t.template_index > 0 ? t.template_index : `Hidden (${-t.template_index})`}</td>
                <td>
                  <Button color="primary" onClick={() => this.setState({ template: t })}>
                    Edit
                  </Button>{' '}
                  <Button color="warning" onClick={() => this.deleteTemplate(t.module_id)}>
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

export default Template;
