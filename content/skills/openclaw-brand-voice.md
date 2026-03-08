---
name: "Brand Voice"
description: "Define and store brand voice configuration to ensure consistent style across all AI-generated content"
author: "OpenClaw Community"
roles: ["marketer", "operations"]
scenes: ["writing", "communication"]
version: "1.0.0"
updatedAt: "2025-02-10"
tags: ["OpenClaw", "Brand", "Voice", "Content Consistency", "collection:marketing"]
featured: false
source: "clawhub.ai"
---

## Overview

Brand Voice solves a common pain point: when multiple team members use AI to generate content, the output often has inconsistent tone, style, and vocabulary, failing to maintain brand consistency. This skill allows you to define, store, and reuse brand voice configurations to ensure all AI-generated content adheres to unified brand personality.

## Core Features

### Brand Voice Definition

Through a structured template, you can define brand voice characteristics from multiple dimensions: formality level, humor, professional depth, emotional tone, sentence structure preferences, and prohibited vocabulary. The system provides a guided Q&A process to help you transform vague brand feelings into precise voice parameters.

### Voice Configuration Storage and Version Management

Defined voice configurations are stored as files with version management support. When brand personality needs adjusting, you can create new versions while preserving historical configurations for easy review and comparison. Different product lines or sub-brands can have their own independent voice configurations.

### Content Style Validation

Before generating any content, the Agent automatically loads the currently activated brand voice configuration. After generation, the system validates consistency against the voice standards, flagging sections that don't align with brand personality and providing modification suggestions.

### Voice Migration and Adaptation

When you need to adapt the same content to different channels, Brand Voice automatically adjusts the tone. For example, transform official announcements into social media style, or convert technical documentation into language suitable for general users, while maintaining core brand characteristics.

## Typical Use Cases

- **Multi-person Content Collaboration**: Multiple team members in marketing simultaneously use AI tools to create content. Sharing a brand voice configuration ensures consistent output style.
- **New Employee Fast Onboarding**: New content creators don't need to spend extensive time learning brand guidelines. AI automatically generates content following brand voice, accelerating the onboarding process.
- **Cross-channel Content Adaptation**: The same core content needs publishing across multiple channels like company websites, WeChat Official Accounts, short video scripts, etc. Brand Voice helps automatically adjust to styles suitable for each channel.
- **Brand Upgrade Transition**: When brand personality needs to shift from "young and lively" to "mature and professional", smooth transitions are achieved by adjusting voice configurations, avoiding style discontinuity.
- **Multi-language Brand Consistency**: Ensure brand content remains consistent across translations or multi-language generation, with different language versions conveying the same brand personality.

## Usage Instructions

1. Integrate the Brand Voice skill and run the voice definition wizard.
2. Answer a series of questions about brand personality, or directly upload existing brand guidelines documents.
3. The system generates a voice configuration file that you can preview with sample content and fine-tune parameters.
4. Apply the voice configuration to your team's Agent workflows. All subsequent content generation will follow this configuration.

## Synergy with Other Skills

Brand Voice seamlessly integrates with content generation skills like Blog Writer and AgenticMail. When these skills generate content, they automatically read the Brand Voice configuration, guaranteeing output style consistency at the source without requiring post-production manual corrections.
