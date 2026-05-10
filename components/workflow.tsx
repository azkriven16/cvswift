import { Bot, FileText, GitPullRequest, Inbox, Rocket } from "lucide-react";

const steps = [
  { icon: Inbox, label: "Intake", text: "Feedback, incidents, and ideas become structured work automatically." },
  { icon: FileText, label: "Plan", text: "Roadmaps stay linked to specs, priorities, and live constraints." },
  { icon: Bot, label: "Build", text: "Agents pick up scoped tasks with context already attached." },
  { icon: GitPullRequest, label: "Review", text: "Diffs, risks, and ownership roll into one review surface." },
  { icon: Rocket, label: "Ship", text: "Release notes and launch pulses are generated from source activity." },
];

export function Workflow() {
  return (
    <section className="section workflow-section" id="workflow">
      <div className="section-heading">
        <p className="eyebrow">Workflow</p>
        <h2>A product system that shows the work moving.</h2>
      </div>
      <div className="workflow-rail">
        {steps.map(({ icon: Icon, label, text }, index) => (
          <article key={label}>
            <span className="step-index">0{index + 1}</span>
            <div className="step-icon"><Icon size={18} /></div>
            <h3>{label}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
