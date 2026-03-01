export type Role =
  | "developer"
  | "product-manager"
  | "designer"
  | "marketer"
  | "data-analyst"
  | "operations"
  | "hr"
  | "finance"
  | "legal"
  | "educator"
  | "everyone";

export type Scene =
  | "writing"
  | "coding"
  | "data-analysis"
  | "project-management"
  | "creative-design"
  | "communication"
  | "workflow"
  | "research"
  | "decision-making"
  | "learning";

export type Source = "openclawskill.ai" | "clawhub.ai" | "larrybrain.com" | "skillhub";

export interface Skill {
  id: string;
  name: string;
  description: string;
  author: string;
  roles: Role[];
  scenes: Scene[];
  version: string;
  updatedAt: string;
  tags: string[];
  featured?: boolean;
  source?: Source;
  content: string;
}

export const SOURCE_LABELS: Record<Source, string> = {
  "openclawskill.ai": "OpenClaw",
  "clawhub.ai": "ClawHub",
  "larrybrain.com": "LarryBrain",
  skillhub: "SkillHub",
};

export const ROLE_LABELS: Record<Role, string> = {
  developer: "开发工程师",
  "product-manager": "产品经理",
  designer: "设计师",
  marketer: "运营/营销",
  "data-analyst": "数据分析师",
  operations: "行政/运营",
  hr: "人力资源",
  finance: "财务",
  legal: "法务",
  educator: "教育/培训",
  everyone: "通用",
};

export const SCENE_LABELS: Record<Scene, string> = {
  writing: "写作",
  coding: "编程",
  "data-analysis": "数据分析",
  "project-management": "项目管理",
  "creative-design": "创意设计",
  communication: "沟通协作",
  workflow: "流程优化",
  research: "调研分析",
  "decision-making": "决策支持",
  learning: "学习提升",
};

export const ROLE_COLORS: Record<Role, string> = {
  developer: "bg-blue-50 text-blue-700 border-blue-200",
  "product-manager": "bg-violet-50 text-violet-700 border-violet-200",
  designer: "bg-pink-50 text-pink-700 border-pink-200",
  marketer: "bg-orange-50 text-orange-700 border-orange-200",
  "data-analyst": "bg-cyan-50 text-cyan-700 border-cyan-200",
  operations: "bg-amber-50 text-amber-700 border-amber-200",
  hr: "bg-rose-50 text-rose-700 border-rose-200",
  finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
  legal: "bg-slate-100 text-slate-700 border-slate-200",
  educator: "bg-teal-50 text-teal-700 border-teal-200",
  everyone: "bg-purple-50 text-purple-700 border-purple-200",
};
