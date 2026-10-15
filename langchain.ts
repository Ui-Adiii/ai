import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxTokens: 500,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

const generateContent = async (input: string) => {
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant. Answer the user's question clearly and concisely.",
    },

    {
      role: "user",
      content: input,
    },
  ]);
  return response.content.toString();
};
// console.log(await generateContent("hey what'up "));
const streamContent = async (input: string) => {
  const response = await llm.stream([{
    role: "system",
    content:
      "You are a helpful assistant. Answer the user's question clearly and concisely.",
  },
    {
      role: "user",
      content: input,
  }]);

  for await (const chunk of response) {
    if (typeof chunk.content === "string") {
      process.stdout.write(chunk.content);
    }
  }

  console.log("\n");
  // return full;
};


await streamContent("explain java ")
