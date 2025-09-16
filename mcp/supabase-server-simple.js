#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Basic MCP server implementation
console.log(JSON.stringify({
  jsonrpc: "2.0",
  result: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    serverInfo: {
      name: "supabase-mcp-server",
      version: "1.0.0"
    }
  },
  id: 1
}))

// Handle incoming messages
process.stdin.on('data', (data) => {
  try {
    const message = JSON.parse(data.toString())

    if (message.method === 'tools/list') {
      console.log(JSON.stringify({
        jsonrpc: "2.0",
        result: {
          tools: [
            {
              name: 'supabase_query',
              description: 'Execute a safe SQL query on Supabase',
              inputSchema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'SQL query to execute'
                  }
                },
                required: ['query']
              }
            },
            {
              name: 'supabase_select',
              description: 'Select data from a table',
              inputSchema: {
                type: 'object',
                properties: {
                  table: {
                    type: 'string',
                    description: 'Table name'
                  },
                  columns: {
                    type: 'string',
                    description: 'Columns to select (comma-separated)'
                  },
                  limit: {
                    type: 'number',
                    description: 'Limit results'
                  }
                },
                required: ['table']
              }
            }
          ]
        },
        id: message.id
      }))
    } else if (message.method === 'tools/call') {
      const { name, arguments: args } = message.params

      if (name === 'supabase_query') {
        // Execute query with safety checks
        const { query } = args

        // Basic SQL injection prevention
        const dangerousPatterns = [
          /;\s*drop\s+/i,
          /;\s*delete\s+/i,
          /;\s*update\s+/i,
          /;\s*insert\s+/i,
          /;\s*create\s+/i,
          /;\s*alter\s+/i,
          /;\s*truncate\s+/i
        ]

        if (dangerousPatterns.some(pattern => pattern.test(query))) {
          console.log(JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -1,
              message: "Potentially dangerous query detected"
            },
            id: message.id
          }))
          return
        }

        // Only allow SELECT queries for safety
        if (!query.trim().toLowerCase().startsWith('select')) {
          console.log(JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -1,
              message: "Only SELECT queries are allowed"
            },
            id: message.id
          }))
          return
        }

        supabase.rpc('exec_sql', { sql_query: query })
          .then(result => {
            console.log(JSON.stringify({
              jsonrpc: "2.0",
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(result.data, null, 2)
                  }
                ]
              },
              id: message.id
            }))
          })
          .catch(error => {
            console.log(JSON.stringify({
              jsonrpc: "2.0",
              error: {
                code: -1,
                message: error.message
              },
              id: message.id
            }))
          })
      } else if (name === 'supabase_select') {
        const { table, columns = '*', limit = 100 } = args

        // Validate table name
        if (!/^[a-zA-Z0-9_-]+$/.test(table)) {
          console.log(JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -1,
              message: "Invalid table name"
            },
            id: message.id
          }))
          return
        }

        supabase
          .from(table)
          .select(columns)
          .limit(limit)
          .then(result => {
            console.log(JSON.stringify({
              jsonrpc: "2.0",
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(result.data, null, 2)
                  }
                ]
              },
              id: message.id
            }))
          })
          .catch(error => {
            console.log(JSON.stringify({
              jsonrpc: "2.0",
              error: {
                code: -1,
                message: error.message
              },
              id: message.id
            }))
          })
      } else {
        console.log(JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -1,
            message: `Unknown tool: ${name}`
          },
          id: message.id
        }))
      }
    }
  } catch (error) {
    console.log(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -1,
        message: error.message
      },
      id: message.id || 1
    }))
  }
})