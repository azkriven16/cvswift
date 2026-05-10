"use client";

import { FilePlus2, FileText, LogOut, Moon, PanelLeft, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mainLinks = [
  { href: "/app/resumes/new", label: "New resume", icon: FilePlus2 },
];

export function AppShell({ children, userLabel, recents = [] }: { children: React.ReactNode; userLabel?: string; recents?: Array<{ id: string; title: string }> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={open ? "app-shell app-shell-open" : "app-shell"}>
      <aside className="app-sidebar" aria-label="Workspace sidebar">
        <div className="sidebar-brand-row">
          <Link className="brand" href="/app/resumes/new" aria-label="CVSwift workspace">
            <span className="brand-mark">
              <FileText size={15} />
            </span>
            <span>CVSwift</span>
          </Link>
          <button className="icon-button sidebar-close" type="button" aria-label="Close sidebar" onClick={() => setOpen(false)}>
            <PanelLeft size={17} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary workspace">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link className={active ? "sidebar-link sidebar-link-active" : "sidebar-link"} href={link.href} key={link.href}>
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-tools">
          <button type="button">
            <Search size={16} />
            Search resumes
          </button>
          <button type="button">
            <Settings2 size={16} />
            Preferences
          </button>
        </div>

        <div className="sidebar-recents">
          <span>Recents</span>
          {recents.length === 0 ? (
            <Link href="/app/resumes/new" className="sidebar-empty-recent">Start a resume</Link>
          ) : (
            recents.map((item) => (
              <Link href={`/app/resumes/${item.id}`} key={item.id}>
                <strong>{item.title}</strong>
              </Link>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          {userLabel && <span className="app-user-label">{userLabel}</span>}
          <button className="sidebar-link" type="button" onClick={() => setLight((value) => !value)}>
            <Moon size={16} />
            Theme
          </button>
          <Link className="sidebar-link" href="/logout">
            <LogOut size={16} />
            Sign out
          </Link>
        </div>
      </aside>

      <div className="app-main-shell">
        <button className="icon-button app-menu-button" type="button" aria-label="Open sidebar" onClick={() => setOpen(true)}>
          <PanelLeft size={18} />
        </button>
        <div className="app-shell-content">{children}</div>
      </div>

      <button className="sidebar-backdrop" type="button" aria-label="Close sidebar" onClick={() => setOpen(false)} />
    </div>
  );
}
