import { ChatGroq } from "@langchain/groq";
import {
  MessagesAnnotation,
  END,
  START,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

const searchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

const tools = [searchTool];
const toolNode = new ToolNode(tools);

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  maxTokens: 600,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
}).bindTools(tools);

const callLLM = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke([
    {
      role: "system",
      content: `You are an AI assistant.
Use conversation history when relevant.
Use tools for real-time information such as weather,news and generate accurate and small answer,
news, and current events.
For simple conversations, answer directly.`,
    },
    ...state.messages,
  ]);

  return { messages: [response] };
};

const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const lastMessage = state.messages[state.messages.length - 1];
  return lastMessage?.tool_calls?.length >0 ? "tools" : END;
};

const checkpointer = new MemorySaver();

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .compile({ checkpointer });

async function generateContentThroughAgent(prompt: string) {
  const response = await graph.invoke(
    {
      messages: [{ role: "user", content: prompt }],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  console.log(response.messages[response.messages.length - 1]?.content);
}

await generateContentThroughAgent("What is the weather in odisha?");
