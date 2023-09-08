import queryString from 'query-string';
import React from 'react';

const Legal = ({ location }) => {
  const values = queryString.parse(location.search);
  const name = values.name || 'John Doe';
  const skill = values.skill || 'Skill';
  const date = values.date || 'November 14, 2019';
  const { children } = values;

  return (
    <div className="overflow-auto p-2">
      <h1>Terms of Service and Privacy Policy</h1>
      <p>Last Updated: {date}</p>
      <p>
        Welcome to the {skill} application (“App”), operated by {name}.
      </p>
      <p>
        At {name}, we offer services and content through our applications. We provide services to you subject to the following notices, terms, and
        conditions (the “Terms”).
      </p>
      <p>
        Please read these terms carefully. These terms, as modified or amended from time to time, are a binding contract between {name} (“we” and/or
        “us”, etc.) and you ("you”).
      </p>
      <p>
        You may only use the {skill} App operated by {name} if you first accept these terms.
      </p>
      <p>
        In addition, when you use any current or future {name} service or visit or purchase from any business affiliated with {name}, whether or not
        included in the App, you also will be subject to the guidelines and conditions applicable to such service or business. If these terms are
        inconsistent with {name}’s terms, such terms will prevail.
      </p>
      <p>
        If you create an account on the App, you are responsible for maintaining the security of your account and data, and you are fully responsible
        for all activities that occur under the account. You must immediately notify {name} of any unauthorized uses of your data, your account or any
        other breaches of security. You may not use the account, username, or password of another user at any time or disclosing your password to any
        third party or permitting any third party to access your account;
      </p>
      <p>PRIVACY POLICY INCORPORATED HEREIN</p>
      <p>
        {name} values your privacy and will adhere to its Privacy Policy in order to ensure that your experience is a pleasant one. Please read our
        Privacy Policy, which is incorporated into the herein Terms. We reserve the right to contact you in connection with your compliance or {name}
        ’s compliance with and performance of these Terms (including without limitation the license rights granted hereunder) or any Content or
        activities relating to the App. You acknowledge that {name} may preserve Content and may also disclose Content if required to do so by law or
        in the good faith belief that such preservation or disclosure is reasonably necessary to: (a) comply with legal process; (b) enforce these
        Terms; (c) respond to claims that any Content violates the rights of third parties; or (d) protect the rights, property, or personal safety of{' '}
        {name}, App users, and the public.
      </p>
      <p>WHAT THIS PRIVACY POLICY COVERS</p>
      <p>
        This policy covers how {name} treats personal information that is collected or received through the services we provide. Personal information
        is information about you that is personally identifiable like your name, address, email address, or phone number, and any information that is
        not otherwise publicly available. This policy does not apply to the practices of companies that we do not own or control, or to people that we
        do not employ or manage. Companies such as our Internet access, website and email hosting company, Facebook, and others have their own privacy
        statements which can be viewed on their respective websites.
      </p>
      <p>INFORMATION COLLECTION AND USE</p>
      <p>
        {name} collects personal information when you contract with us to use or purchase our services. When you contract with us for a particular
        service, we will ask you to provide us with your name, email address, and phone number.
      </p>
      <p>
        The {name} App may from time to time collect App usage information such as the number of sessions, certain responses, and session duration,
        for the purpose of enhancing your experience. This information is stored on our server logs. The information from the server logs is used
        anonymously and is not linked to any individual user and contains no personal identifiers accessible to us the developer. {name} uses the
        information that is collected for the following general purposes: to provide updates to you regarding products and services, to fulfill your
        requests for products and services, improve products and services, contact you, conduct research, and to optimize and improve the App.
      </p>
      <p>OWNERSHIP OF CONTENT</p>
      <p>
        You acknowledge and agree that: (i) {name} owns all rights, title and interest in and to all Content posted, generated, or contributed (“the
        Content”) to the App by You or other users; and (ii) nothing in this Agreement will confer You any right of ownership in the Content or any
        license to any Content other than the Rights expressly granted in this Agreement.
      </p>
      <p>EMAILS</p>
      <p>
        We may occasionally send emails to you. This is required for certain uses of the App. We may also send information to you regarding your
        account activity and purchases as well as updates about our products and promotional offers. You may elect to opt-out of receiving promotional
        emails at any time.
      </p>
      {children === 'true' && (
        <>
          <p>CHILDREN</p>
          <p>
            {skill} does not store any data on users under the age of 13. Temporary data collected by {skill} from users under age 13 is
            non-identifiable, anonymous, and immediately discarded following the service session.
          </p>
        </>
      )}
      {children === 'false' && (
        <>
          <p>CHILDREN</p>
          <p>
            {skill} does not design any part of its App to attract anyone under age 13. {skill} will not knowingly contact children under age 13
            without a parent's permission. {skill} does not knowingly ask a child under age 13 for any personal information.
          </p>
        </>
      )}
      <p>INFORMATION SHARING AND DISCLOSURE</p>
      <p>
        {name} does not rent, sell or share personal information about you with other people or companies except under the following circumstances:
      </p>
      - We provide shipping information to our shippers so that they may deliver products to you. - We respond to subpoenas, court orders, or legal
      process, or to establish or exercise our legal rights or defend against legal claims. - We share information with law enforcement agencies in
      order to investigate, prevent, or take action regarding illegal activities, suspected fraud, suspected copyright infringement, situations
      involving potential threats to the physical safety of any person, or as otherwise required by law.
      <p>CONFIDENTIALITY AND SECURITY</p>
      <p>
        We limit access to personal information about you to only those we believe reasonably need to come into contact with that information to
        provide our products or services to you. We have physical, electronic, and procedural safeguards to protect personal information about you.
      </p>
      <p>CHANGES TO THIS PRIVACY POLICY</p>
      <p>
        This policy will be changed from time to time to adapt to the changing needs of the society and the law. We will notify you about significant
        changes in the way we treat personal information by amending this Privacy Policy linked on the App.
      </p>
      <p>ORDERING OF SERVICES; CONDUCT OF SERVICES</p>
      <p>
        If you choose to order a product or service through the App, we will make best efforts to provide that service or product to the best of our
        ability. However, we make no warranty with regards to your satisfaction with any service or product in general. You will receive access to
        reading content created by others, which access can be revoked at our discretion. Prices for services where applicable will be listed on the
        App and may change from time to time.
      </p>
      <p>CONTENT</p>
      <p>Content may be removed from the App without prior notice to ensure quality standards are maintained.</p>
      <p>CUSTOMER SUPPORT</p>
      <p>
        You may contact {name} Customer Services by sending an email to the provided contact on the distribution app store. You acknowledge that the
        provision of customer support is at {name}’s sole discretion, and that {name} shall have no obligation to provide you with customer support of
        any kind. We may provide you with customer support from time to time, at our sole discretion, and the provision of some level of support is no
        guarantee of future support.
      </p>
      <p>NOTICE RE NAMES AND TRADEMARKS</p>
      <p>You may not use the name “{name}” or any other names or Trademarks listed on the App or in any App content. All rights are reserved.</p>
      <p>NOTICE RE COPYRIGHT OWNERSHIP: {name}</p>
      <p>
        All rights reserved. All content on the App is subject to intellectual property rights, contractual rights or other protections. The
        intellectual property rights are owned by {name} or its licensors. No content may be copied, distributed, republished, uploaded, posted or
        transmitted in any way except as provided expressly in the Terms or with the prior express written consent of {name}. Modification or use of
        the materials for any other purpose may violate intellectual property rights. {name} maintains the worldwide, exclusive copyright on all
        content created by its users.
      </p>
      <p>MINIMUM AGE REQUIREMENT</p>
      <p>
        The App is intended for use by persons who are at least 18 years old, or the legal age required to form a binding contract in your
        jurisdiction if that age is greater than 18. By using the App, you represent and warrant that you are at least 18 years old and of legal age
        to form a binding contract. If you are under 18, you may use the App only with the permission and involvement of a parent or guardian.
      </p>
      <p>DEALINGS WITH MERCHANTS; LINKS</p>
      <p>
        The App may contain advertisements, offers, or other links to other Apps and resources of third parties that are not controlled by {name}.
        That information, as well as advertisements, may or may not be or remain wholly accurate. You acknowledge and agree that {name} is not
        responsible or liable for (i) the availability or accuracy of such sites or resources; or (ii) the content, advertising, or products or
        services on or available from such sites or resources. The inclusion of any link on the App does not imply that the linked site is endorsed by{' '}
        {name}. You use the links at your own risk. {name}’s Terms and Privacy Policy are applicable only when you are on its App.
      </p>
      <p>
        Your correspondence or business dealings with, or participation in promotions of, third party merchants or advertisers that are found on or
        through the App or which provide links on the App, including payment and delivery of related goods or services, and any other terms,
        conditions, warranties or representations associated with such dealings, are solely between you and such merchant or advertiser. You waive any
        claim against {name} and agree to hold {name} harmless from any loss or damage of any kind incurred as the result of any such dealings or as
        the result of the presence of such merchants or advertisers on the App.
      </p>
      <p>ELECTRONIC COMMUNICATIONS</p>
      <p>
        You agree to electronic communication for all of your transactions and communication with {name} and the App. You agree that all postings,
        notices, disclosures, or other communications that we provide to you electronically satisfy any legal requirements that such communications be
        in writing.
      </p>
      <p>NOTICES AND CONTACT INFORMATION; COPYRIGHT COMPLAINTS</p>
      <p>
        Except as otherwise provided in these Terms, {name} will give you any notices by posting them on the App, and you agree that such posting will
        constitute effective notice.
      </p>
      <p>
        You authorize {name} to send notices (including without limitation notice of subpoenas or other legal process, if any) via electronic mail as
        well if {name} decides, in its sole discretion, to do so. You agree to keep your address current and that notice provided by {name} to the
        address that you have most recently provided will constitute effective notice. {name}’s address for Legal Notices is:
      </p>
      <p>Kleiman Law Jonathan Kleiman 1235 Bay Street, Suite 700 Toronto, Ontario, M5R 3K4</p>
      <p>
        {name} respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright
        infringement, please provide {name} with written notice.
      </p>
      <p>MODIFICATIONS TO TERMS AND PRIVACY POLICY</p>
      <p>
        You agree that from time to time we may, at our sole discretion, modify, add or remove any or all parts of these Terms and the Privacy Policy.
        Such modifications will be effective immediately upon posting of the modified Terms to the App. Your continued use of the App following the
        posting of changes to these Terms will mean that you accept those changes. We reserve the right from time to time to temporarily or
        permanently modify or discontinue, and restrict or block access to, the App (or any part thereof) without notice.
      </p>
      <p>PROHIBITED CONDUCT</p>
      <p>
        You agree not to do, or attempt to do, any of the following, subject to applicable law: (a) alter information on or obtained from the App
        unless through tools provided on the App by us; (b) tamper with postings, registration information, profiles, submissions or Content of other
        users; (c) use any robot, spider, scraper or other automated means or interface not provided by us to access the App or extract data or gather
        or use information, such as email addresses, available from the App or transmit any unsolicited advertising, "junk mail," "spam," or "chain
        letters"; (d) frame any part of the App, or link to the App, or otherwise make it look like you have a relationship to us or that we have
        endorsed you or your Content for any purpose except as expressly permitted in writing by {name}; (e) impersonate or misrepresent your
        affiliation with any person or entity; (f) bypass or circumvent measures employed to prevent or limit access to any area, content or code of
        the App (except as otherwise expressly permitted by law); (g) take any action which might impose a significant burden (as determined by us) on
        the App’s infrastructure or performance, or send to or otherwise impact us or the App (or anything or anyone else) with harmful, illegal,
        deceptive or disruptive code such as a virus, "spyware," "adware" or other code that could adversely impact the App or any recipient; (h)
        willfully enter incorrect information; (i) post content created by anybody other than yourself.
      </p>
      <p>Furthermore, prohibited content includes anything that:</p>
      <ul style={{ marginTop: 0 }}>
        <li>is patently offensive and promotes racism, bigotry, hatred or physical harm of any kind against any class or individual;</li>
        <li>harasses or advocates harassment of another person;</li>
        <li>exploits people in a sexual or violent manner;</li>
        <li>contains anything sexually suggestive, excessive violence, or offensive subject matter;</li>
        <li>solicits personal information from anyone under 18;</li>
        <li>publicly posts information that poses or creates a privacy or security risk to any person;</li>
        <li>includes information about another person that you have posted without that person's consent;</li>
        <li>violates the privacy rights, publicity rights, copyrights, trademark rights, contract rights or any other rights of any person.</li>
        <li>
          constitutes or promotes information that you know is false or misleading or promotes illegal activities or conduct that is abusive,
          threatening, obscene, defamatory or libelous;
        </li>
        <li>constitutes or promotes an illegal or unauthorized copy of another person's copyrighted work;</li>
        <li>solicits passwords or personal identifying information for commercial or unlawful purposes from other Users;</li>
        <li>involves the transmission of "junk mail," "chain letters," or unsolicited mass mailing, instant messaging, or "spamming";</li>
        <li>
          furthers or promotes any criminal activity or enterprise or provides instructional information about illegal activities including, but not
          limited to making or buying illegal weapons, violating someone's privacy, or providing or creating computer viruses;
        </li>
        <li>
          involves commercial activities and/or sales without prior written consent from {name} such as contests, sweepstakes, barter, advertising, or
          pyramid schemes;
        </li>
        <li>impersonates or attempts to impersonate another user, person or entity.</li>
      </ul>
      <p>PROTECTION OF SITE CONTENT</p>
      <p>
        Our App is protected by Canadian, U.S. and international intellectual property laws, which you agree to respect. All content on the App,
        including but not limited to text, logos, icons, images, graphics, audio clips, compilations, and downloads, as well as the collection,
        arrangement, and assembly of such content, is the exclusive property of {name} or its content suppliers. All software used on the App is the
        property of {name} or its software suppliers.
      </p>
      <p>TERMINATION OR CANCELLATION</p>
      <p>
        You agree that we may, at any time and at our sole discretion, with or without cause or any notice to you, terminate these Terms, your access
        to the App, and/or your Account, or suspend or block your access to the App. You will still be liable for any breaches of these Terms and/or
        obligations incurred before the Terms end. If you use the App after termination of these Terms, that use will constitute your agreement to the
        Terms then posted on the App. {name} may continue to use electronic or printed materials it has created, or has developed specific plans to
        create, that contain such Content according to the terms contained above with respect to removal or modification of Content previously posted
        on the App.
      </p>
      <p>
        The provisions entitled “Notice Re Copyright Ownership " "Indemnification," "Disclaimer of Warranties," “Exclusion Of Damages; Limitation Of
        Liability,” "Additional Terms" and the Privacy Policy will survive termination of these Terms.
      </p>
      <p>INDEMNIFICATION</p>
      <p>
        As a condition of your access to and use of the App, you agree to hold {name}, and its subsidiaries, affiliates, officers, directors,
        employees, agents, attorneys, and suppliers, and each of their respective successors and assigns, harmless from, and indemnify them for, all
        damages, costs, expenses and other liabilities, including but not limited to attorneys' fees and expenses, relating to any claim arising out
        of or related to: (i) your access to and use of the App and the content therein; (ii) your violation of these Terms (including terms
        incorporated into them, e.g., the Privacy Policy), and any applicable law or the rights of another person or party; (iii) any dispute you have
        or claim to have with one or more users of the App; (iv) {name}’s resolution (if any) of any dispute you have or claim to have with one or
        more users of the App; (v) your improper authorization for {name} to collect, use or disclose any data or Content provided by you; and (vi)
        any disclosures made with your permission (including, without limitation, your consent that {name} disclose your personal information and
        other information collected as set forth in our Privacy Policy). Furthermore, you fully understand and agree that: (a) {name} will have the
        right but not the obligation to resolve disputes between users relating to the App and {name}’s resolution of a particular dispute does not a
        create an obligation to resolve any other dispute; and (b)
        {name}’s resolution of a dispute will be final with respect to the App.
      </p>
      <p>PROCEDURE FOR CLAIMS OF COPYRIGHT INFRINGEMENT</p>
      <p>
        If you believe that your work has been copied in a way that constitutes copyright infringement, please provide {name} with the following
        information:
      </p>
      <p>a. An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest;</p>
      <p>b. A description of the copyrighted work that you claim has been infringed upon;</p>
      <p>c. A description of where the material that you claim is infringing is located on the site;</p>
      <p>d. Your address, telephone number, and e-mail address;</p>
      <p>
        e. A statement by you that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;
      </p>
      <p>
        f. A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright
        owner or authorized to act on the copyright owner's behalf.
      </p>
      <p>{name}’s Copyright Agent for notice of claims of copyright infringement on its site can be reached as follows:</p>
      <p>
        Kleiman Law
        <br />
        Jonathan Kleiman
        <br />
        1235 Bay Street, Suite 700 Toronto, Ontario, M5R 3K4
      </p>
      <p>DISCLAIMER OF WARRANTIES</p>
      <p>
        THE APP MAY CONTAIN ADVICE, OPINIONS, INFORMATION, INSTRUCTIONS AND STATEMENTS FROM {name.toUpperCase()}, ITS USERS AND OTHER CONTENT AND
        INFORMATION PROVIDERS. THIS CONTENT IS INTENDED TO BE USED FOR ENTERTAINMENT PURPOSES ONLY. YOU USE THE APP AND CONTENT AT YOUR OWN RISK. THE
        App IS PROVIDED BY {name.toUpperCase()} ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, {name.toUpperCase()}{' '}
        MAKES NO REPRESENTATIONS, WARRANTIES OR CONDITIONS OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE APP OR THE INFORMATION OR
        CONTENT INCLUDED ON THE APP. {name.toUpperCase()} MAKES NO REPRESENTATIONS OR WARRANTIES THAT THE App WILL BE UNINTERRUPTED, ERROR-FREE,
        VIRUS-FREE, SECURE, OR TIMELY. TO THE MAXIMUM EXTENT PERMITTED BY LAW, {name.toUpperCase()} EXPRESSLY DISCLAIMS ALL REPRESENTATIONS,
        WARRANTIES OR CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED REPRESENTATIONS,
      </p>
      <p>
        WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT AND THOSE ARISING FROM A COURSE OF
        DEALING, TRADE, USAGE OR PERFORMANCE. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES, AND THEREFORE SOME OF THE ABOVE
        LIMITATIONS MAY NOT APPLY TO YOU.
      </p>
      <p>EXCLUSION OF DAMAGES; LIMITATION OF LIABILITY</p>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU AGREE THAT NEITHER {name.toUpperCase()}, NOR ITS SUBSIDIARIES, AFFILIATES, OFFICERS, DIRECTORS,
        EMPLOYEES, AGENTS, ATTORNEYS AND SUPPLIERS, NOR EACH OF THEIR RESPECTIVE SUCCESSORS AND ASSIGNS, WILL BE LIABLE TO YOU AND/OR ANY OTHER PERSON
        FOR DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, EXEMPLARY, SPECIAL OR CONSEQUENTIAL DAMAGES, LOST PROFITS, LOST REVENUE, LOSS OF DATA, LOSS OF
        PRIVACY, LOSS OF GOODWILL OR ANY OTHER LOSSES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND EVEN IN THE EVENT OF FAULT, TORT
        (INCLUDING NEGLIGENCE) OR STRICT OR PRODUCT LIABILITY. WITHOUT LIMITING THE FOREGOING, IN NO EVENT WILL THE AGGREGATE LIABILITY TO YOU OF{' '}
        {name} AND ITS SUBSIDIARIES, AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, ATTORNEYS, AND SUPPLIERS AND EACH OF THEIR RESPECTIVE
        SUCCESSORS AND ASSIGNS EXCEED, IN TOTAL, THE AMOUNTS PAID BY YOU TO US.
      </p>
      <p>ADDITIONAL TERMS</p>
      <p>
        a. Severance. If any part of the Terms is held by a court of competent jurisdiction to be invalid or unenforceable, the invalid or
        unenforceable part will be given effect to the greatest extent possible and the remainder will remain in full force and effect, provided that
        the allocation of risks described herein is given effect to the fullest extent possible.
      </p>
      <p>
        b. No Assignment. These Terms (including terms incorporated into them, e.g., the Privacy Policy) are personal to you and you may not transfer,
        assign or delegate them to anyone without the express written permission of {name}. Any attempt by you to assign, transfer or delegate these
        Terms without the express written permission of {name} will be null and void. {name} shall have the right to transfer, assign and/or delegate
        these Terms to one or more third parties without your permission.
      </p>
      <p>
        c. Disputes; Choice of Law; Export Limitations. The App is controlled by us from our offices within Canada, and some aspects and portion of
        the App are hosted at third-party servers within Canada and the United States of America. If you choose to access this App from locations
        outside Canada, you do so at your own risk and you are responsible for compliance with applicable local laws. You may not use or export
        anything from the App in violation of Canadian or U.S. import and/or export laws and regulations or the Terms. By visiting the App, you agree
        that these Terms and all performances and claims of every nature (including without limitation, contract, tort and strict liability) relating
        in any way to any aspect of the App will be resolved by arbitration. Any dispute or claim relating in any way to your visit to the App or to
        products or services sold or distributed by {name} or through the App will be resolved by binding arbitration, rather than in court, except
        that we and you may assert claims in small claims court if the claims qualify.
      </p>
      <p>
        We each agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated or
        representative action. If for any reason a claim proceeds in court rather than in arbitration we each waive any right to a jury trial. We also
        both agree that you or we may bring suit in court to enjoin infringement or other misuse of intellectual property rights.
      </p>
      <p>
        d. Limitations on Actions. Any action concerning any dispute you may have with respect to the App must be commenced within one year after the
        cause of the dispute arises, or the cause of action is barred.
      </p>
      <p>
        e. Paragraph Headings. The paragraph headings in these Terms are included to help make these Terms easier to read and have no binding effect.
      </p>
      <p>
        f. Entire Agreement. These Terms (including terms incorporated into them, e.g., the Privacy Policy) comprise the entire agreement (the "Entire
        Agreement") between you and {name} with respect to the use of the App and supersedes all contemporaneous and prior agreements between the
        parties regarding the subject matter contained herein, and neither party has relied on any representations made by the other that are not
        expressly set forth in the Entire Agreement.
      </p>
      <p>
        g. No Waiver. The failure of {name} to exercise or enforce any right or provision of these Terms, including any failure to act with respect to
        a breach, will not constitute a waiver of such right or provision or {name} right to act with respect to subsequent or similar breaches. We
        suggest that you print out a copy of these Terms for your records.
      </p>
    </div>
  );
};

export default Legal;
