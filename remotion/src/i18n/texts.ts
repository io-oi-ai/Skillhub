export type Locale = "en" | "zh";

interface VideoTexts {
  hook: {
    text: string;
  };
  intro: {
    title: string;
    subtitle: string;
  };
  problem: {
    line1: string;
    line2: string;
  };
  solution: {
    line1: string;
    line2: string;
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
    growing: string;
  };
  cli: {
    title: string;
    command: string;
    output: string;
  };
  cta: {
    url: string;
    badge: string;
  };
  outro: {
    title: string;
    tagline: string;
  };
}

const en: VideoTexts = {
  hook: {
    text: "Your AI agent is only as good as its skills.",
  },
  intro: {
    title: "SkillHubs",
    subtitle: "Discover the Best AI Agent Skills",
  },
  problem: {
    line1: "Most prompts are one-off, unstructured, and untested.",
    line2: "Your agent deserves better.",
  },
  solution: {
    line1: "A curated library of production-ready AI skills,",
    line2: "built for agents that actually ship work.",
  },
  collections: {
    title: "5 Curated Collections",
    items: [
      "Indie Hacker",
      "Marketing & Growth",
      "Data & Finance",
      "Developer Tools",
      "Getting Started",
    ],
  },
  coverage: {
    skills: "Skills",
    skillsNum: 41,
    roles: "Roles",
    rolesNum: 11,
    scenes: "Scenarios",
    scenesNum: 10,
    growing: "Growing every week",
  },
  cli: {
    title: "SkillHubs CLI",
    command: "$ skillhubs install prd-writing",
    output: `✓ Installed prd-writing (v1.2)

  Role:     product-manager
  Scene:    feature-planning
  Tags:     PRD, Product, Planning

  → Skill ready. Start with: skillhubs run prd-writing`,
  },
  cta: {
    url: "skillhubs.cc",
    badge: "Free & Open Source",
  },
  outro: {
    title: "SkillHubs",
    tagline: "Skills that make agents work.",
  },
};

const zh: VideoTexts = {
  hook: {
    text: "你的 AI Agent，取决于它的 Skills。",
  },
  intro: {
    title: "SkillHubs",
    subtitle: "发现最好的 AI Agent Skills",
  },
  problem: {
    line1: "大多数提示词是一次性的，缺乏结构，未经验证。",
    line2: "你的 Agent 值得更好的。",
  },
  solution: {
    line1: "精选的生产级 AI 技能库，",
    line2: "专为真正能交付工作的 Agent 打造。",
  },
  collections: {
    title: "5 个精选合集",
    items: ["独立开发者", "营销增长", "数据与财务", "开发者工具", "快速上手"],
  },
  coverage: {
    skills: "Skills",
    skillsNum: 41,
    roles: "角色",
    rolesNum: 11,
    scenes: "场景",
    scenesNum: 10,
    growing: "每周持续更新",
  },
  cli: {
    title: "SkillHubs CLI",
    command: "$ skillhubs install prd-writing",
    output: `✓ 已安装 prd-writing (v1.2)

  角色:     产品经理
  场景:     功能规划
  标签:     PRD, 产品, 规划

  → 技能就绪。运行: skillhubs run prd-writing`,
  },
  cta: {
    url: "skillhubs.cc",
    badge: "免费 & 开源",
  },
  outro: {
    title: "SkillHubs",
    tagline: "让 Agent 真正好用的技能。",
  },
};

export const texts: Record<Locale, VideoTexts> = { en, zh };
