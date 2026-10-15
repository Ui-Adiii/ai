import { streamObject, streamText } from "ai";
import { z } from "zod";
import getModel from "./ai.config";

const model = getModel();

const streamTextGenerator = async (prompt: string) => {
  const { textStream } = streamText({
    model,
    prompt,
  });
  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
};
// await streamTextGenerator('tell me about java in 2 lines ')

const objectSchema = z.object({
  name: z.string(),
  email: z.string(),
  age: z.number(),
  password: z.string(),
});
const generateObjectResponse = async (prompt: string, schema: z.ZodType) => {
  const result = streamObject({
    model,
    schema,
    prompt,
  });
  for await (const partialObject of result.partialObjectStream) {
    console.clear();
    console.log(partialObject);
  }
};

// generateObjectResponse("gave a user data",objectSchema)

const arraySchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const generateArrayResponse = async (prompt: string, schema: z.ZodType) => {
  const result = await streamObject({
    model,
    prompt,
    output: "array",
    schema,
  });
  for await (const partialObject of result.elementStream) {
    console.log(partialObject);
  }
};

// await generateArrayResponse("generate random 5 response of backend",arraySchema)
