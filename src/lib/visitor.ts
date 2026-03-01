const COOKIE_NAME = "skillhub_visitor_id";

export function getVisitorId(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  if (match) {
    return match.split("=")[1];
  }

  const id = crypto.randomUUID();
  // 1 year expiry
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${id}; path=/; expires=${expires}; SameSite=Lax`;
  return id;
}
