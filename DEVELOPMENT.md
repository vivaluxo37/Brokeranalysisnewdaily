# BrokerAnalysis.com - Development Guide

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

## Monitoring & Analytics

### Current State
- **No Monitoring**: Analytics not yet implemented
- **Recommendation**: Add error tracking and user analytics

### Recommended Tools
1. **Vercel Analytics**: Built-in Next.js analytics
2. **Sentry**: Error tracking and monitoring
3. **Google Analytics**: User behavior analysis
4. **Custom Dashboards**: Business metrics monitoring

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

## Project Documentation Navigation

This project uses multiple .md files to organize comprehensive documentation. Understanding when and how to use each file is crucial for efficient development.

### **Essential Documentation Files:**

#### **CLAUDE.md** - Your Starting Point
- **Purpose**: Quick reference and navigation hub
- **When to Use**:
  - Always start here when beginning any task
  - Quick reference for commands and links
  - Understanding which files you need to consult
- **Contains**: Project overview, quick links, file hierarchy guide

#### **ARCHITECTURE.md** - Technical Architecture
- **Purpose**: Complete technical documentation
- **When to Use**:
  - Understanding system architecture
  - Setting up MCP servers and AI agents
  - Database schema and API design
  - Environment configuration
- **Contains**: Technology stack, project structure, AI agents, MCP setup

### **Setup & Configuration Guides:**

#### **CLERK_SETUP.md** - Authentication Implementation
- **Purpose**: Complete Clerk authentication setup
- **When to Use**:
  - Setting up user authentication
  - Configuring Clerk components
  - Troubleshooting authentication issues
  - Production deployment for authentication

#### **MCP_SETUP.md** - Server Configuration
- **Purpose**: MCP server setup and tools
- **When to Use**:
  - Setting up MCP servers
  - Configuring AI agent tools
  - Troubleshooting MCP connections

### **SEO & Content Strategy Files:**

#### **broker-page-structure.md** - SEO Architecture
- **Purpose**: SEO-optimized page structures
- **When to Use**:
  - Creating broker review pages
  - Implementing schema markup
  - Designing URL structures and meta tags
  - Content hierarchy planning

#### **forex-broker-keyword-strategy.md** - Keyword Research
- **Purpose**: Comprehensive SEO keyword strategy
- **When to Use**:
  - Content planning and creation
  - Keyword research and optimization
  - Understanding search intent
  - SEO content development

#### **Additional SEO Files:**
- **content-section-templates.md**: Content templates and guidelines
- **internal-linking-strategy.md**: Internal linking strategy
- **topic-cluster-planning.md**: Topic cluster planning

### **Testing & Analysis:**

#### **BROKER_FUNCTIONALITY_TEST_SUMMARY.md** - System Status
- **Purpose**: Current system test results and issues
- **When to Use**:
  - Understanding known system issues
  - Planning bug fixes
  - Assessing current functionality
  - Testing new features

## How to Navigate Documentation for Different Tasks

### **When Starting Any Development Task:**
1. **Start with CLAUDE.md** - Quick overview and identify which files you need
2. **Read DEVELOPMENT.md** - Understand the development workflow and SEO process
3. **Consult ARCHITECTURE.md** - Technical specifications and requirements

### **When Setting Up Services:**
1. **CLERK_SETUP.md** - For authentication setup
2. **MCP_SETUP.md** - For server configuration
3. **ARCHITECTURE.md** - For technical requirements

### **When Creating SEO Content:**
1. **DEVELOPMENT.md** - For SEO workflow methodology
2. **forex-broker-keyword-strategy.md** - For keyword research
3. **broker-page-structure.md** - For page structure and schema
4. **content-section-templates.md** - For content templates

### **When Writing Code:**
1. **DEVELOPMENT.md** - For coding standards and workflow
2. **ARCHITECTURE.md** - For technical specifications
3. **Use specialized agents** - As documented in agent delegation guide

### **When Troubleshooting:**
1. **BROKER_FUNCTIONALITY_TEST_SUMMARY.md** - For known issues
2. **CLERK_SETUP.md** - For authentication problems
3. **MCP_SETUP.md** - For server issues
4. **ARCHITECTURE.md** - For technical debugging

