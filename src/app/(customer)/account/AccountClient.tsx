"use client";

import { useState } from "react";
import { Pencil, Check, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

export default function AccountClient({ user }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const saveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditing(false);
      router.refresh();
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[#3a0820]">Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-[#6b1040] hover:underline">
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <dl className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <dt className="w-20 text-xs font-medium text-[#3a0820]/50">Name</dt>
          <dd className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-xl border border-[#6b1040]/20 px-3 py-1.5 text-sm outline-none focus:border-[#6b1040]"
                  autoFocus
                />
                <button onClick={saveName} disabled={saving} className="rounded-lg bg-green-50 p-1.5 text-green-600 hover:bg-green-100 disabled:opacity-50">
                  <Check size={14} />
                </button>
                <button onClick={() => { setEditing(false); setName(user.name ?? ""); }} className="rounded-lg bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100">
                  <X size={14} />
                </button>
              </div>
            ) : (
              user.name
                ? <span className="text-[#3a0820]">{user.name}</span>
                : <span className="text-[#3a0820]/30 italic">Not set</span>
            )}
          </dd>
        </div>
        {user.email && (
          <div className="flex items-center gap-3">
            <dt className="w-20 text-xs font-medium text-[#3a0820]/50">Email</dt>
            <dd className="text-[#3a0820]">{user.email}</dd>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-3">
            <dt className="w-20 text-xs font-medium text-[#3a0820]/50">Phone</dt>
            <dd className="text-[#3a0820]">{user.phone}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 border-t border-[#6b1040]/8 pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
