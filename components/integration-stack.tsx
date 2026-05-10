import { serviceStatuses } from "@/lib/mock-data";

export function IntegrationStack() {
  return (
    <section className="section stack-section" id="stack">
      <div className="section-heading">
        <p className="eyebrow">Open-source stack</p>
        <h2>Production integrations, mocked until env is ready.</h2>
      </div>
      <div className="stack-grid">
        {serviceStatuses.map((service) => (
          <article key={service.name}>
            <span>{service.status}</span>
            <strong>{service.name}</strong>
            <p>{service.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
