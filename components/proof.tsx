const companies = ["Supabase", "Stripe", "PostHog", "Resend", "OpenAI", "Inngest"];

export function Proof() {
  return (
    <section className="proof" id="proof" aria-label="Customer proof">
      <p>Built on the modern open-source SaaS stack</p>
      <div>
        {companies.map((company) => (
          <span key={company}>{company}</span>
        ))}
      </div>
    </section>
  );
}
