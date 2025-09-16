# BrokerAnalysis.com - Architecture & Development Guide

## Project Overview

BrokerAnalysis.com is a comprehensive Next.js 15 application for forex broker comparison and analysis. The platform provides unbiased broker reviews, educational content, market analysis, and AI-powered trading insights.

### Key Features
- **Broker Comparison**: Compare 100+ regulated forex brokers
- **AI-Powered Analysis**: Groq AI integration for broker data analysis
- **Educational Content**: Comprehensive trading education hub
- **Market News & Analysis**: Real-time market insights
- **User Reviews**: Community-driven broker reviews
- **Trading Tools**: Calculators, charts, and analysis tools

## Technology Stack

### Core Framework
- **Next.js 15.5.3**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe JavaScript
- **Turbopack**: Fast bundler for development and production

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Modern icon library
- **Custom Theme**: Broker-focused color scheme with blue (#15418F) as primary

### AI & ML Integration
- **Groq SDK**: High-performance LLM API for broker analysis
- **Anthropic SDK**: Advanced AI capabilities
- **OpenAI SDK**: Additional AI functionality
- **Custom AI Prompts**: Specialized for trading analysis

### Authentication & Database
- **Clerk**: User authentication and management
- **Supabase**: Database and backend services
- **Prisma**: Database ORM (ready for integration)

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **PostCSS**: CSS processing
- **MCP Servers**: Model Context Protocol for advanced AI integration

## Project Structure

```
brokeranalysis/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── analyze/      # AI analysis endpoint
│   │   ├── components/       # Page-specific components
│   │   ├── lib/              # Utility functions
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   └── ui/               # UI component library
│   └── lib/                  # Shared utilities
│       ├── ai/               # AI integration modules
│       └── utils.ts          # Utility functions
├── mcp/                      # MCP server implementations
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── mcp-config.json          # MCP server configuration
└── .env.local               # Environment variables
```

## Key Components & Architecture

### 1. Header Component (`src/app/components/Header.tsx`)
- **Complex Navigation**: Mega menu with 5 main categories
- **Mobile Responsive**: Adaptive navigation for all screen sizes
- **Search Integration**: Advanced search with popular suggestions
- **User Account**: Login/register functionality with profile dropdown

### 2. Hero Section (`src/app/components/Hero.tsx`)
- **Conversion-Focused**: Search functionality and CTAs
- **Trust Indicators**: Statistics and regulatory badges
- **Background Design**: Custom SVG patterns for visual appeal

### 3. Featured Brokers (`src/app/components/FeaturedBrokers.tsx`)
- **Data Structure**: TypeScript interfaces for broker data
- **Rating System**: Star ratings with review counts
- **Regulation Display**: Visual regulatory status indicators
- **Affiliate Integration**: Click tracking and broker links

### 4. Educational Hub (`src/app/components/EducationalContent.tsx`)
- **Content Management**: Structured educational resources
- **Categorization**: Topic-based organization
- **Difficulty Levels**: Beginner to advanced content
- **Engagement Metrics**: Ratings and enrollment counts

### 5. AI Analysis API (`src/app/api/analyze/route.ts`)
- **Groq Integration**: LLM-powered broker analysis
- **Error Handling**: Comprehensive error management
- **Type Safety**: Request/response validation

## MCP (Model Context Protocol) Integration

### Available MCP Servers
1. **Filesystem Server**: File operations and management
2. **Memory Server**: Knowledge graph and context persistence
3. **Sequential Thinking**: Problem-solving and logical reasoning
4. **Puppeteer Server**: Browser automation and web scraping
5. **Context7 Server**: Custom context management
6. **Supabase Server**: Database operations
7. **Clerk Agent Toolkit**: Official Clerk authentication and user management
8. **Firecrawl Server**: Web scraping and content extraction

### MCP Configuration
- **Location**: `mcp-config.json` (project-level) and `~/.claude.json` (system-level)
- **Environment**: Requires API keys for external services
- **Custom Servers**: Node.js implementations in `./mcp/` directory
- **Official Tools**: Clerk Agent Toolkit for authentication and user management
- **Server Registration**: Use `claude mcp add` commands for proper registration

### Current MCP Server Setup

#### Project Configuration (mcp-config.json)
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
  },
  "customServers": {
    "supabase": {
      "command": "node",
      "args": ["./mcp/supabase-server.js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    },
    "clerk": {
      "command": "npx",
      "args": ["-y", "@clerk/agent-toolkit", "-p=local-mcp"],
      "env": {
        "CLERK_SECRET_KEY": "${CLERK_SECRET_KEY}",
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}"
      }
    },
    "context7": {
      "command": "node",
      "args": ["./mcp/context7-server.js"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
```

#### System Configuration (~/.claude.json)
The MCP servers are registered with the Claude CLI using the following commands:
```bash
# Add MCP servers with proper environment variables
claude mcp add filesystem "npx @modelcontextprotocol/server-filesystem"
claude mcp add memory "npx @modelcontextprotocol/server-memory"
claude mcp add sequential-thinking "npx @modelcontextprotocol/server-sequential-thinking"
claude mcp add puppeteer "npx @hisma/server-puppeteer"
claude mcp add supabase "node ./mcp/supabase-server.js" --env SUPABASE_URL=$SUPABASE_URL --env SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_ROLE_KEY
claude mcp add clerk "npx -y @clerk/agent-toolkit -p local-mcp" --env CLERK_SECRET_KEY=$CLERK_SECRET_KEY --env NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

#### Server Status Check
```bash
# Check MCP server status and connectivity
claude mcp list
```

### MCP Server Implementation Details

#### Custom MCP Servers
1. **Supabase Server** (`./mcp/supabase-server.js`):
   - Comprehensive database operations
   - Broker-specific tools and security features
   - Input validation and SQL injection prevention
   - Environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

2. **Context7 Server** (`./mcp/context7-server.js`):
   - Custom context management
   - Environment variable: `CONTEXT7_API_KEY`

#### Official MCP Servers
1. **Filesystem Server**: `@modelcontextprotocol/server-filesystem`
2. **Memory Server**: `@modelcontextprotocol/server-memory`
3. **Sequential Thinking**: `@modelcontextprotocol/server-sequential-thinking`
4. **Puppeteer Server**: `@hisma/server-puppeteer`
5. **Clerk Agent Toolkit**: `@clerk/agent-toolkit`
6. **Firecrawl Server**: `firecrawl-mcp`

### MCP Troubleshooting

#### Common Issues
1. **Server Visibility**: If servers don't appear in `claude mcp list`, ensure they're properly registered
2. **Environment Variables**: Verify all required environment variables are set in `.env.local`
3. **SDK Conflicts**: Multiple MCP SDK versions can cause import issues
4. **Module Resolution**: Use correct import paths for MCP SDK modules

#### Troubleshooting Commands
```bash
# Check server registration
claude mcp list

# Remove and re-add servers
claude mcp remove <server-name>
claude mcp add <server-name> "<command>" --env KEY=value

# Check environment variables
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env);"

# Test individual server
node ./mcp/supabase-server.js
```

#### Environment Variables Required
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Context7
CONTEXT7_API_KEY=your-context7-api-key
```

## AI Agents Integration

### Overview

The project includes access to **82 specialized AI agents** from the `wshobson/agents` repository, providing domain-specific expertise across software development, infrastructure, and business operations. These agents extend Claude Code's capabilities with specialized knowledge and production-ready patterns.

### Agent Repository Structure

```
agents/
├── README.md                           # Complete agent documentation
├── examples/                           # Usage examples and workflows
├── backend-architect.md               # API design and microservices
├── frontend-developer.md              # React/Next.js components
├── ai-engineer.md                     # LLM applications and RAG
├── quant-analyst.md                   # Financial modeling and trading
├── security-auditor.md               # DevSecOps and vulnerability assessment
├── data-scientist.md                  # Advanced analytics and ML
├── business-analyst.md               # KPI frameworks and business intelligence
└── [78 more specialized agents...]    # Covering all technical domains
```

### Installation and Setup

The agents repository is already cloned in your project at `./agents/`. No additional installation is required - Claude Code automatically detects and makes these agents available.

### Key Agents for BrokerAnalysis

#### Core Development Agents

| Agent | Model | Description | Use Cases |
|-------|-------|-------------|-----------|
| **backend-architect** | Opus | RESTful API design, microservice boundaries, database schemas | Broker APIs, user authentication, data management |
| **frontend-developer** | Sonnet | React components, responsive layouts, client-side state | UI components, dashboard, broker comparison interface |
| **architect-reviewer** | Opus | Architecture validation and pattern review | Code review, best practices enforcement |

#### AI & Machine Learning Agents

| Agent | Model | Description | Use Cases |
|-------|-------|-------------|-----------|
| **ai-engineer** | Opus | LLM applications, RAG systems, agent orchestration | AI-powered broker analysis, chatbot integration |
| **data-scientist** | Opus | Advanced analytics, ML modeling, statistics | Broker performance analysis, user behavior prediction |
| **ml-engineer** | Sonnet | ML pipelines, experiment tracking, model deployment | Predictive models for broker recommendations |

#### Financial & Trading Agents

| Agent | Model | Description | Use Cases |
|-------|-------|-------------|-----------|
| **quant-analyst** | Opus | Trading strategies, backtesting, risk metrics | Broker performance metrics, risk analysis tools |
| **business-analyst** | Sonnet | KPI frameworks, predictive modeling, strategic insights | Market analysis, business intelligence dashboards |

#### Security & Operations Agents

| Agent | Model | Description | Use Cases |
|-------|-------|-------------|-----------|
| **security-auditor** | Opus | DevSecOps, vulnerability assessment, compliance | Security audits, OWASP compliance, data protection |
| **database-admin** | Sonnet | Database operations, backup, replication, monitoring | Database optimization, performance tuning |
| **devops-troubleshooter** | Sonnet | Production debugging, log analysis, deployment | Production issues, deployment troubleshooting |

### Agent Usage

#### Automatic Delegation
Claude Code automatically selects the appropriate agent based on task context and requirements. The system analyzes your request and delegates to the most suitable specialist.

#### Explicit Invocation
Specify an agent by name to use a particular specialist:

```bash
# Use specific agents for tasks
"Use backend-architect to design the broker comparison API"
"Have frontend-developer create the responsive dashboard"
"Get security-auditor to review authentication implementation"
"Use quant-analyst to develop broker performance metrics"
"Have ai-engineer implement the RAG system for broker analysis"
```

#### Task Tool Usage
For complex tasks, use the Task tool with specific subagent types:

```bash
# Launch specialized agents for complex workflows
Task subagent_type="backend-architect" "Design broker comparison API with pagination and filtering"
Task subagent_type="ai-engineer" "Implement RAG system for broker document analysis"
Task subagent_type="security-auditor" "Conduct security audit of authentication system"
```

### Practical Examples for BrokerAnalysis

#### Backend Development
```bash
# Design broker comparison API
"Use backend-architect to create RESTful API for broker comparison with ratings, reviews, and filtering"

# Implement user authentication
"Have backend-architect design JWT-based authentication system with role-based access control"
```

#### Frontend Development
```bash
# Create responsive components
"Use frontend-developer to build responsive broker comparison table with sorting and filtering"

# Implement dashboard
"Have frontend-developer create user dashboard with portfolio tracking and broker recommendations"
```

#### AI Integration
```bash
# Implement AI features
"Use ai-engineer to build RAG system for broker review analysis and insights"
"Have data-scientist develop predictive model for broker performance based on historical data"
```

#### Financial Analysis
```bash
# Develop trading metrics
"Use quant-analyst to create risk-adjusted performance metrics for broker comparison"
"Have quant-analyst implement backtesting framework for broker strategy evaluation"
```

#### Security & Compliance
```bash
# Security audit
"Use security-auditor to conduct OWASP compliance audit and implement security best practices"
"Have security-auditor review data protection measures and GDPR compliance"
```

### Agent Model Selection

Agents are optimized for specific models based on task complexity:

- **Haiku**: Fast, simple tasks (documentation, basic code generation)
- **Sonnet**: Balanced performance for most development tasks
- **Opus**: Complex tasks requiring deep expertise (architecture, security, AI)

### Best Practices

1. **Start with automatic delegation** - Let Claude Code select the appropriate agent
2. **Use explicit invocation** for specialized tasks or when you need specific expertise
3. **Combine agents** for complex workflows (e.g., backend-architect + security-auditor)
4. **Review agent outputs** and provide feedback for continuous improvement
5. **Leverage domain-specific agents** for industry best practices and patterns

### Agent Capabilities by Category

#### Architecture & Design
- System design and microservices
- API design and documentation
- Database schema design
- Scalability and performance optimization

#### Development & Programming
- Full-stack development (React, Next.js, Python)
- Code review and optimization
- Testing and quality assurance
- DevOps and deployment

#### AI & Data Science
- Machine learning model development
- Data analysis and visualization
- LLM application development
- Statistical analysis and forecasting

#### Business & Finance
- Financial modeling and analysis
- Trading strategy development
- Business intelligence and KPIs
- Risk management and compliance

This comprehensive agent ecosystem enables rapid development with domain-specific expertise, ensuring best practices and production-ready solutions for the BrokerAnalysis platform.

## Development Workflow

### Scripts
```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build with Turbopack
npm run start        # Production server
npm run lint         # ESLint code checking
```

### Development Environment
- **Hot Reloading**: Fast development with Turbopack
- **Type Checking**: Strict TypeScript configuration
- **Code Quality**: ESLint with Next.js rules
- **Path Aliases**: `@/*` maps to `src/*`

## SEO-First Development Workflow

### Overview

BrokerAnalysis.com follows a strict SEO-first development workflow that ensures all content, features, and pages are optimized for search engines from conception to publication. This workflow leverages specialized SEO agents from the `wshobson/agents` repository to implement comprehensive SEO strategies.

### Task / Feature Workflow

When a new task arrives (e.g. "New broker profile", "Comparison page", "Update old review", "Add FAQ section", "Backlink campaign", "Site redesign feature", etc.), the following process must be followed:

#### 1. Keyword & Intent Planning
- **Agent**: `seo-keyword-strategist`
- **Process**: Research target keywords (head terms, long-tail, question intents)
- **Deliverables**:
  - Primary & secondary keywords identification
  - Search intent analysis
  - Semantic variants mapping
  - Keyword map + content brief (including user needs and content angle)

#### 2. Content Planning / Structure
- **Agents**: `seo-content-planner` + `seo-structure-architect`
- **Process**: Define content architecture and internal linking strategy
- **Deliverables**:
  - Topic cluster planning
  - Internal linking structure
  - Page layout definition (H1, H2, H3 hierarchy)
  - Schema types specification (Review, FAQ, Breadcrumb, Organization)
  - URL structure and canonical tag planning

#### 3. Content Creation
- **Agent**: `seo-content-writer`
- **Process**: Draft SEO-optimized content according to the brief
- **Requirements**:
  - **EEAT Compliance**: Author info, citations, trust references
  - **Readability**: Scannable sections, clear structure
  - **Semantic Integration**: Natural keyword usage
  - **Content Depth**: Comprehensive coverage of topic

#### 4. Meta & On-Page Optimization
- **Agents**: `seo-meta-optimizer` + `seo-snippet-hunter`
- **Process**: Optimize all on-page elements for search visibility
- **Deliverables**:
  - Title tag optimization (≤60 characters)
  - Meta description optimization (≈155-160 characters)
  - URL slug optimization
  - Image metadata (alt text)
  - Open Graph tags
  - Snippet-friendly content sections (Q&A, summaries, bullet lists)

#### 5. Technical & Crawlability Checks
- **Agents**: Technical agents (performance-engineer, frontend-developer, etc.)
- **Process**: Ensure technical SEO compliance
- **Checklist**:
  - Page speed optimization (Lighthouse scores 95+)
  - Mobile-friendly rendering
  - Canonicalization implementation
  - Robots.txt and sitemap.xml updates
  - Broken link identification and fixing
  - Structured data validation
  - Core Web Vitals optimization

#### 6. Authority & Off-Page Strategy
- **Agent**: `seo-authority-builder`
- **Process**: Plan trust signal acquisition and backlink strategy
- **Deliverables**:
  - Author bio development
  - Link citation strategy
  - Regulatory/official source references
  - Backlink outreach plan (finance/forex niche focus)
  - Guest post opportunities
  - Natural link attraction content

#### 7. Publishing & Monitoring
- **Agents**: `seo-content-auditor`, `seo-content-refresher`, `seo-cannibalization-detector`
- **Process**: Post-publication optimization and maintenance
- **Activities**:
  - Content quality audit (EEAT, performance)
  - Freshness monitoring and updates
  - Cannibalization detection and resolution
  - Performance tracking and optimization

### SEO Standards & Rules (2025 Best Practices)

#### AI & Generative Search Optimization
- All content must support AI/generative search visibility
- Content must be properly structured for AI summarization
- Implement sourceable and authoritative content elements
- Optimize for featured snippets and AI-generated answers

#### EEAT Requirements
- **Expertise**: Demonstrate industry knowledge and credentials
- **Experience**: Show real-world trading experience
- **Authoritativeness**: Citations from authoritative sources
- **Trust**: Regulatory compliance, transparency, accuracy

#### Technical SEO Standards
- **Performance**: Lighthouse scores 95+ (desktop & mobile)
- **Mobile-First**: All designs must be mobile-optimized
- **Structured Data**: Implement schema everywhere possible
- **Page Speed**: Fast load times, optimized images
- **Core Web Vitals**: Meet Google's thresholds

#### Content Standards
- **Titles**: ≤60 characters, keyword-optimized
- **Meta Descriptions**: ≈155-160 characters, compelling
- **URLs**: Clean, lowercase, hyphen-separated
- **Internal Linking**: Minimum 3 internal links from relevant pages
- **Content Depth**: Comprehensive coverage, minimum 1000 words for pillar content

#### Site Architecture
- **Sitemap**: Maintain updated sitemap.xml
- **Robots.txt**: Proper crawl directive management
- **Site Structure**: Avoid deep nesting, logical hierarchy
- **Canonical Tags**: Implement for duplicate content prevention
- **Navigation**: Clear, user-friendly navigation structure

### Example Use Case: Broker Comparison Page

**Request**: "Create a new comparison page for Forex Brokers A, B, and C, focusing on spreads, regulation, and user reviews."

#### Agent Coordination:
1. **seo-keyword-strategist** → Research comparison keywords ("broker A vs broker B spread", "which broker regulated by X", etc.)
2. **seo-content-planner** → Determine page placement in site structure, internal linking strategy
3. **seo-structure-architect** → Design comparison layout, FAQ section, schema markup
4. **seo-content-writer** → Draft comparative analysis with pros/cons, regulation info
5. **seo-meta-optimizer** → Create title, meta description, URL structure
6. **seo-snippet-hunter** → Optimize for featured snippets and comparison tables
7. **seo-authority-builder** → Add regulatory citations, author credentials
8. **Technical agents** → Implement fast loading, mobile-responsive design
9. **seo-content-auditor** → Post-publish quality review
10. **seo-content-refresher** → Schedule regular updates for broker data changes

### Implementation Guidelines

#### Agent Selection & Usage
- **Automatic Delegation**: Allow Claude Code to select appropriate SEO agents
- **Explicit Invocation**: Specify agents by name for specialized tasks
- **Sequential Processing**: Follow the 7-step workflow in order
- **Quality Gates**: Each step must be completed before proceeding

#### Workflow Integration
- **Mandatory Process**: All content/features must follow this workflow
- **Documentation**: Log agent usage, decisions, and optimizations
- **Version Control**: Track SEO changes alongside code changes
- **Performance Monitoring**: Measure SEO impact of all changes

#### Quality Assurance
- **Pre-Publishing**: All SEO agents must approve content before publication
- **Post-Publishing**: Regular audits and performance monitoring
- **Continuous Optimization**: Ongoing improvements based on performance data
- **Competitive Analysis**: Regular competitor research and strategy adjustments

### SEO Agent Integration with Development Workflow

The SEO workflow integrates seamlessly with the existing development process:

1. **Planning Phase**: SEO agents conduct keyword research and content planning
2. **Development Phase**: Technical agents implement SEO requirements
3. **Content Phase**: SEO writers create optimized content
4. **Testing Phase**: SEO auditors validate optimization
5. **Deployment Phase**: SEO monitoring agents track performance

This comprehensive SEO workflow ensures that BrokerAnalysis.com maintains high search visibility, attracts qualified traffic, and establishes authority in the forex broker comparison space.

## Styling System

### Theme Configuration
- **Colors**: Blue-based professional theme
- **Typography**: Geist font family (Google Fonts)
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components with variants

### CSS Custom Properties
```css
:root {
  --primary: #15418F;
  --secondary: #129AE7;
  --accent: #93CCFF;
  --radius: 0.5rem;
}
```

## Data Models & Interfaces

### Broker Interface
```typescript
interface Broker {
  id: number
  name: string
  logo: string
  rating: number
  reviewCount: number
  description: string
  features: string[]
  regulation: string[]
  minDeposit: string
  spread: string
  affiliateLink: string
}
```

### Educational Resource Interface
```typescript
interface EducationalResource {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  rating: number
  enrollments: number
  type: 'article' | 'video' | 'course' | 'guide'
  author: string
}
```

## API Architecture

### AI Analysis Endpoint
- **Path**: `/api/analyze`
- **Method**: POST
- **Function**: Analyze broker data using Groq AI
- **Response**: Structured analysis with insights

### Future API Plans
- Broker data CRUD operations
- User review management
- Educational content management
- Market data integration

## Environment Configuration

### Required Environment Variables
```bash
# AI Services
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# Authentication (Clerk)
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# MCP Servers
CONTEXT7_API_KEY=your_context7_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### MCP Server Environment Variables
The following environment variables are required for MCP server operation:

#### Supabase MCP Server
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin access

#### Clerk MCP Server
- `CLERK_SECRET_KEY`: Clerk secret key for authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key

#### Context7 MCP Server
- `CONTEXT7_API_KEY`: Context7 API key for custom context management

### Environment Variable Setup
1. Copy `.env.local.example` to `.env.local`
2. Fill in all required environment variables
3. MCP servers will automatically load these variables when started
4. Use `claude mcp add` commands with `--env` flags to pass variables to servers

## Build & Deployment

### Production Build
- **Optimization**: Turbopack for fast builds
- **Static Export**: Supports static site generation
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic bundle splitting

### Deployment Targets
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative static site hosting
- **Docker**: Containerized deployment options

## Testing Strategy

### Current State
- **No Tests**: Currently no test framework implemented
- **Recommendation**: Add Jest + React Testing Library
- **Areas to Test**: Component rendering, API endpoints, utility functions

### Testing Recommendations
1. **Unit Tests**: Utility functions and AI analysis
2. **Component Tests**: React component rendering
3. **Integration Tests**: API endpoints and data flow
4. **E2E Tests**: User journey testing

## Security Considerations

### Implemented Security
- **Environment Variables**: Sensitive data in `.env.local`
- **CORS**: Proper cross-origin configuration
- **Authentication**: Clerk integration ready
- **Input Validation**: TypeScript interfaces for data validation

### Security Recommendations
1. **Rate Limiting**: API endpoint protection
2. **Content Security Policy**: Additional headers
3. **HTTPS**: SSL certificate for production
4. **Data Encryption**: Sensitive data protection

## Performance Optimization

### Current Optimizations
- **Turbopack**: Fast development and production builds
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic bundle splitting
- **Lazy Loading**: Component-level lazy loading

### Future Optimizations
1. **CDN Integration**: Content delivery network
2. **Database Indexing**: Query performance
3. **Caching Strategy**: Redis or similar
4. **Bundle Analysis**: Bundle size monitoring

## Monitoring & Analytics

### Current State
- **No Monitoring**: Analytics not yet implemented
- **Recommendation**: Add error tracking and user analytics

### Recommended Tools
1. **Vercel Analytics**: Built-in Next.js analytics
2. **Sentry**: Error tracking and monitoring
3. **Google Analytics**: User behavior analysis
4. **Custom Dashboards**: Business metrics monitoring

## Future Development Roadmap

### Phase 1: Core Features
- [ ] User authentication with Clerk
- [ ] Database integration with Supabase
- [ ] Broker review system
- [ ] Advanced search functionality

### Phase 2: Enhanced Features
- [ ] Real-time market data
- [ ] Advanced trading tools
- [ ] User dashboard
- [ ] Email notifications

### Phase 3: Monetization
- [ ] Affiliate link management
- [ ] Premium subscriptions
- [ ] Advertising system
- [ ] Broker partnership program

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Imports**: Absolute paths using `@/*` aliases

### Critical Naming Convention
- **Always Rename**: When working with any content, data, or references from the original site, always rename "dailyforex" to "brokeranalysis"
- **Text Content**: Replace all instances of "dailyforex" with "brokeranalysis" in text content, headings, and descriptions
- **File References**: Update file paths and references to use the new naming convention
- **Database Entries**: Ensure all database records and API responses use "brokeranalysis" naming
- **SEO Considerations**: Update meta tags, OpenGraph data, and structured data to reflect the new branding
- **Consistency**: Maintain consistent naming across all components, pages, and external references

### Component Patterns
- **Client Components**: Use `'use client'` directive
- **Server Components**: Default for Next.js App Router
- **UI Components**: Reusable with variant support
- **Data Fetching**: Server-side when possible

### AI Integration Best Practices
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: API call optimization
- **Prompt Engineering**: Specialized prompts for trading analysis
- **Response Validation**: Type-safe AI responses

### SEO Workflow Requirements
- **Mandatory Process**: All content and features MUST follow the SEO-First Development Workflow
- **Agent Coordination**: Use specialized SEO agents for all content creation and optimization
- **Quality Assurance**: SEO agents must approve all content before publication
- **Performance Standards**: Maintain Lighthouse scores 95+ and follow 2025 SEO best practices
- **Documentation**: Track all SEO agent usage, decisions, and optimizations
- **Refer to**: Complete SEO workflow documentation in the "SEO-First Development Workflow" section above

## Troubleshooting

### Common Issues
1. **MCP Server Connection**: Check environment variables
2. **Build Errors**: Clear `.next` directory
3. **TypeScript Errors**: Update types and dependencies
4. **Styling Issues**: Check Tailwind CSS configuration

### Debug Commands
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
npm install

# Check TypeScript
npx tsc --noEmit

# Run linting
npm run lint
```

## Resources

### Documentation
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Groq API Documentation**: https://console.groq.com/docs
- **Clerk Documentation**: https://clerk.com/docs

### Community
- **Next.js GitHub**: https://github.com/vercel/next.js
- **Tailwind CSS GitHub**: https://github.com/tailwindlabs/tailwindcss
- **React Documentation**: https://react.dev

---

**Last Updated**: September 2025
**Version**: 0.1.0
**Maintainers**: BrokerAnalysis.com Development Team