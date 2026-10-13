export interface User {
  name: string;
  company_name: string;
  email: string;
}

export interface Process {
  id: string;
  name: string;
  occurrences: number;
  people_involved: number;
  hours_required: number;
  details?: string;
  steps?: string[];
}

export interface AgenticRecommendation {
  process_id: string;
  process_name: string;
  reason: string;
  suggested_steps: string[];
}

export interface InputData {
  user: User;
  processes: Process[];
}

export interface OutputData {
    agentic_recommendations: AgenticRecommendation[];
}