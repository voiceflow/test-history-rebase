export const CMS_FUNCTION_DEFAULT_CODE = `export default async function main(arguments) {
  const { inputVars } = arguments;
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
