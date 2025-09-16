#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server')
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio')

const server = new Server(
  {
    name: 'context7-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
)

const context7ApiKey = process.env.CONTEXT7_API_KEY

if (!context7ApiKey) {
  console.error('CONTEXT7_API_KEY environment variable is required')
  process.exit(1)
}

// Simulated Context7 API calls
const context7Api = {
  async getContext(contextId) {
    // This would be replaced with actual Context7 API calls
    return {
      id: contextId,
      data: `Context data for ${contextId}`,
      timestamp: new Date().toISOString(),
    }
  },

  async storeContext(contextData) {
    // This would be replaced with actual Context7 API calls
    return {
      id: `ctx_${Date.now()}`,
      ...contextData,
      stored: true,
    }
  },

  async searchContexts(query) {
    // This would be replaced with actual Context7 API calls
    return {
      results: [
        {
          id: 'ctx_1',
          data: `Search result for: ${query}`,
          relevance: 0.95,
        },
      ],
    }
  },
}

server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'context7_get',
        description: 'Get context data from Context7',
        inputSchema: {
          type: 'object',
          properties: {
            contextId: {
              type: 'string',
              description: 'Context ID to retrieve',
            },
          },
          required: ['contextId'],
        },
      },
      {
        name: 'context7_store',
        description: 'Store context data in Context7',
        inputSchema: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
              description: 'Context data to store (JSON string)',
            },
            metadata: {
              type: 'string',
              description: 'Metadata for the context (JSON string)',
            },
          },
          required: ['data'],
        },
      },
      {
        name: 'context7_search',
        description: 'Search contexts in Context7',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'context7_delete',
        description: 'Delete context from Context7',
        inputSchema: {
          type: 'object',
          properties: {
            contextId: {
              type: 'string',
              description: 'Context ID to delete',
            },
          },
          required: ['contextId'],
        },
      },
    ],
  }
})

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'context7_get':
        const context = await context7Api.getContext(args.contextId)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(context, null, 2),
            },
          ],
        }

      case 'context7_store':
        const storedContext = await context7Api.storeContext({
          data: JSON.parse(args.data),
          metadata: args.metadata ? JSON.parse(args.metadata) : {},
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(storedContext, null, 2),
            },
          ],
        }

      case 'context7_search':
        const searchResults = await context7Api.searchContexts(args.query)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(searchResults, null, 2),
            },
          ],
        }

      case 'context7_delete':
        // This would be replaced with actual Context7 API calls
        return {
          content: [
            {
              type: 'text',
              text: `Context ${args.contextId} marked for deletion`,
            },
          ],
        }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    }
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Context7 MCP server started')
}

main().catch(console.error)