### **Documentation Usage Flow:**
```
Start Task → CLAUDE.md (Navigation) → Identify Required Files
                                        ↓
Development Task → DEVELOPMENT.md → ARCHITECTURE.md → [Technical Specs]
SEO Content → SEO Strategy Files → broker-page-structure.md → [Implementation]
Setup → Setup Files → ARCHITECTURE.md → [Configuration]
Issues → Test Results → Specific Setup Files → [Resolution]
```

## Specialized Agent Delegation Guide

BrokerAnalysis.com is a sophisticated Next.js 15 and Supabase-based forex broker comparison platform with advanced AI features. Use specialized Claude Code subagents to tackle each aspect of the project. Prefix each task with the agent name (e.g. backend-architect:). For example:

backend-architect: Design the RESTful authentication and broker-data APIs with Supabase integration.

frontend-developer: Implement the responsive React dashboard for broker search and comparison.

### Task Delegation to Subagents

**backend-architect**: Design RESTful APIs for user authentication, broker data, and trading signals. Define the Supabase database schemas and relationships for brokers, users, and financial data.

**architect-reviewer**: Review the overall system architecture (frontend, backend, database, AI components) for consistency, scalability, and alignment with best practices.

**frontend-developer**: Build the Next.js 15 front-end with React 19.1 and TypeScript 5. Implement all UI components (broker search, filter criteria, side-by-side comparison tables, broker profile pages, dashboards, calculators, etc.) using Tailwind CSS. Ensure fast client-side loading and hydration of data.

**ui-ux-designer**: Create a modern, user-friendly interface design (2025-era aesthetics, glassmorphism, smooth animations). Produce wireframes and design guidelines for all pages (broker search, comparison views, user dashboard, educational content). Ensure the design is responsive across devices.

**ui-visual-validator**: Validate the implemented UI against the design specs and check for visual consistency and accessibility (WCAG compliance, color contrast, readability). Identify and correct any UI anomalies.

**mobile-developer**: Plan or prototype a mobile version of the platform (e.g. using React Native or Flutter) to support future mobile app development. Specify how key features (watchlists, broker comparison, market news) would translate to mobile UI.

**cloud-architect**: Architect the cloud infrastructure for Supabase and Next.js hosting. Design a scalable deployment (multi-region support, CDN integration, caching layers) that meets performance and availability goals. Estimate cost and recommend cloud services (AWS/GCP/Azure) or managed hosting.

**terraform-specialist**: Define infrastructure-as-code (e.g. Terraform modules) to provision the necessary cloud resources (database instances, CDN, load balancers, storage buckets). Ensure environments (dev/staging/prod) are reproducible.

**deployment-engineer**: Set up CI/CD pipelines (GitOps) for automated builds and deployments of the front-end and backend. Configure linting, testing, and deployment stages so that code is automatically tested and deployed on commit (e.g. on Vercel or AWS).

**devops-troubleshooter**: Automate environment setup and monitoring. Integrate logging and alerting (for errors, downtime) and troubleshoot deployment issues. Ensure rollback procedures and high availability configurations are in place.

**network-engineer**: Configure networking and delivery optimizations. Manage SSL certificates, load balancers, and global CDN settings. Optimize DNS, caching rules, and firewall settings for secure, low-latency access worldwide.

**database-admin**: Configure the Supabase database cluster: set up backups, replication, and failover. Manage database security (roles, permissions) and monitor performance metrics. Establish routines for schema migrations.

**database-optimizer**: Optimize database performance: design effective indexing strategies for the 12-table schema (brokers, accounts, transactions, etc.), optimize complex SQL queries for broker filtering/comparison, and implement caching or view tables if needed to accelerate read-heavy queries.

**sql-pro**: Write and refine complex SQL queries for reporting and analysis. Craft efficient queries to support the platform's features (e.g. cost calculator comparisons, volatility metrics) and advise on query optimization (joins, CTEs, window functions) within Supabase (Postgres).

**data-engineer**: Build data pipelines and ETL jobs: ingest and synchronize real-time forex market data, economic calendar events, and broker updates into the database. Implement data validation and transformation workflows so that the platform always has up-to-date market news and metrics.

**ai-engineer**: Integrate multi-provider AI (Groq Llama 3, Anthropic Claude 3, OpenAI GPT-4) for core features. Develop a retrieval-augmented generation (RAG) system or equivalent for the AI assistant and broker analysis. Ensure context management for multi-modal queries and fallback logic among providers for high reliability.

**mlops-engineer**: Set up the ML/AI infrastructure: manage model serving, versioning, and monitoring. Automate training and deployment pipelines for any ML components (e.g. trading signal models). Track experiments, data versioning, and ensure reproducibility of AI features.

