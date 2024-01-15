export const CMS_FUNCTION_DEFAULT_CODE = `export default async function main(args) {
  const { inputVars } = args;
  const responseText = "Hello World";

  return {
    trace: [
      {
        type: "text",
        payload: {
          message: \`\${responseText}\`,
        },
      },
    ],
  };
}`;
