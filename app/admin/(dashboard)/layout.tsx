import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/admin/actions";
import { collectionSchemas } from "@/lib/admin/schemas";
import { collectionNames } from "@/lib/content/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/inbox", label: "Inbox (form submissions)" },
    { href: "/admin/donations", label: "Donations" },
    { href: "/admin/settings", label: "Settings" },
  ];
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white md:flex">
        <div className="flex items-center gap-3 border-b border-line p-5">
          <Image src="/images/logo.jpg" alt="" width={40} height={40} className="rounded-full ring-2 ring-gold-500/60" />
          <div>
            <p className="text-sm font-semibold text-navy-800">Casa de Milagros</p>
            <p className="text-xs text-muted">Admin</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 text-sm">
          <ul className="space-y-0.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block rounded-lg px-3 py-2 font-medium text-navy-800 hover:bg-navy-50">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Content</p>
          <ul className="mt-1 space-y-0.5">
            {collectionNames.map((c) => (
              <li key={c}>
                <Link href={`/admin/content/${c}`} className="block rounded-lg px-3 py-2 text-navy-800 hover:bg-navy-50">
                  {collectionSchemas[c].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 border-t border-line p-3 text-sm">
          <Link href="/en" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-navy-800 hover:bg-navy-50">
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-navy-800 hover:bg-navy-50">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:hidden">
          <Link href="/admin" className="font-semibold text-navy-800">Admin</Link>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full border border-line px-3 py-1.5 text-sm">Menu</summary>
            <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-line bg-white p-2 text-sm shadow-raised">
              {[...nav, ...collectionNames.map((c) => ({ href: `/admin/content/${c}`, label: collectionSchemas[c].label }))].map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 hover:bg-navy-50">
                  {n.label}
                </Link>
              ))}
              <form action={logoutAction}>
                <button type="submit" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-navy-50">Sign out</button>
              </form>
            </div>
          </details>
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
