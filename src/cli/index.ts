#!/usr/bin/env node
import { Command } from "commander";
import { registerSkillsCommands } from "./commands/skills";
import { registerAuthCommands } from "./commands/auth";
import { registerPointsCommands } from "./commands/points";
import { registerEvalCommands } from "./commands/eval";

const program = new Command();

program
  .name("skillhub")
  .description("Skillhub CLI for agents")
  .version("0.1.0");

registerSkillsCommands(program);
registerAuthCommands(program);
registerPointsCommands(program);
registerEvalCommands(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
