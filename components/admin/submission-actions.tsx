"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSubmissionAction, publishTestimonyAction, updateSubmissionAction } from "@/lib/admin/actions";

export function SubmissionActions({ id, type, status, notes, allowShare }: { id: string; type: string; status: string; notes: string; allowShare: boolean }) {
  const [s, setS] = useState(status);
  const [n, setN] = useState(notes);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" className="input" value={s} onChange={(e) => setS(e.target.value)}>
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="label">Internal notes</label>
          <textarea id="notes" className="input min-h-24" value={n} onChange={(e) => setN(e.target.value)} placeholder="Who followed up, what was done…" />
        </div>
      </div>
      {msg && <p className="text-sm text-navy-800">{msg}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await updateSubmissionAction(id, s, n);
              setMsg(r.ok ? "Saved." : r.error);
              router.refresh();
            })
          }
          className="rounded-full bg-navy-800 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          Save
        </button>
        {type === "testimony" && (
          <button
            type="button"
            disabled={pending || !allowShare}
            title={allowShare ? "Publish on the Impact page" : "No permission to share was given"}
            onClick={() =>
              start(async () => {
                const r = await publishTestimonyAction(id);
                setMsg(r.ok ? "Published as a testimonial. Edit it under Content → Testimonials." : r.error);
                router.refresh();
              })
            }
            className="rounded-full border border-gold-500 px-5 py-2 text-sm font-semibold text-gold-700 hover:bg-gold-50 disabled:opacity-50"
          >
            Publish as testimonial
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm("Permanently delete this submission?")) return;
            start(async () => {
              await deleteSubmissionAction(id);
            });
          }}
          className="rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
