import getModel from "./ai.config";
import { generateObject, generateText } from "ai";
import { z } from "zod";

const model = getModel();
const generateTextFromPrompt = async (prompt: string): Promise<string> => {
  const { text } = await generateText({
    model,
    prompt,
  });
  return text;
};

// const res = await generateTextFromPrompt("hey")


const getEnumResponse = async (text: string) => {
  const result = await generateObject({
    model,
    prompt: `What is the expression of user? ${text}`,
    output: "enum",
    enum: ["good", "angry", "bad"],
  });
  console.log(result.object);
};

// await getEnumResponse("The user is feeling bad");
