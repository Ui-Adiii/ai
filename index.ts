#!/usr/bin/env bun

import { ChatGroq } from "@langchain/groq";
import { Annotation ,END,START,StateGraph} from "@langchain/langgraph";

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxTokens: 100,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

const State = Annotation.Root({
  prompt: Annotation<string >,
  aiResponse: Annotation<string>
});

const callLLM = async (state:typeof State.State) => {
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant. Answer the user's question clearly and concisely.",
    },

    {
      role: "user",
      content: state.prompt,
    },
  ]);
   
  return {
    aiResponse:response.content.toString()
  };
}

const graph = new StateGraph(State)
  .addNode("llm", callLLM)
  .addEdge(START, "llm")
  .addEdge("llm", END)
  .compile()

const generateContentThroughAgent =async (prompt: string) => { 
  const response = await graph.invoke({
    prompt:prompt
  })
  console.log(response);
} 

await generateContentThroughAgent("tell me about java")