**ml-engineer**: Design and train any custom ML models needed for the platform. For example, build models to predict currency pair movements or broker performance trends, and integrate them into the AI features. Handle feature engineering on market data and ensure model evaluation.

**prompt-engineer**: Craft and refine the prompt templates and conversational flows for the AI assistant (chatbot), the interactive Broker Matcher tool, and other AI-driven features (cost calculator explanations, risk analysis queries). Optimize prompts for clarity and accuracy, handling edge cases and user intent.

**data-scientist**: Analyze the forex and broker data for insights. Compute key metrics like market volatility, spread comparisons, and user behavior analytics. Support the trading signals and market prediction features by processing historical data and identifying statistically significant patterns.

**quant-analyst**: Develop quantitative trading models and strategy algorithms. Leverage currency pair data and economic event impacts to generate AI-powered trading signals. Inform the platform's currency analysis section with econometric models or backtested strategies.

**risk-manager**: Implement user-specific risk assessment logic. Based on each trader's profile (capital, experience, risk tolerance), use quantitative models to suggest appropriate leverage or position sizing. Integrate risk scores into personalized recommendations.

**performance-engineer**: Profile and optimize overall system performance. Focus on improving page load speeds, reducing backend latency, and fine-tuning caching layers (application and database). Optimize Turbopack builds and ensure Core Web Vitals compliance.

**security-auditor**: Conduct a security audit of the entire platform. Check the authentication flow (Clerk integration), data encryption, and OWASP compliance. Ensure protection against common vulnerabilities (XSS, CSRF, SQL injection) and review privacy controls (GDPR, financial data regulations).

**code-reviewer**: Review the codebase for quality and maintainability. Enforce best practices in TypeScript and JavaScript. Identify any code smells, suggest refactors (especially in complex components like the comparison tables and calculators), and ensure code is well-documented.

**test-automator**: Create comprehensive automated tests. Write unit tests for business logic (broker filtering, calculations), integration tests for data flows, and end-to-end tests for core user journeys (search for brokers, compare, use calculators, AI chat). Integrate testing frameworks (e.g. Jest, Cypress) into the CI pipeline.

**tdd-orchestrator**: Advise on using Test-Driven Development for new features. Help specify acceptance criteria and define tests before coding. Ensure a test-first mindset to catch regressions early when adding functionalities like new trading tools or user dashboard widgets.

**debugger**: Assist in debugging any issues during development. Analyze runtime errors or unexpected behaviors (in front-end or backend) and guide step-by-step to root causes and fixes.

**error-detective**: Analyze logs and error patterns from production or staging. Identify recurring issues (memory leaks, performance spikes) and suggest targeted fixes or monitoring improvements.

**tutorial-engineer**: Author step-by-step tutorials and educational guides. Cover topics from beginner trading (how to use the platform, understanding forex concepts) to advanced (using the cost calculator, interpreting trading signals). Ensure content is clear and accessible to users at all skill levels.

**reference-builder**: Construct reference materials and technical glossaries. Create a glossary of forex terms, a reference guide for currency pair analysis, and a data dictionary for the platform's database schema. Provide these as easy-reference resources in the educational hub.

**api-documenter**: Generate OpenAPI/Swagger documentation for any public or internal APIs (e.g. if offering an affiliate API or allowing third-party integration). Ensure all endpoints are documented with request/response schemas.

**docs-architect**: Compile high-level technical documentation. Write up the architecture overview, database schema diagrams, deployment procedures, and developer onboarding guides. Organize documentation so that new team members can quickly understand the system.

**mermaid-expert**: Create architecture and workflow diagrams using Mermaid.js. For example, illustrate the data flow from real-time market sources into the database, or the sequence of agents when processing an AI query. These visuals will support the technical docs and presentations.

**content-marketer**: Plan the content marketing strategy (SEO team is already set up, so focus on broader content). Outline blog post topics (forex education, platform updates, broker reviews) and social media themes to attract traders. Coordinate with the educational team to repurpose tutorial content for marketing.

**sales-automator**: Generate outreach templates and sequences to onboard new brokers and affiliate partners. Draft partnership proposals and email campaigns targeting brokers, highlighting integration opportunities and affiliate program benefits.

**business-analyst**: Define and track KPIs and dashboards. Determine metrics like user signups, conversion rates from comparisons to referrals, and revenue per user. Set up analytics (e.g. with Supabase or external tools) to monitor platform usage and affiliate earnings.

