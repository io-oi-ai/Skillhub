export interface EvalRules {
  contains?: string[];
  regex?: string[];
  min_length?: number;
  max_length?: number;
}

export interface EvalResult {
  status: "pass" | "fail" | "unknown";
  reason?: string;
}

export function evaluateOutput(
  output: string | null | undefined,
  rules: EvalRules | null | undefined
): EvalResult {
  const normalizedRules = rules ?? {};
  const hasRules =
    (normalizedRules.contains && normalizedRules.contains.length > 0) ||
    (normalizedRules.regex && normalizedRules.regex.length > 0) ||
    typeof normalizedRules.min_length === "number" ||
    typeof normalizedRules.max_length === "number";

  if (!output || output.trim().length === 0) {
    return {
      status: "unknown",
      reason: hasRules ? "no output provided" : "no output and no rules",
    };
  }

  const out = output;

  if (normalizedRules.contains && normalizedRules.contains.length > 0) {
    for (const keyword of normalizedRules.contains) {
      if (!out.includes(keyword)) {
        return {
          status: "fail",
          reason: `missing keyword: ${keyword}`,
        };
      }
    }
  }

  if (normalizedRules.regex && normalizedRules.regex.length > 0) {
    for (const pattern of normalizedRules.regex) {
      const re = new RegExp(pattern, "m");
      if (!re.test(out)) {
        return {
          status: "fail",
          reason: `regex not matched: ${pattern}`,
        };
      }
    }
  }

  if (typeof normalizedRules.min_length === "number") {
    if (out.length < normalizedRules.min_length) {
      return {
        status: "fail",
        reason: `length < ${normalizedRules.min_length}`,
      };
    }
  }

  if (typeof normalizedRules.max_length === "number") {
    if (out.length > normalizedRules.max_length) {
      return {
        status: "fail",
        reason: `length > ${normalizedRules.max_length}`,
      };
    }
  }

  if (!hasRules) {
    return { status: "unknown", reason: "no rules provided" };
  }

  return { status: "pass" };
}
