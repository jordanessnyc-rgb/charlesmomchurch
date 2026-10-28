"use client";

import { useActionState } from "react";
import { loginAction, type ActionResult } from "@/lib/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(loginAction, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" autoFocus />
      </div>
      {state && !state.ok && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="w-full rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
