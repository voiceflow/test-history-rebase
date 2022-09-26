import { Collapse, preventDefault, SvgIcon, withProvider } from '@voiceflow/ui';
import React from 'react';
import validUrl from 'valid-url';

import { ControlledGuidedSteps as GuidedSteps, GuidedStepsWrapper } from '@/components/GuidedSteps';
import * as Product from '@/ducks/product';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { useAlexaPublishContext } from '@/platforms/alexa/jobs/publish/hooks';
import AlexaSubmit from '@/platforms/alexa/jobs/submit';

import BasicSkillInfoForm, { BasicSkillInfoDescription } from './components/BasicSkillInfoForm';
import LocalesForm, { LocalesDescription } from './components/LocalesForm';
import PrivacyComplianceForm, { PrivacyComplianceDescription } from './components/PrivacyComplianceForm';
import PrivacyTermsForm, { PrivacyTermsDescription } from './components/PrivacyTermsForm';
import SkillDescriptionForm, { SkillDescriptionDescription } from './components/SkillDescriptionForm';
import SkillInvocationForm, { SkillInvocationDescription } from './components/SkillInvocationForm';
import { ValidationContext, ValidationProvider } from './contexts';

const BLOCKS = [
  {
    title: 'Basic Skill Info',
    content: <BasicSkillInfoForm />,
    description: <BasicSkillInfoDescription />,
  },
  {
    title: 'Skill Description',
    content: <SkillDescriptionForm />,
    description: <SkillDescriptionDescription />,
  },
  {
    title: 'Skill Invocation',
    content: <SkillInvocationForm />,
    description: <SkillInvocationDescription />,
  },
  {
    title: 'Locales',
    content: <LocalesForm />,
    description: <LocalesDescription />,
  },
  {
    title: 'Privacy and Terms',
    content: <PrivacyTermsForm />,
    description: <PrivacyTermsDescription />,
  },
  {
    title: 'Privacy and Compliance',
    content: <PrivacyComplianceForm />,
    description: <PrivacyComplianceDescription />,
  },
];

interface PublishAmazonFormProps {
  onPublish: VoidFunction;
}

const PublishAmazonForm: React.FC<PublishAmazonFormProps> = () => {
  const [saving, setSaving] = React.useState(false);
  const [idCollapse, setIdCollapse] = React.useState(false);

  const validationContext = React.useContext(ValidationContext);

  const isLive = useSelector(ProjectV2.active.isLiveSelector);
  const skillID = useSelector(ProjectV2.active.alexa.ownSkillIDSelector);
  const inReview = useSelector(VersionV2.active.alexa.isInReviewSelector);
  const publishing = useSelector(VersionV2.active.alexa.publishingSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);
  const { onPublish } = useAlexaPublishContext({ submit: true });

  const errorModal = ModalsV2.useModal(ModalsV2.Error);
  const updateAllProductLocales = useDispatch(Product.updateAllProductLocales);

  const validateForm = React.useCallback(async () => {
    const { locales, privacyPolicy, termsAndConditions, keywords = '', forExport, instructions } = publishing ?? {};

    const splitKeywords = keywords.split(',');

    switch (true) {
      case inReview:
        errorModal.openVoid({ error: 'This skill is currently under review and can not be resubmitted' });
        break;
      case privacyPolicy && !validUrl.isUri(privacyPolicy):
        errorModal.openVoid({ error: 'Privacy policy must be a url' });
        break;
      case termsAndConditions && !validUrl.isUri(termsAndConditions):
        errorModal.openVoid({ error: 'Terms and conditions must be a url' });
        break;
      case splitKeywords.length > 30:
        errorModal.openVoid({ error: 'Limited to 30 keywords' });
        break;
      case keywords.length - splitKeywords.length + 1 > 500:
        errorModal.openVoid({ error: 'All keywords must be less than or equal to 30 keywords or 150 characters.' });
        break;
      case !forExport:
        errorModal.openVoid({ error: 'Please Certify Alexa Skill Import/Export in Privacy/Complicance' });
        break;
      case !instructions:
        errorModal.openVoid({ error: 'Please Provide Testing Instructions' });
        break;
      case !locales?.length:
        errorModal.openVoid({ error: 'Please select at least one locale' });
        break;
      default: {
        try {
          setSaving(true);

          await updateAllProductLocales(locales!);

          onPublish();

          setSaving(false);
        } catch (err) {
          setSaving(false);
          throw new Error('Save Error, Publish Settings not Saved');
        }
      }
    }
  }, [errorModal, onPublish, inReview, publishing]);

  const checkValidStep = React.useCallback(
    (stepNumber: number) => {
      const { summary, description, invocationName, smallIcon, largeIcon, category, invocations = [], forExport, instructions } = publishing ?? {};

      switch (stepNumber) {
        case 0:
          return !!(projectName && smallIcon && largeIcon);
        case 1:
          return !!(summary && description && category);
        case 2:
          return !!(invocationName && invocations[0]);
        case 5:
          return !!(forExport && instructions);
        default:
          return true;
      }
    },
    [publishing, projectName]
  );

  return (
    <>
      <div className="subheader-page-container">
        <div>
          <GuidedStepsWrapper centred={false} className="pb-0">
            {inReview && (
              <div className="alert alert-success" role="alert">
                <div className="d-flex justify-content-between align-items-center">
                  This skill currently under review and can not be submitted again or edited
                </div>
              </div>
            )}

            {isLive && (
              <div className="alert alert-success" role="alert">
                <div className="d-flex justify-content-between align-items-center">This skill currently has a live version in production</div>
              </div>
            )}

            {skillID && (
              <div className="alert alert-success" role="alert">
                <div className="d-flex justify-content-between align-items-center">
                  <span>This skill is linked on Amazon Developer Console</span>

                  <div onClick={() => setIdCollapse(!idCollapse)} className="pointer">
                    {idCollapse ? 'Hide' : 'More Info'}{' '}
                    <SvgIcon icon="caretDown" rotation={idCollapse ? 0 : 90} transition="transform" size={10} inline />
                  </div>
                </div>

                <Collapse isOpen={idCollapse}>
                  <hr />
                  <span>Skill ID | </span>
                  <a
                    href={`https://developer.amazon.com/alexa/console/ask/test/${skillID}/development/${publishing!.locales[0].replace('-', '_')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b>{skillID}</b>
                  </a>
                </Collapse>
              </div>
            )}
          </GuidedStepsWrapper>

          <form onSubmit={preventDefault()}>
            <GuidedSteps
              blocks={BLOCKS}
              centred={false}
              checkStep={checkValidStep}
              onComplete={validateForm}
              disabled={saving || inReview}
              preventSubmit={
                !skillID && {
                  message: validationContext?.isValid ? 'You must upload to Amazon at least once on the canvas before submitting for review' : '',
                }
              }
            >
              {({ disabled, submit }) => <AlexaSubmit disabled={disabled || saving} onClick={submit} />}
            </GuidedSteps>
          </form>
        </div>
      </div>
    </>
  );
};

export default withProvider(ValidationProvider)(PublishAmazonForm);
