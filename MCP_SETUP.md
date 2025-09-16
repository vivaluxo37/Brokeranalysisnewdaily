# MCP Server Setup

This project includes MCP (Model Context Protocol) servers for various services:

## Installed MCP Servers

### Official MCP Servers
- **@modelcontextprotocol/server-filesystem** - Filesystem access
- **@modelcontextprotocol/server-memory** - Memory/knowledge graph management
- **@modelcontextprotocol/server-sequential-thinking** - Sequential thinking and problem solving
- **@hisma/server-puppeteer** - Browser automation with Puppeteer

### Custom MCP Servers
- **Context7** (`./mcp/context7-server.js`) - Context management
- **Supabase** (`./mcp/supabase-server.js`) - Database operations
- **Clerk** (`./mcp/clerk-server.js`) - User authentication and management

## Configuration

### Environment Variables

Add the following to your `.env.local` file:

```bash
# Context7
CONTEXT7_API_KEY=your_context7_api_key_here

# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### MCP Configuration

The servers are configured in `mcp-config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"]
    },
    "memory": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sequential-thinking"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["@hisma/server-puppeteer"]
    }
  }
}
```

## Available Tools

### Context7 Server
- `context7_get` - Retrieve context data
- `context7_store` - Store context data
- `context7_search` - Search contexts
- `context7_delete` - Delete context

### Supabase Server
- `supabase_query` - Execute SQL queries
- `supabase_select` - Select data from tables
- `supabase_insert` - Insert data into tables

### Clerk Server
- `clerk_list_users` - List users
- `clerk_get_user` - Get specific user
- `clerk_create_user` - Create new user
- `clerk_update_user` - Update user
- `clerk_delete_user` - Delete user

### Filesystem Server
- File read/write operations
- Directory management
- File system operations

### Memory Server
- Store and retrieve memories
- Knowledge graph management
- Context persistence

### Sequential Thinking Server
- Step-by-step problem solving
- Logical reasoning
- Complex task breakdown

### Puppeteer Server
- Web scraping
- Browser automation
- Screenshot capture
- Form submission

## Usage

To use these MCP servers with Claude Code or other MCP-compatible clients, you'll need to configure your client to connect to these servers using the configuration provided in `mcp-config.json`.

## Starting Custom Servers

For the custom servers (Context7, Supabase, Clerk), you can start them individually:

```bash
# Start Context7 server
node ./mcp/context7-server.js

# Start Supabase server
node ./mcp/supabase-server.js

# Start Clerk server
node ./mcp/clerk-server.js
```

## Troubleshooting

1. **Environment Variables**: Make sure all required environment variables are set
2. **Dependencies**: Ensure all npm packages are installed
3. **Permissions**: Make sure the servers have necessary permissions
4. **Network**: Check network connectivity for external API calls