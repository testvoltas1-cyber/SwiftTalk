// Simple profanity filter for optional blurring
const PROFANITY_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|bastard|dick|cunt|pussy|whore|slut|cock)\b/gi,
];

export function filterText(text: string, enabled: boolean): string {
  if (!enabled || !text) return text;

  let filtered = text;
  PROFANITY_PATTERNS.forEach((pattern) => {
    filtered = filtered.replace(pattern, (match) => {
      return match[0] + '*'.repeat(match.length - 1);
    });
  });

  return filtered;
}
