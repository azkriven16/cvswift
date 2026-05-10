export function SetupRequired({ missing }: { missing: string[] }) {
  return (
    <section className="section">
      <div className="setup-card">
        <p className="eyebrow">Setup required</p>
        <h1>Connect the free hosted stack.</h1>
        <p>
          Add these env vars to <code>.env.local</code>, restart the dev server, then run the Supabase SQL schema.
        </p>
        <div className="env-list">
          {missing.map((name) => (
            <code key={name}>{name}</code>
          ))}
        </div>
        <p className="form-message">See <code>docs/README.md</code> and <code>supabase/schema.sql</code> in the repo.</p>
      </div>
    </section>
  );
}
