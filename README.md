# Business Process Automation Analyzer

An intelligent, interactive web application that enables organizations and automation consultants to catalog business workflows, quantify operational effort, and generate AI-driven feasibility recommendations for **Agentic AI** implementation using Google Gemini.

---

## 🚀 Overview

Modern businesses spend thousands of hours across repetitive, multi-step operational tasks—from invoice validation and client onboarding to customer service routing. Identifying which processes are ripe for autonomous agents versus traditional deterministic automation is often a time-consuming consulting endeavor.

The **Business Process Automation Analyzer** provides a structured, consultative intake framework that:
1. **Guides stakeholders** through an onboarding checklist before process submission.
2. **Collects client and company context** for personalized documentation and report delivery.
3. **Catalogs detailed process telemetry**, including volume, team involvement, time expenditure, and step-by-step procedural workflows.
4. **Leverages Gemini 2.5 Flash** with strict structured JSON schema enforcement to evaluate each process for Agentic AI suitability.
5. **Generates actionable deliverables**, including downloadable multi-sheet Excel workbooks, styled PDF executive summaries, and background synchronization to Google Sheets.

---

## ✨ Key Features

- **Guided Step-by-Step Flow**:
  - **Checklist**: Clear overview of requirements and prerequisites for participants.
  - **Organization Intake**: Captures name, company name, and contact email.
  - **Process Cataloging**: Intuitive form to register process names, monthly/quarterly occurrences, headcounts, average hours per task, narrative descriptions, and granular sub-steps.
  - **Interactive Process Inventory**: Full support for adding, editing, updating, and removing processes prior to running the analysis.

- **AI-Powered Agentic Feasibility Assessment**:
  - Utilizes **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) via the modern `@google/genai` SDK.
  - Enforces schema validation (`Type.OBJECT` / `Type.ARRAY`) for predictable, type-safe consulting output.
  - Evaluates suitability based on decision-making complexity, unstructured inputs, multi-system interactions, and dynamic path resolution.
  - Generates concrete, step-by-step blueprints for how an autonomous AI agent would execute each candidate workflow.

- **Enterprise-Ready Multi-Format Exports**:
  - **Excel Workbook (`.xlsx`)**: Generates a cleanly structured 3-tab workbook via SheetJS (`User Information`, `Submitted Processes`, `Agentic AI Recommendations`).
  - **Executive PDF Report**: Produces a print-ready, styled executive summary with tabular recommendations, custom branding, and process telemetry appendices using jsPDF and AutoTable.

- **Background CRM / Google Sheets Logging**:
  - Automatically transmits lead and process submission packages in the background to a Google Apps Script Web App endpoint without blocking the user interface.

- **Polished, Responsive UI**:
  - Styled with Tailwind CSS and Inter typography.
  - Interactive validation, loading spinners, empty states, and step indicators.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Runtime** | React 19, TypeScript 5.8, Vite 6 |
| **Styling** | Tailwind CSS (CDN configured with Inter font) |
| **Artificial Intelligence** | `@google/genai` (Gemini 2.5 Flash) with JSON Schema |
| **Export Engines** | SheetJS (`xlsx`), jsPDF (`jspdf` & `jspdf-autotable`) |
| **Cloud Integration** | Google Apps Script Webhook (Google Sheets data sink) |

---

## 📁 Project Structure

```
.
├── components/
│   ├── AnalysisResults.tsx      # Results display, recommendation cards & export triggers
│   ├── Checklist.tsx            # Initial readiness checklist and instructions
│   ├── ProcessForm.tsx          # Process intake form with dynamic step management
│   ├── ProcessList.tsx          # Overview table/list of added processes with edit/delete
│   ├── UserInfoForm.tsx         # User & company profile capture form
│   └── icons/                   # Reusable SVG icon components
│       ├── FileDownloadIcon.tsx
│       ├── PencilIcon.tsx
│       ├── PlusIcon.tsx
│       ├── SparklesIcon.tsx
│       └── TrashIcon.tsx
├── services/
│   ├── downloadService.ts       # Excel (.xlsx) and PDF document generation
│   ├── geminiService.ts         # Gemini API integration & structured JSON prompt
│   └── sheetsService.ts         # Google Apps Script background synchronization
├── App.tsx                      # Main application orchestrator and state management
├── index.html                   # HTML entry point, Tailwind config & CDN script loaders
├── index.tsx                    # React DOM root mounting
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── types.ts                     # TypeScript definitions for User, Process, and Recommendations
└── vite.config.ts               # Vite bundler configuration and environment mapping
```

---

## ⚙️ Setup & Local Development

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**, **pnpm**, or **bun**
- A **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd business-process-automation-analyzer
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` or `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Vite forwards `GEMINI_API_KEY` to `process.env.API_KEY` through the `define` section in `vite.config.ts`.

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📊 Data Models

### User Profile (`User`)
```typescript
export interface User {
  name: string;
  company_name: string;
  email: string;
}
```

### Process (`Process`)
```typescript
export interface Process {
  id: string;
  name: string;
  occurrences: number;      // Frequency of execution
  people_involved: number;  // Headcount dedicated to the workflow
  hours_required: number;   // Duration in hours per occurrence
  details?: string;         // Qualitative description
  steps?: string[];         // Ordered list of sub-steps
}
```

### Agentic Recommendation (`AgenticRecommendation`)
```typescript
export interface AgenticRecommendation {
  process_id: string;
  process_name: string;
  reason: string;           // Rationale for Agentic AI applicability
  suggested_steps: string[];// Autonomous actions suggested for the AI agent
}
```

---

## 🔒 Security & Best Practices

- **Zero Client Credential Exposure**: Production deployments should proxy API requests through a secure backend service to keep LLM API keys safe.
- **Strict Schema Adherence**: Utilizes Google GenAI's structured schema output (`responseMimeType: "application/json"`) to prevent malformed responses and prompt injection side-effects.
- **Resilient Fallbacks**: Validates input formats and catches network or API errors with user-friendly alerts.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) (or proprietary to your organization).
