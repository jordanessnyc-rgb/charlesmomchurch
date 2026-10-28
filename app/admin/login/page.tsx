import Image from "next/image";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-raised">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.jpg" alt="" width={44} height={44} className="rounded-full ring-2 ring-gold-500/60" />
          <div>
            <p className="font-semibold text-navy-800">Casa de Milagros</p>
            <p className="text-xs text-muted">Admin dashboard</p>
          </div>
        </div>
        {adminConfigured() ? (
          <LoginForm next={next ?? "/admin"} />
        ) : (
          <p className="mt-6 rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm text-navy-900">
            The admin dashboard is not configured yet. Set <code>ADMIN_PASSWORD</code> and <code>AUTH_SECRET</code> in the environment variables and redeploy.
          </p>
        )}
      </div>
    </div>
  );
}