**payment-integration**: Integrate payment processing. Configure Stripe, PayPal, or other gateways for user deposits and withdrawals as needed (even if only for future premium features). Ensure PCI compliance practices and smooth refund flows if applicable.

**customer-support**: Plan the user support workflow. Set up an AI-driven FAQ or help chatbot (using the AI assistant) for common questions. Define how support tickets or live chat would be handled and tracked, considering multilingual support if targeting international users.

**legal-advisor**: Draft and review legal documents. Provide templates or outlines for the privacy policy, terms of service, and disclaimers. Ensure compliance with financial regulations (e.g. data protection laws) and disclose affiliate relationships.

**search-specialist**: Research competitive landscape and content sources. Identify top forex broker comparison sites and aggregate credible data sources (financial news, regulatory announcements) that the platform should reference. Keep broker databases updated with the latest regulation changes and market trends.

## Byterover MCP Server Tools Reference

There are two main workflows with Byterover tools and recommended tool call strategies that you **MUST** follow precisely.

### Onboarding workflow
If users particularly ask you to start the onboarding process, you **MUST STRICTLY** follow these steps.
1. **ALWAYS USE** **byterover-check-handbook-existence** first to check if the byterover handbook already exists. If not, You **MUST** call **byterover-create-handbook** to create the byterover handbook.
2. If the byterover handbook already exists, first you **MUST** USE **byterover-check-handbook-sync** to analyze the gap between the current codebase and the existing byterover handbook.
3. Then **IMMEDIATELY USE** **byterover-update-handbook** to update these changes to the byterover handbook.
4. During the onboarding, you **MUST** use **byterover-list-modules** **FIRST** to get the available modules, and then **byterover-store-modules** and **byterover-update-modules** if there are new modules or changes to existing modules in the project.
5. Finally, you **MUST** call **byterover-store-knowledge** to save your new knowledge about the codebase.

### Planning workflow
Based on user request, you **MUST** follow these sequences of tool calls
1. If asked to continue an unfinished plan, **CALL** **byterover-retrieve-active-plans** to find the most relevant active plan.
2. **CRITICAL PLAN PERSISTENCE RULE**: Once a user approves a plan, you **MUST IMMEDIATELY CALL** **byterover-save-implementation-plan** to save it.
3. Throughout the plan, you **MUST** run **byterover-retrieve-knowledge** several times to retrieve sufficient knowledge and context for the plan's tasks.
4. In addition, you might need to run **byterover-search-modules** and **byterover-update-modules** if the tasks require or update knowledge about certain modules. However, **byterover-retrieve-knowledge** should **ALWAYS** be considered **FIRST**.
5. **MUST** use **byterover-update-plan-progress** to mark tasks (and then the whole plan) as completed.
6. Then, you might call **byterover-store-knowledge** to save knowledge and experience implemented throughout the plan or in important tasks.
7. During the plan's implementation, you **MUST** frequently call **byterover-reflect-context** and **byterover-assess-context** to make sure you're on the right track and gather sufficient context for the tasks.

### Recommended Workflow Sequence
1. **MOST IMPORTANT**: **ALWAYS USE** **byterover-retrieve-knowledge** once or several times for **EACH TASK** of the plan to gather necessary context for complete that task.
2. **MOST IMPORTANT**: **ALWAYS USE** **byterover-store-knowledge** once or several times to store critical knowledge and context for future implementations
3. Over 15 provided tools, **byterover-retrieve-knowledge** and **byterover-store-knowledge** ARE the two main tools, which **MUST** be used regularly. You can use these two main tools outside the two main workflows for retrieval and storage purposes.
4. You **MUST** include phrases like **"According to Byterover memory layer"**, **"Based on memory extracted from Byterover"**, **"From Byterover memomry tools"**, ... to explictly showcase that these sources are from **Byterover**.
5. **Implementation & Progress Tracking** → Execute implementation following saved plan → Mark tasks complete as you go → Mark entire plan done when all tasks finished.
6. You **MUST** use **byterover-update-module** **IMMEDIATELY** on changes to the module's purposes, technical details, or critical insights that essential for future implementations.

---

**Last Updated**: September 2025
**Version**: 0.1.0
**Maintainers**: BrokerAnalysis.com Development Team
- "always use claude.mdfile for every new task,creating a new page ,creating new feature etc "