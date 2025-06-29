import { config } from "dotenv";
config(); // ✅ Load environment variables from .env

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createPost } from "./mcp.tool.js";
import { z } from "zod";

// ✅ Create MCP server
const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

const app = express();

// ✅ Sample tool to test (keep)
server.tool(
  "addTwoNumbers",
  "Add two numbers",
  {
    a: z.number(),
    b: z.number()
  },
  async (arg) => {
    const { a, b } = arg;
    return {
      content: [
        {
          type: "text",
          text: `The sum of ${a} and ${b} is ${a + b}`
        }
      ]
    };
  }
);

// ✅ Tool for posting to X (Twitter)
server.tool(
  "createPost",
  "Create a post on X (Twitter)",
  {
    status: z.string().optional(),
    text: z.string().optional()
  },
  async (arg) => {
    console.log("🛠️ Tool called with args:", arg); // ✅ Log received args
    const { status, text } = arg;
    return createPost(status || text); // ✅ fallback if Gemini sends "text"
  }
);

// ✅ Track all live connections
const transports = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    delete transports[transport.sessionId];
  });

  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];

  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(3001, () => {
  console.log("🚀 Server is running on http://localhost:3001");
});

// import { config } from "dotenv";
// config(); // ✅ Load environment variables

// import express from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// // import express from "express";
// // import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { createPost } from "./mcp.tool.js";
// import { z } from "zod";

// const server = new McpServer({
//     name: "example-server",
//     version: "1.0.0"
// });

// // ... set up server resources, tools, and prompts ...

// const app = express();


// server.tool(
//     "addTwoNumbers",
//     "Add two numbers",
//     {
//         a: z.number(),
//         b: z.number()
//     },
//     async (arg) => {
//         const { a, b } = arg;
//         return {
//             content: [
//                 {
//                     type: "text",
//                     text: `The sum of ${a} and ${b} is ${a + b}`
//                 }
//             ]
//         }
//     }
// )

// server.tool(
//     "createPost",
//     "Create a post on X formally known as Twitter ", {
//     status: z.string()
// }, async (arg) => {
//     const { status } = arg;
//     return createPost(status);
// })


// // to support multiple simultaneous connections we have a lookup object from
// // sessionId to transport
// const transports = {};

// app.get("/sse", async (req, res) => {
//     const transport = new SSEServerTransport('/messages', res);
//     transports[ transport.sessionId ] = transport;
//     res.on("close", () => {
//         delete transports[ transport.sessionId ];
//     });
//     await server.connect(transport);
// });

// app.post("/messages", async (req, res) => {
//     const sessionId = req.query.sessionId;
//     const transport = transports[ sessionId ];
//     if (transport) {
//         await transport.handlePostMessage(req, res);
//     } else {
//         res.status(400).send('No transport found for sessionId');
//     }
// });

// app.listen(3001, () => {
//     console.log("Server is running on http://localhost:3001");
// });