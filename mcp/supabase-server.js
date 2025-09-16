#!/usr/bin/env node

const { Server } = require('../node_modules/@modelcontextprotocol/sdk/dist/cjs/server')
const { StdioServerTransport } = require('../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/stdio')
const { createClient } = require('@supabase/supabase-js')

const server = new Server(
  {
    name: 'supabase-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Security functions
function validateInput(input, type) {
  if (typeof input !== 'string') return false

  switch (type) {
    case 'table':
      // Allow only alphanumeric, underscores, and hyphens
      return /^[a-zA-Z0-9_-]+$/.test(input)
    case 'column':
      // Allow only alphanumeric, underscores, and hyphens
      return /^[a-zA-Z0-9_-]+$/.test(input)
    case 'query':
      // Basic SQL injection prevention
      const dangerousPatterns = [
        /;\s*drop\s+/i,
        /;\s*delete\s+/i,
        /;\s*update\s+/i,
        /;\s*insert\s+/i,
        /;\s*create\s+/i,
        /;\s*alter\s+/i,
        /;\s*truncate\s+/i,
        /union\s+select/i,
        /exec\s*\(/i,
        /xp_cmdshell/i,
        /--/,
        /\/\*/,
        /\*\//
      ]
      return !dangerousPatterns.some(pattern => pattern.test(input))
    default:
      return true
  }
}

function sanitizeJsonInput(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    // Remove any potentially dangerous properties
    const sanitized = JSON.parse(JSON.stringify(parsed, (key, value) => {
      if (typeof value === 'string') {
        // Remove potential script tags and dangerous content
        return value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
      }
      return value
    }))
    return JSON.stringify(sanitized)
  } catch (error) {
    throw new Error('Invalid JSON input')
  }
}

function logOperation(operation, table, userId = null) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    operation,
    table,
    userId,
    level: 'INFO'
  }
  console.error(`[SUPABASE_MCP_AUDIT] ${JSON.stringify(logEntry)}`)
}

