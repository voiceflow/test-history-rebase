import queryString from 'query-string';
import React, { Component } from 'react';

class Legal extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(this.props.location.search);
    this.state = {
      name: values.name,
      skill: values.skill,
    };
  }

  render() {
    const name = this.state.name || 'John Doe';
    const skill = this.state.skill || 'Skill';
    return (
      <div className="overflow-auto p-2">
        <p>{name} Privacy Policy</p>
        <p>
          <em>Updated: December 5</em>
          <em>
            <sup>th</sup>
          </em>
          <em>, 2018</em>
        </p>
        <p>Welcome to the {name} Alexa Skill.</p>
        <p>
          At {name}, (“{skill}”), we create Alexa skills to enhance the human experience, and make life more enjoyable, and easier. We provide these
          services to you subject to the following Privacy Policy (the “Privacy Policy”).
        </p>
        <p>
          Please read these terms carefully. These terms, as modified or amended from time to time, are a binding contract between {name} (“we” and/or
          “us”, etc) and you ("you”).
        </p>
        <p>You may only use the service(s) operated by {name} if you first accept this Privacy Policy.</p>
        <p>WHAT THIS PRIVACY POLICY COVERS</p>
        <p>
          This policy covers how {name} treats personal information that is collected or received through the services we provide. Personal
          information is information about you that is personally identifiable like your name, address, email address, or phone number, and any
          information that is not otherwise publicly available.
        </p>
        <p>
          This policy does not apply to the practices of companies that we do not own or control, or to people that we do not employ or manage.
          Companies such as our Internet access and website and email hosting company, Facebook, and others have their own privacy statements which
          can be viewed on their respective websites.
        </p>
        <p>INFORMATION COLLECTION AND USE</p>
        <p>
          {name} collects personal information when you contract with us to use or purchase our services. When you contract with us for a particular
          service, we will ask you to provide us with your name, email address, and a contact phone number.
        </p>
        <p>
          The {name} Alexa skill may from time to time collect Skill usage information such as the number of sessions, certain responses uttered, and
          session durtation to enhance your experience. This information is stored on our server logs. The information from the server logs is used
          anonymously and is not linked to any individual user and contains no personal identifiers accessible to us the developer.
        </p>
        <p>
          {name} uses the information that is collected for the following general purposes: to provide updates to you regarding products and services,
          to fulfill your requests for products and services, improve products and services, contact you, conduct research, and to optimize and
          improve the website.
        </p>
        <p>OWNERSHIP OF CONTENT</p>
        <p>
          You acknowledge and agree that: (i) {name} owns all rights, title and interest in and to all Content posted, generated, or contributed (“the
          Content”) to the Alexa skill by You or other users; and (ii) nothing in this Agreement will confer You any right of ownership in the Content
          or any license to any Content other than the Rights expressly granted in this Agreement.
        </p>
        <p>EMAILS</p>
        <p>
          We will occasionally send e-mails to you. This is required for certain uses of the Alexa skill. We may also send information to you
          regarding your account activity and purchases as well as updates about our products and promotional offers. You may elect to opt-out of
          receiving promotional emails at any time.
        </p>
        <p>
          <strong>{'{THIS SECTION IS IF THE USER SAID NOT A CHILDREN’S SKILL}'}</strong>
        </p>
        <p>CHILDREN</p>
        <p>
          {name} does not design any part of its Alexa skill to attract anyone under age 13. {name} will not knowingly contact children under age 13
          without a parent's permission. {name} does not knowingly ask a child under age 13 for any personal information.
        </p>
        <p>
          <strong>{'{THIS SECTION IS IF THE USER SAID NOT A CHILDREN’S SKILL}'}</strong>
        </p>
        <p>CHILDREN</p>
        <p>
          {name} does not store any data on users under the age of 13. Temporary data collected by {name} from users under age 13 is non-identifiable,
          anonymous, and immediately discarded following the service session.
        </p>
        <p>INFORMATION SHARING AND DISCLOSURE</p>
        <p>
          {name} does not rent, sell or share personal information about you with other people or companies except under the following circumstances:
        </p>
        <p>- We provide shipping information to our shippers so that they may deliver products to you.</p>
        <p>- We respond to subpoenas, court orders, or legal process, or to establish or exercise our legal rights or defend against legal claims.</p>
        <p>
          - We share information with law enforcement agencies in order to investigate, prevent, or take action regarding illegal activities,
          suspected fraud, suspected copyright infringement, situations involving potential threats to the physical safety of any person, or as
          otherwise required by law.
        </p>
        <p>CONFIDENTIALITY AND SECURITY</p>
        <p>
          We limit access to personal information about you to only those we believe reasonably need to come into contact with that information to
          provide our products or services to you. We have physical, electronic, and procedural safeguards to protect personal information about you.
        </p>
        <p>CHANGES TO THIS PRIVACY POLICY</p>
        <p>
          This policy will be changed from time to time to adapt to the changing needs of the society and the law. We will notify you about
          significant changes in the way we treat personal information by amending this Privacy Policy on the website.
        </p>
      </div>
    );
  }
}

export default Legal;
