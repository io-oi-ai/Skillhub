import type { Dictionary } from "./en";

const zh: Dictionary = {
  metadata: {
    home: {
      title: "SkillHub — 发现最好的 AI Agent Skills",
      description:
        "面向各行业、各职业的 AI 工作流集合站，浏览、搜索和分享高质量的 AI Skills",
      keywords: [
        "AI Skills",
        "AI 工作流",
        "AI 效率",
        "AI 工具",
        "提示词",
        "Agent",
      ],
      ogTitle: "SkillHub — 发现最好的 AI Agent Skills",
      ogDescription:
        "面向各行业、各职业的 AI 工作流集合站，让 AI 真正融入你的日常工作",
    },
    submit: {
      title: "提交 Skill",
      description: "创建并分享你的 AI Skill 到 SkillHub 平台",
    },
    skillNotFound: "Skill 未找到",
  },
  hero: {
    heading1: "Introducing",
    heading2: "AI Skills.",
    description:
      "不只是提示词。SkillHub 为你思考、起草工作流、整理工具，并学习你的工作方式。AI 生产力的未来已经到来，就在你的浏览器中。",
    cta: "浏览 Skills",
    badge: "免费 & 开源",
  },
  features: {
    platforms: "平台支持",
    platformsValue: "Claude · Cursor · ChatGPT · OpenClaw",
    community: "社区",
    communityValue: "开源",
    install: "安装",
    installValue: "一键部署",
    coverage: "覆盖",
    coverageValue: "11 种角色 · 10 个场景",
  },
  nav: {
    skills: "Skills",
    submit: "提交",
  },
  footer: {
    tagline: "为 AI 时代而生。",
  },
  search: {
    placeholder: "按名称、描述或标签搜索 Skill...",
  },
  filter: {
    roleLabel: "角色",
    sceneLabel: "场景",
    all: "全部",
  },
  skillGrid: {
    noResults: "没有找到匹配的 Skill",
    noResultsHint: "尝试调整搜索关键词或筛选条件",
  },
  skillCard: {
    featured: "推荐",
    download: "下载 .md",
  },
  like: {
    button: "点赞",
  },
  metaSkill: {
    badge: "元技能",
    subtitle: "一个技能调用所有技能 — 自动匹配并执行最适合当前任务的 Skill",
    skillCount: "个技能可用",
    cta: "查看详情",
  },
  skillDetail: {
    featured: "推荐",
    author: "作者:",
    updatedAt: "更新于",
    source: "来源:",
    noContent: "暂无详细说明",
  },
  submitPage: {
    title: "提交 Skill",
    description:
      "填写以下信息，生成标准的 Markdown 文件。你可以复制或下载后提交给我们收录。",
  },
  submitForm: {
    nameLabel: "Skill 名称",
    namePlaceholder: "例如：周报自动生成",
    descLabel: "简短描述",
    descPlaceholder: "用一句话描述这个 Skill 的功能",
    rolesLabel: "适用职业 / 角色",
    scenesLabel: "技能场景",
    authorLabel: "作者",
    authorPlaceholder: "你的名字",
    tagsLabel: "标签（用逗号分隔）",
    tagsPlaceholder: "例如：周报、自动化、效率",
    contentLabel: "详细内容（Markdown 格式）",
    contentPlaceholder:
      "# Skill 名称\n\n## 使用场景\n\n描述这个 Skill 适用的场景...\n\n## 使用方法\n\n1. 第一步\n2. 第二步",
    generate: "生成 Markdown 文件",
    result: "生成结果",
    copy: "复制",
    download: "下载 .md 文件",
    required: "*",
  },
  notFound: {
    message: "页面未找到",
    backHome: "返回首页",
  },
  retroComputer: {
    snippets: [
      '---\nname: "结构化头脑风暴"\nroles: [everyone]\nscenes: [creative-design]\n---\n发散→收敛式思考，\n从模糊想法到可执行方案。',
      '---\nname: "PRD 需求文档撰写"\nroles: [product-manager]\nscenes: [writing]\n---\n结构化产品需求文档，\n包含用户故事和验收标准。',
      '---\nname: "数据分析师"\nroles: [data-analyst]\nscenes: [data-analysis]\n---\nAI 驱动数据可视化、报告生成、\nSQL 查询和电子表格处理。',
      '---\nname: "TikTok 营销"\nroles: [marketer]\nscenes: [creative-design]\n---\nAI 生成幻灯片、钩子测试、\n跨平台发布和数据分析。',
      '---\nname: "财务报表分析"\nroles: [finance]\nscenes: [decision-making]\n---\n解读财务三表数据，\n生成关键财务指标分析和经营建议。',
    ],
  },
  roles: {
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
  },
  scenes: {
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
  },
  sources: {
    "openclawskill.ai": "OpenClaw",
    "clawhub.ai": "ClawHub",
    "larrybrain.com": "LarryBrain",
    skillhub: "SkillHub",
  },
};

export default zh;