server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'supabase_query',
        description: 'Execute a SQL query on Supabase',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'SQL query to execute',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'supabase_select',
        description: 'Select data from a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
            columns: {
              type: 'string',
              description: 'Columns to select (comma-separated)',
            },
            filters: {
              type: 'string',
              description: 'Where clause filters (JSON format)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of rows to return',
            },
            offset: {
              type: 'number',
              description: 'Number of rows to skip',
            },
            order: {
              type: 'string',
              description: 'Order by column (format: "column.asc" or "column.desc")',
            },
          },
          required: ['table'],
        },
      },
      {
        name: 'supabase_insert',
        description: 'Insert data into a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
            data: {
              type: 'string',
              description: 'JSON data to insert',
            },
            returning: {
              type: 'string',
              description: 'Columns to return after insert (comma-separated)',
            },
          },
          required: ['table', 'data'],
        },
      },
      {
        name: 'supabase_update',
        description: 'Update data in a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
            data: {
              type: 'string',
              description: 'JSON data to update',
            },
            filters: {
              type: 'string',
              description: 'Where clause filters (JSON format)',
            },
            returning: {
              type: 'string',
              description: 'Columns to return after update (comma-separated)',
            },
          },
          required: ['table', 'data'],
        },
      },
      {
        name: 'supabase_delete',
        description: 'Delete data from a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
            filters: {
              type: 'string',
              description: 'Where clause filters (JSON format)',
            },
            returning: {
              type: 'string',
              description: 'Columns to return after delete (comma-separated)',
            },
          },
          required: ['table'],
        },
      },
      {
        name: 'supabase_create_table',
        description: 'Create a new table in Supabase',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
            columns: {
              type: 'string',
              description: 'Column definitions (JSON format)',
            },
            constraints: {
              type: 'string',
              description: 'Table constraints (JSON format)',
            },
          },
          required: ['table', 'columns'],
        },
      },
      {
        name: 'supabase_list_tables',
        description: 'List all tables in the database',
        inputSchema: {
          type: 'object',
          properties: {
            schema: {
              type: 'string',
              description: 'Schema name (default: public)',
            },
          },
        },
      },
      {
        name: 'supabase_table_info',
        description: 'Get table structure and information',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
            schema: {
              type: 'string',
              description: 'Schema name (default: public)',
            },
          },
          required: ['table'],
        },
      },
      {
        name: 'broker_create_broker',
        description: 'Create a new broker record',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Broker name',
            },
            description: {
              type: 'string',
              description: 'Broker description',
            },
            website: {
              type: 'string',
              description: 'Broker website URL',
            },
            logo_url: {
              type: 'string',
              description: 'Broker logo URL',
            },
            rating: {
              type: 'number',
              description: 'Broker rating (1-5)',
            },
            min_deposit: {
              type: 'string',
              description: 'Minimum deposit amount',
            },
            spread: {
              type: 'string',
              description: 'Spread information',
            },
            regulation: {
              type: 'string',
              description: 'Regulatory information',
            },
            features: {
              type: 'string',
              description: 'Broker features (JSON array)',
            },
            affiliate_link: {
              type: 'string',
              description: 'Affiliate link',
            },
          },
          required: ['name', 'description'],
        },
      },
      {
        name: 'broker_get_brokers',
        description: 'Get broker records with filtering and sorting',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of brokers to return',
            },
            offset: {
              type: 'number',
              description: 'Number of brokers to skip',
            },
            min_rating: {
              type: 'number',
              description: 'Minimum rating filter',
            },
            regulation: {
              type: 'string',
              description: 'Regulation filter',
            },
            sort_by: {
              type: 'string',
              description: 'Sort field (rating, name, min_deposit)',
              enum: ['rating', 'name', 'min_deposit'],
            },
            sort_order: {
              type: 'string',
              description: 'Sort order',
              enum: ['asc', 'desc'],
            },
          },
        },
      },
      {
        name: 'broker_create_review',
        description: 'Create a broker review',
        inputSchema: {
          type: 'object',
          properties: {
            broker_id: {
              type: 'number',
              description: 'Broker ID',
            },
            user_id: {
              type: 'string',
              description: 'User ID',
            },
            rating: {
              type: 'number',
              description: 'Review rating (1-5)',
            },
            title: {
              type: 'string',
              description: 'Review title',
            },
            content: {
              type: 'string',
              description: 'Review content',
            },
            pros: {
              type: 'string',
              description: 'Pros (JSON array)',
            },
            cons: {
              type: 'string',
              description: 'Cons (JSON array)',
            },
            trading_experience: {
              type: 'string',
              description: 'Trading experience',
            },
            account_type: {
              type: 'string',
              description: 'Account type',
            },
          },
          required: ['broker_id', 'user_id', 'rating', 'title', 'content'],
        },
      },
      {
        name: 'broker_get_reviews',
        description: 'Get broker reviews with filtering',
        inputSchema: {
          type: 'object',
          properties: {
            broker_id: {
              type: 'number',
              description: 'Filter by broker ID',
            },
            user_id: {
              type: 'string',
              description: 'Filter by user ID',
            },
            min_rating: {
              type: 'number',
              description: 'Minimum rating filter',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of reviews to return',
            },
            offset: {
              type: 'number',
              description: 'Number of reviews to skip',
            },
          },
        },
      },
      {
        name: 'broker_create_educational_content',
        description: 'Create educational content',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Content title',
            },
            description: {
              type: 'string',
              description: 'Content description',
            },
            content: {
              type: 'string',
              description: 'Content body',
            },
            type: {
              type: 'string',
              description: 'Content type',
              enum: ['article', 'video', 'course', 'guide'],
            },
            category: {
              type: 'string',
              description: 'Content category',
            },
            difficulty: {
              type: 'string',
              description: 'Difficulty level',
              enum: ['Beginner', 'Intermediate', 'Advanced'],
            },
            duration: {
              type: 'string',
              description: 'Content duration',
            },
            author: {
              type: 'string',
              description: 'Content author',
            },
            tags: {
              type: 'string',
              description: 'Content tags (JSON array)',
            },
          },
          required: ['title', 'description', 'content', 'type', 'category'],
        },
      },
      {
        name: 'broker_get_educational_content',
        description: 'Get educational content with filtering',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Filter by content type',
              enum: ['article', 'video', 'course', 'guide'],
            },
            category: {
              type: 'string',
              description: 'Filter by category',
            },
            difficulty: {
              type: 'string',
              description: 'Filter by difficulty',
              enum: ['Beginner', 'Intermediate', 'Advanced'],
            },
            author: {
              type: 'string',
              description: 'Filter by author',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of items to return',
            },
            offset: {
              type: 'number',
              description: 'Number of items to skip',
            },
          },
        },
      },
    ],
  }
})

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'supabase_query':
        if (!validateInput(args.query, 'query')) {
          throw new Error('Invalid query input - potential SQL injection detected')
        }
        logOperation('QUERY', 'custom', args.user_id)
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: args.query })
        if (error) throw error
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        }

      case 'supabase_select':
        if (!validateInput(args.table, 'table')) {
          throw new Error('Invalid table name')
        }
        if (args.columns && !validateInput(args.columns, 'column')) {
          throw new Error('Invalid column name')
        }
        logOperation('SELECT', args.table, args.user_id)

        let query = supabase.from(args.table).select(args.columns || '*')

        if (args.filters) {
          const sanitizedFilters = sanitizeJsonInput(args.filters)
          const filters = JSON.parse(sanitizedFilters)
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }

        if (args.limit) {
          query = query.limit(Math.min(args.limit, 1000)) // Limit to 1000 records
        }

        if (args.offset) {
          query = query.offset(args.offset)
        }

        if (args.order) {
          const [column, direction] = args.order.split('.')
          if (validateInput(column, 'column')) {
            query = query.order(column, { ascending: direction === 'asc' })
          }
        }

        const { data: selectData, error: selectError } = await query
        if (selectError) throw selectError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(selectData, null, 2),
            },
          ],
        }

      case 'supabase_insert':
        if (!validateInput(args.table, 'table')) {
          throw new Error('Invalid table name')
        }
        logOperation('INSERT', args.table, args.user_id)

        const sanitizedInsertData = sanitizeJsonInput(args.data)
        let insertQuery = supabase.from(args.table).insert(JSON.parse(sanitizedInsertData))
        if (args.returning) {
          insertQuery = insertQuery.select(args.returning)
        }
        const { data: insertData, error: insertError } = await insertQuery
        if (insertError) throw insertError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(insertData, null, 2),
            },
          ],
        }

      case 'supabase_update':
        if (!validateInput(args.table, 'table')) {
          throw new Error('Invalid table name')
        }
        logOperation('UPDATE', args.table, args.user_id)

        const sanitizedUpdateData = sanitizeJsonInput(args.data)
        let updateQuery = supabase.from(args.table).update(JSON.parse(sanitizedUpdateData))

        if (args.filters) {
          const sanitizedFilters = sanitizeJsonInput(args.filters)
          const filters = JSON.parse(sanitizedFilters)
          Object.entries(filters).forEach(([key, value]) => {
            updateQuery = updateQuery.eq(key, value)
          })
        }

        if (args.returning) {
          updateQuery = updateQuery.select(args.returning)
        }

        const { data: updateData, error: updateError } = await updateQuery
        if (updateError) throw updateError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updateData, null, 2),
            },
          ],
        }

      case 'supabase_delete':
        if (!validateInput(args.table, 'table')) {
          throw new Error('Invalid table name')
        }
        logOperation('DELETE', args.table, args.user_id)

        let deleteQuery = supabase.from(args.table).delete()

        if (args.filters) {
          const sanitizedFilters = sanitizeJsonInput(args.filters)
          const filters = JSON.parse(sanitizedFilters)
          Object.entries(filters).forEach(([key, value]) => {
            deleteQuery = deleteQuery.eq(key, value)
          })
        }

        if (args.returning) {
          deleteQuery = deleteQuery.select(args.returning)
        }

        const { data: deleteData, error: deleteError } = await deleteQuery
        if (deleteError) throw deleteError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(deleteData, null, 2),
            },
          ],
        }

      case 'supabase_create_table':
        const columns = JSON.parse(args.columns)
        const constraints = args.constraints ? JSON.parse(args.constraints) : {}

        let createSQL = `CREATE TABLE ${args.table} (`
        createSQL += Object.entries(columns)
          .map(([name, def]) => `${name} ${def.type}${def.nullable === false ? ' NOT NULL' : ''}${def.default !== undefined ? ` DEFAULT ${def.default}` : ''}`)
          .join(', ')

        if (constraints.primaryKey) {
          createSQL += `, PRIMARY KEY (${constraints.primaryKey.join(', ')})`
        }

        if (constraints.foreignKeys) {
          constraints.foreignKeys.forEach(fk => {
            createSQL += `, FOREIGN KEY (${fk.column}) REFERENCES ${fk.references}(${fk.column})`
          })
        }

        createSQL += ')'

        const { data: createData, error: createError } = await supabase.rpc('exec_sql', { sql_query: createSQL })
        if (createError) throw createError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ message: 'Table created successfully', result: createData }, null, 2),
            },
          ],
        }

      case 'supabase_list_tables':
        const listSQL = args.schema
          ? `SELECT table_name FROM information_schema.tables WHERE table_schema = '${args.schema}'`
          : `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

        const { data: listData, error: listError } = await supabase.rpc('exec_sql', { sql_query: listSQL })
        if (listError) throw listError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(listData, null, 2),
            },
          ],
        }

      case 'supabase_table_info':
        const schema = args.schema || 'public'
        const infoSQL = `
          SELECT
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length,
            numeric_precision,
            numeric_scale
          FROM information_schema.columns
          WHERE table_schema = '${schema}' AND table_name = '${args.table}'
          ORDER BY ordinal_position
        `

        const { data: infoData, error: infoError } = await supabase.rpc('exec_sql', { sql_query: infoSQL })
        if (infoError) throw infoError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(infoData, null, 2),
            },
          ],
        }

      case 'broker_create_broker':
        logOperation('CREATE_BROKER', 'brokers', args.user_id)

        // Sanitize string inputs
        const brokerData = {
          name: args.name.replace(/[<>\"']/g, ''),
          description: args.description.replace(/[<>\"']/g, ''),
          website: args.website ? args.website.replace(/[<>\"']/g, '') : null,
          logo_url: args.logo_url ? args.logo_url.replace(/[<>\"']/g, '') : null,
          rating: Math.min(Math.max(args.rating || 0, 0), 5), // Clamp between 0-5
          min_deposit: args.min_deposit || null,
          spread: args.spread || null,
          regulation: args.regulation ? args.regulation.replace(/[<>\"']/g, '') : null,
          features: args.features ? JSON.parse(sanitizeJsonInput(args.features)) : [],
          affiliate_link: args.affiliate_link ? args.affiliate_link.replace(/[<>\"']/g, '') : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: newBroker, error: brokerError } = await supabase
          .from('brokers')
          .insert(brokerData)
          .select()
        if (brokerError) throw brokerError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newBroker, null, 2),
            },
          ],
        }

      case 'broker_get_brokers':
        logOperation('GET_BROKERS', 'brokers', args.user_id)

        let brokerQuery = supabase.from('brokers').select('*')

        if (args.min_rating) {
          brokerQuery = brokerQuery.gte('rating', Math.max(0, Math.min(5, args.min_rating)))
        }

        if (args.regulation) {
          const sanitizedRegulation = args.regulation.replace(/[<>\"']/g, '')
          brokerQuery = brokerQuery.ilike('regulation', `%${sanitizedRegulation}%`)
        }

        if (args.limit) {
          brokerQuery = brokerQuery.limit(Math.min(args.limit, 100))
        }

        if (args.offset) {
          brokerQuery = brokerQuery.offset(args.offset)
        }

        if (args.sort_by) {
          const sortOrder = args.sort_order === 'desc' ? { ascending: false } : { ascending: true }
          brokerQuery = brokerQuery.order(args.sort_by, sortOrder)
        } else {
          brokerQuery = brokerQuery.order('rating', { ascending: false })
        }

        const { data: brokers, error: brokersError } = await brokerQuery
        if (brokersError) throw brokersError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(brokers, null, 2),
            },
          ],
        }

      case 'broker_create_review':
        logOperation('CREATE_REVIEW', 'broker_reviews', args.user_id)

        const reviewData = {
          broker_id: args.broker_id,
          user_id: args.user_id,
          rating: Math.min(Math.max(args.rating, 1), 5), // Clamp between 1-5
          title: args.title.replace(/[<>\"']/g, ''),
          content: args.content.replace(/[<>\"']/g, ''),
          pros: args.pros ? JSON.parse(sanitizeJsonInput(args.pros)) : [],
          cons: args.cons ? JSON.parse(sanitizeJsonInput(args.cons)) : [],
          trading_experience: args.trading_experience ? args.trading_experience.replace(/[<>\"']/g, '') : null,
          account_type: args.account_type ? args.account_type.replace(/[<>\"']/g, '') : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: newReview, error: reviewError } = await supabase
          .from('broker_reviews')
          .insert(reviewData)
          .select()
        if (reviewError) throw reviewError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newReview, null, 2),
            },
          ],
        }

      case 'broker_get_reviews':
        logOperation('GET_REVIEWS', 'broker_reviews', args.user_id)

        let reviewQuery = supabase.from('broker_reviews').select('*')

        if (args.broker_id) {
          reviewQuery = reviewQuery.eq('broker_id', args.broker_id)
        }

        if (args.user_id) {
          reviewQuery = reviewQuery.eq('user_id', args.user_id)
        }

        if (args.min_rating) {
          reviewQuery = reviewQuery.gte('rating', Math.max(0, Math.min(5, args.min_rating)))
        }

        if (args.limit) {
          reviewQuery = reviewQuery.limit(Math.min(args.limit, 100))
        }

        if (args.offset) {
          reviewQuery = reviewQuery.offset(args.offset)
        }

        reviewQuery = reviewQuery.order('created_at', { ascending: false })

        const { data: reviews, error: reviewsError } = await reviewQuery
        if (reviewsError) throw reviewsError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(reviews, null, 2),
            },
          ],
        }

      case 'broker_create_educational_content':
        logOperation('CREATE_EDUCATIONAL_CONTENT', 'educational_content', args.user_id)

        const educationalData = {
          title: args.title.replace(/[<>\"']/g, ''),
          description: args.description.replace(/[<>\"']/g, ''),
          content: args.content.replace(/[<>\"']/g, ''),
          type: args.type,
          category: args.category.replace(/[<>\"']/g, ''),
          difficulty: args.difficulty || 'Beginner',
          duration: args.duration ? args.duration.replace(/[<>\"']/g, '') : null,
          author: args.author ? args.author.replace(/[<>\"']/g, '') : null,
          tags: args.tags ? JSON.parse(sanitizeJsonInput(args.tags)) : [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: newContent, error: contentError } = await supabase
          .from('educational_content')
          .insert(educationalData)
          .select()
        if (contentError) throw contentError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newContent, null, 2),
            },
          ],
        }

      case 'broker_get_educational_content':
        logOperation('GET_EDUCATIONAL_CONTENT', 'educational_content', args.user_id)

        let contentQuery = supabase.from('educational_content').select('*')

        if (args.type) {
          contentQuery = contentQuery.eq('type', args.type)
        }

        if (args.category) {
          contentQuery = contentQuery.eq('category', args.category)
        }

        if (args.difficulty) {
          contentQuery = contentQuery.eq('difficulty', args.difficulty)
        }

        if (args.author) {
          contentQuery = contentQuery.eq('author', args.author)
        }

        if (args.limit) {
          contentQuery = contentQuery.limit(Math.min(args.limit, 100))
        }

        if (args.offset) {
          contentQuery = contentQuery.offset(args.offset)
        }

        contentQuery = contentQuery.order('created_at', { ascending: false })

        const { data: educationalContent, error: educationalContentError } = await contentQuery
        if (educationalContentError) throw educationalContentError
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(educationalContent, null, 2),
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
  console.error('Supabase MCP server started')
}

main().catch(console.error)