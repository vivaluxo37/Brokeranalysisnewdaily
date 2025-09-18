# BrokerAnalysis.com - Quick Reference Guide

## Project Overview

BrokerAnalysis.com is a comprehensive Next.js 15 application for forex broker comparison and analysis. The platform provides unbiased broker reviews, educational content, market analysis, and AI-powered trading insights.

### Quick Links
- **Architecture Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Development Guidelines**: [DEVELOPMENT.md](./DEVELOPMENT.md)

### Key Features
- **Broker Comparison**: Compare 100+ regulated forex brokers
- **AI-Powered Analysis**: Groq AI integration for broker data analysis
- **Educational Content**: Comprehensive trading education hub
- **Market News & Analysis**: Real-time market insights
- **User Reviews**: Community-driven broker reviews
- **Trading Tools**: Calculators, charts, and analysis tools

## Quick Technology Stack

### Core Framework
- **Next.js 15.5.3**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe JavaScript
- **Turbopack**: Fast bundler

### Key Services
- **Clerk**: User authentication
- **Supabase**: Database and backend
- **Groq AI**: AI-powered analysis
- **ZAI AI**: Advanced AI capabilities via MCP server
- **Tailwind CSS**: Styling framework

## Quick Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
```

## MCP Servers Configuration

### ZAI MCP Server (Pre-configured)
- **Server**: zai-mcp-server
- **Command**: `npx -y @z_ai/mcp-server`
- **Environment**:
  - `Z_AI_API_KEY=a07915db87b34f96aa53f89fab692b20.2bW7A4gPqZMAnfgb`
  - `Z_AI_MODE=ZAI`
- **Status**: ✅ Active and configured

## Important Notes

- **Always use ARCHITECTURE.md** for technical architecture details
- **Always use DEVELOPMENT.md** for development workflows and guidelines
- **SEO-First Workflow**: All content MUST follow the SEO development process
- **Critical Naming**: Always rename "dailyforex" to "brokeranalysis" in all content
- **AI Agents**: Use specialized agents for different aspects of development

## Quick Links to Key Sections

- [Architecture Overview](./ARCHITECTURE.md#project-overview)
- [Development Workflow](./DEVELOPMENT.md#development-workflow)
- [SEO-First Development](./DEVELOPMENT.md#seo-first-development-workflow)
- [Agent Delegation Guide](./DEVELOPMENT.md#specialized-agent-delegation-guide)
- [Environment Setup](./ARCHITECTURE.md#environment-configuration)

## How to Use Other .md Files

### **Essential Documentation Files:**
- **ARCHITECTURE.md**: Technical architecture, MCP servers, AI agents, project structure
- **DEVELOPMENT.md**: Development workflows, SEO process, agent delegation, code guidelines

### **Setup & Configuration Guides:**
- **CLERK_SETUP.md**: Complete Clerk authentication setup guide with troubleshooting
- **MCP_SETUP.md**: MCP server configuration and setup instructions
- **ZAI_MCP_SETUP.md**: ZAI MCP server configuration (API key: a07915db87b34f96aa53f89fab692b20.2bW7A4gPqZMAnfgb)

### **SEO & Content Strategy:**
- **broker-page-structure.md**: SEO architecture for broker review pages (URL structure, H1-H3 hierarchy, schema markup)
- **forex-broker-keyword-strategy.md**: Comprehensive keyword strategy (primary keywords, long-tail, question-based searches)
- **content-section-templates.md**: Content templates and structure guidelines
- **internal-linking-strategy.md**: Internal linking and SEO strategy
- **topic-cluster-planning.md**: Topic cluster and content planning

### **Testing & Reports:**
- **BROKER_FUNCTIONALITY_TEST_SUMMARY.md**: Test results and current system status
- **COMPREHENSIVE-SUCCESS-REPORT.md**: Project success report and achievements

### **When to Use Each File:**

#### **Starting Development:**
1. Read **CLAUDE.md** (this file) for overview
2. Read **DEVELOPMENT.md** for workflow guidelines
3. Read **ARCHITECTURE.md** for technical understanding

#### **Setting Up Services:**
- Clerk authentication: **CLERK_SETUP.md**
- MCP servers: **MCP_SETUP.md**
- ZAI MCP server: **ZAI_MCP_SETUP.md** (pre-configured with API key)

#### **Creating Content:**
- Broker pages: **broker-page-structure.md**
- Keyword research: **forex-broker-keyword-strategy.md**
- Content templates: **content-section-templates.md**
- SEO planning: **topic-cluster-planning.md**

#### **Troubleshooting:**
- Test results: **BROKER_FUNCTIONALITY_TEST_SUMMARY.md**
- MCP issues: **MCP_SETUP.md**
- Clerk issues: **CLERK_SETUP.md**

#### **Code Development:**
- Technical specs: **ARCHITECTURE.md**
- Development workflow: **DEVELOPMENT.md**
- Agent delegation: **DEVELOPMENT.md#specialized-agent-delegation-guide**

### **File Hierarchy:**
```
CLAUDE.md (Quick Reference - Start Here)
├── ARCHITECTURE.md (Technical Details)
├── DEVELOPMENT.md (Development Workflow)
├── CLERK_SETUP.md (Authentication Setup)
├── MCP_SETUP.md (Server Configuration)
├── broker-page-structure.md (SEO Architecture)
├── forex-broker-keyword-strategy.md (Keyword Strategy)
└── [Other strategy and test files...]
```

**Important**: Always consult the relevant .md file before starting any task to ensure you follow the correct workflow and technical requirements.

---

**Note**: This is a quick reference guide. For detailed documentation, see the linked files above.

**Last Updated**: September 2025
**Version**: 0.1.0
**Maintainers**: BrokerAnalysis.com Development Team
- Add button" c" as shortcut to quickly add claude.md ,architecture.md and development.md