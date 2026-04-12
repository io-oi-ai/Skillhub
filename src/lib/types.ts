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
  likesCount: number;
  downloadCount: number;
  userId?: string | null;
  priceType: "free" | "paid";
  price: number; // cents (USD)
  waffoProductId?: string | null;
  creemProductId?: string | null;
}

export interface SkillVersion {
  id: number;
  skillId: string;
  version: string;
  name: string;
  description: string;
  content?: string;
  roles: string[];
  scenes: string[];
  tags: string[];
  userId?: string | null;
  message?: string | null;
  createdAt: string;
  author?: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export type PullRequestStatus = "open" | "merged" | "rejected";

export interface PullRequest {
  id: number;
  skillId: string;
  authorId: string;
  status: PullRequestStatus;
  title: string;
  message?: string | null;
  name: string;
  description: string;
  content: string;
  roles: string[];
  scenes: string[];
  tags: string[];
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewComment?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  points: number;
  bio: string | null;
  website: string | null;
  plan: "free" | "pro";
  subscriptionDownloadsRemaining: number;
  createdAt: string;
}

export type PaymentProvider = "creem" | "waffo";
export type PlanType = "monthly" | "yearly";

export interface Subscription {
  id: number;
  userId: string;
  provider: PaymentProvider;
  externalSubscriptionId: string;
  externalCustomerId: string | null;
  productId: string | null;
  status: "active" | "canceled" | "expired" | "past_due";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillPurchase {
  id: number;
  userId: string;
  skillId: string;
  provider: string;
  externalOrderId: string | null;
  price: number;
  source: "purchase" | "subscription";
  createdAt: string;
  billingEmail?: string | null;
  isPro?: boolean;
  subscriptionPlan?: "free" | "pro_monthly" | "pro_yearly";
  subscriptionStatus?: "inactive" | "active" | "canceling" | "canceled" | "past_due";
}

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
