"use client";

import { FilePlus2, FileText, LogOut, Moon, PanelLeft, Search, Settings2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const mainLinks = [
  { href: "/app/resumes/create", label: "New resume", icon: FilePlus2 },
];

type Resume = { id: string; title: string };

function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inputRef.current?.focus();
    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("resumes")
        .select("id, title")
        .order("updated_at", { ascending: false })
        .limit(50);
      setResumes((data ?? []).map((r: { id: string; title: string | null }) => ({ id: r.id, title: r.title || "Untitled" })));
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  function pick(id: string) {
    router.push(`/app/resumes/${id}`);
    onClose();
  }

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search resumes">
        <div className="search-modal-input-row">
          <Search size={16} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search resumes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="icon-button" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="search-modal-results">
          {loading && <p className="search-modal-empty">Loading…</p>}
          {!loading && filtered.length === 0 && <p className="search-modal-empty">No resumes found.</p>}
          {filtered.map((r) => (
            <button key={r.id} type="button" className="search-modal-item" onClick={() => pick(r.id)}>
              <FileText size={14} />
              {r.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children, userLabel, recents = [] }: { children: React.ReactNode; userLabel?: string; recents?: Array<{ id: string; title: string }> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={open ? "app-shell app-shell-open" : "app-shell"}>
      {searching && <SearchModal onClose={() => setSearching(false)} />}

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
          <button type="button" onClick={() => setSearching(true)}>
            <Search size={16} />
            Search resumes
          </button>
          <Link href="/app/preferences" className="sidebar-link">
            <Settings2 size={16} />
            Preferences
          </Link>
        </div>

        <div className="sidebar-recents">
          <span>Recents</span>
          {recents.length === 0 ? (
            <Link href="/app/resumes/create" className="sidebar-empty-recent">Start a resume</Link>
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
