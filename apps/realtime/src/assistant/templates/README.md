# Template instructions

**The template is just a vf file**.

The template file name convention is `${platform}_${templateTag}.template.json`. Where `platform` is an assistant platform (fe `voiceflow`, `alexa`, etc), and `templateTag` is a tag for the template (fe `dashboard:retailPurchases`, `onboarding:voice`, etc) provided by front-end.

## Creating

1. Go to `creator.voiceflow.com`
2. Create a new assistant
3. Make changes
4. Export assistant as a JSON (VF File) file
5. Move export file into `apps/realtime/src/assistant/templates`
6. Rename exported file. Don't forget about name convention `${platform}_${templateTag}.template.json`

## Updating

1. Go to `creator.voiceflow.com`
2. Create/Open an assistant from a template you want to update
3. Make changes
4. Export assistant as a JSON (VF File) file
5. Move exported file into `apps/realtime/src/assistant/templates`
6. Remove old template file (copy old template file name)
7. Rename exported file to old template file name

## Creating/Updating for a new feature that requires migration

Same as above, but instead of going to `creator.voiceflow.com` create a new env from a feature branch and use it to create/update a template. The created/updated template should be added into feature branch and released at the same time as the feature.
