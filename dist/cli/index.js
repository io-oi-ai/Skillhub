#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const skills_1 = require("./commands/skills");
const auth_1 = require("./commands/auth");
const points_1 = require("./commands/points");
const program = new commander_1.Command();
program
    .name("skillhub")
    .description("Skillhub CLI for agents")
    .version("0.1.0");
(0, skills_1.registerSkillsCommands)(program);
(0, auth_1.registerAuthCommands)(program);
(0, points_1.registerPointsCommands)(program);
program.parseAsync(process.argv).catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
});
