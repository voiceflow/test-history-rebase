// export const autoCompletePrompt = (
//   transcript: string[]
// ) => `the service AI should answer the user's last question and then try to get an answer to it's previous question

// Transcript:
// AI: would you like to learn more?
// User: how many days are there in a year?
// AI: there are 365 days in a year, would you like to learn more information?

// Transcript:
// AI: I can help with our store hours or finding a product
// User: this is terrible
// AI: I'm sorry to hear that, we can try to improve in the future, are you still interested in store hours or finding a product?

// Transcript:
// ${transcript}
// AI:`;

export const autoCompletePrompt = (
  transcript: string[]
) => `You are writing a conversation between an AI chatbot and a person, the person is labelled P2. AI chatbot shouldn't answer anything it is not confident about or be rude. Below is the transcript between them:
${transcript} 
AI should answer P2's last question unless it is unless it is about [sex, self harm, race, drugs, violence, death, medical advice, financial advice] and then ask for an answer to the AI's previous statement. What should it say?
AI:`;
