const en = {
  metadata: {
    home: {
      title: "SkillHub — Discover the Best AI Agent Skills",
      description:
        "A curated collection of AI workflows for every industry and role. Browse, search, and share high-quality AI Skills.",
      keywords: [
        "AI Skills",
        "AI Workflows",
        "AI Productivity",
        "AI Tools",
        "Prompts",
        "Agent",
      ],
      ogTitle: "SkillHub — Discover the Best AI Agent Skills",
      ogDescription:
        "A curated collection of AI workflows for every industry and role. Let AI truly integrate into your daily work.",
    },
    submit: {
      title: "Submit Skill",
      description: "Create and share your AI Skill on the SkillHub platform",
    },
    skillNotFound: "Skill Not Found",
  },
  hero: {
    heading1: "Introducing",
    heading2: "AI Skills.",
    description:
      "Not just prompts. SkillHub thinks, drafts your workflows, organizes your tools, and learns how you work. The future of AI productivity is here. And it fits in your browser.",
    cta: "Browse Skills",
    badge: "Free & Open Source",
  },
  features: {
    platforms: "Platforms",
    platformsValue: "Claude · Cursor · ChatGPT · OpenClaw",
    community: "Community",
    communityValue: "Open Source",
    install: "Install",
    installValue: "One-click Setup",
    coverage: "Coverage",
    coverageValue: "11 Roles · 10 Scenes",
  },
  nav: {
    skills: "Skills",
    submit: "Submit",
  },
  footer: {
    tagline: "Built for the AI era.",
  },
  search: {
    placeholder: "Search skills by name, description, or tags...",
  },
  filter: {
    roleLabel: "Role",
    sceneLabel: "Scene",
    all: "All",
  },
  skillGrid: {
    noResults: "No matching Skills found",
    noResultsHint: "Try adjusting your search keywords or filters",
  },
  skillCard: {
    featured: "Featured",
  },
  skillDetail: {
    featured: "Featured",
    author: "Author:",
    updatedAt: "Updated",
    source: "Source:",
    noContent: "No detailed description available",
  },
  submitPage: {
    title: "Submit Skill",
    description:
      "Fill in the details below to generate a standard Markdown file. You can copy or download it and submit to us for inclusion.",
  },
  submitForm: {
    nameLabel: "Skill Name",
    namePlaceholder: "e.g., Auto Weekly Report",
    descLabel: "Short Description",
    descPlaceholder: "Describe this Skill in one sentence",
    rolesLabel: "Applicable Roles",
    scenesLabel: "Skill Scenes",
    authorLabel: "Author",
    authorPlaceholder: "Your name",
    tagsLabel: "Tags (comma separated)",
    tagsPlaceholder: "e.g., report, automation, productivity",
    contentLabel: "Detailed Content (Markdown)",
    contentPlaceholder:
      "# Skill Name\n\n## Use Cases\n\nDescribe the scenarios this Skill applies to...\n\n## How to Use\n\n1. Step one\n2. Step two",
    generate: "Generate Markdown File",
    result: "Generated Result",
    copy: "Copy",
    download: "Download .md File",
    required: "*",
  },
  notFound: {
    message: "Page Not Found",
    backHome: "Back to Home",
  },
  retroComputer: {
    snippets: [
      '---\nname: "Structured Brainstorming"\nroles: [everyone]\nscenes: [creative-design]\n---\nDivergent → convergent thinking,\nfrom vague ideas to actionable plans.',
      '---\nname: "PRD Writing"\nroles: [product-manager]\nscenes: [writing]\n---\nStructured product requirements\nwith user stories & acceptance criteria.',
      '---\nname: "Data Analyst"\nroles: [data-analyst]\nscenes: [data-analysis]\n---\nAI-driven visualization, reports,\nSQL queries & spreadsheet processing.',
      '---\nname: "TikTok Marketing"\nroles: [marketer]\nscenes: [creative-design]\n---\nAuto-generate slides, hook testing,\ncross-platform publishing & analytics.',
      '---\nname: "Financial Analysis"\nroles: [finance]\nscenes: [decision-making]\n---\nParse financial statements,\ngenerate KPI analysis & business advice.',
    ],
  },
  roles: {
    developer: "Developer",
    "product-manager": "Product Manager",
    designer: "Designer",
    marketer: "Marketing",
    "data-analyst": "Data Analyst",
    operations: "Operations",
    hr: "Human Resources",
    finance: "Finance",
    legal: "Legal",
    educator: "Education",
    everyone: "Everyone",
  },
  scenes: {
    writing: "Writing",
    coding: "Coding",
    "data-analysis": "Data Analysis",
    "project-management": "Project Management",
    "creative-design": "Creative Design",
    communication: "Communication",
    workflow: "Workflow",
    research: "Research",
    "decision-making": "Decision Making",
    learning: "Learning",
  },
  sources: {
    "openclawskill.ai": "OpenClaw",
    "clawhub.ai": "ClawHub",
    "larrybrain.com": "LarryBrain",
    skillhub: "SkillHub",
  },
};

export type Dictionary = typeof en;
export default en;
