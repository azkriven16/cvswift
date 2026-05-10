export function hasTurnstileEnv() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstile(token: string | undefined, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) return { success: true as const };
  if (!token) return { success: false as const, error: "Missing challenge token." };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });

  const data = (await response.json()) as { success: boolean };
  if (!data.success) return { success: false as const, error: "Challenge failed. Please try again." };
  return { success: true as const };
}
