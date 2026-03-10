export type Locale = "en" | "zh";

interface VideoTexts {
  intro: {
    title: string;
    subtitle: string;
  };
  stat: {
    number: string;
    label: string;
    badge: string;
  };
  collections: {
    title: string;
    items: string[];
  };
  coverage: {
    skills: string;
    skillsNum: number;
    roles: string;
    rolesNum: number;
    scenes: string;
    scenesNum: number;
  };
  cta: {
    url: string;
    badge: string;
    tagline: string;
  };
  guide: {
    title: string;
    cards: { stat: string; label: string }[];
  };
  cli: {
    title: string;
    command: string;
    output: string;
  };
}

const en: VideoTexts = {
  intro: {
    title: "SkillHubs",
    subtitle: "Discover the Best AI Agent Skills",
  },
  stat: {
    number: "+16.2",
    label: "Task Completion Improvement",
    badge: "Based on SkillsBench Research",
  },
  collections: {
    title: "5 Curated Collections",
    items: [
      "Getting Started",
      "Indie Hacker",
      "Marketing & Growth",
      "Data & Finance",
      "Developer Tools",
    ],
  },
  coverage: {
    skills: "Skills",
    skillsNum: 41,
    roles: "Roles",
    rolesNum: 11,
    scenes: "Scenes",
    scenesNum: 10,
  },
  cta: {
    url: "skillhubs.cc",
    badge: "Free & Open Source",
    tagline: "Built for the AI era.",
  },
  guide: {
    title: "Research-Backed Writing Guide",
    cards: [
      { stat: "+18.6pp", label: "Optimal Structure" },
      { stat: "+18.8pp", label: "Detailed & Compact" },
      { stat: "+16.2pp", label: "Human Curation" },
    ],
  },
  cli: {
    title: "SkillHubs CLI",
    command: "$ skillhubs skills list",
    output: `Found 41 skills

  ID                  ROLES
  brainstorming       everyone
  prd-writing         product-manager
  data-analyst        data-analyst
  landing-page        developer
  financial-analysis  finance`,
  },
};

const zh: VideoTexts = {
  intro: {
    title: "SkillHubs",
    subtitle: "发现最好的 AI Agent Skills",
  },
  stat: {
    number: "+16.2",
    label: "任务完成率提升",
    badge: "基于 SkillsBench 研究",
  },
  collections: {
    title: "5 个精选集合",
    items: ["快速上手", "独立开发者", "营销增长", "数据与财务", "开发者工具"],
  },
  coverage: {
    skills: "Skills",
    skillsNum: 41,
    roles: "角色",
    rolesNum: 11,
    scenes: "场景",
    scenesNum: 10,
  },
  cta: {
    url: "skillhubs.cc",
    badge: "免费 & 开源",
    tagline: "为 AI 时代而生。",
  },
  guide: {
    title: "研究支撑的写作指南",
    cards: [
      { stat: "+18.6pp", label: "最优结构" },
      { stat: "+18.8pp", label: "详细且紧凑" },
      { stat: "+16.2pp", label: "人工策划" },
    ],
  },
  cli: {
    title: "SkillHubs CLI",
    command: "$ skillhubs skills list",
    output: `找到 41 个 Skills

  ID                  角色
  brainstorming       通用
  prd-writing         产品经理
  data-analyst        数据分析师
  landing-page        开发工程师
  financial-analysis  财务`,
  },
};

export const texts: Record<Locale, VideoTexts> = { en, zh };
