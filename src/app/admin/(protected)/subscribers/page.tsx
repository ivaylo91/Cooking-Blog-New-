import { Mail } from "lucide-react";
import { deleteSubscriber } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { CopyEmailsButton } from "@/components/admin/CopyEmailsButton";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function SubscribersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const subscribers = (data ?? []) as Subscriber[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold">
          <Mail size={20} className="text-accent" />
          Абонати
          <span className="text-base font-normal text-muted-foreground">
            ({subscribers.length})
          </span>
        </h1>
        {subscribers.length > 0 && (
          <CopyEmailsButton emails={subscribers.map((s) => s.email)} />
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle text-muted-foreground">
            <tr>
              <th className="py-3 pl-4 pr-4">Имейл</th>
              <th className="py-3 pr-4">Записан на</th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-border-subtle last:border-0">
                <td className="py-3 pl-4 pr-4 font-medium">{subscriber.email}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {formatDate(subscriber.created_at)}
                </td>
                <td className="py-3 pr-4 text-right">
                  <form action={deleteSubscriber.bind(null, subscriber.id)}>
                    <button
                      type="submit"
                      className="text-xs font-medium text-destructive hover:text-destructive-strong hover:underline"
                    >
                      Изтрий
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">Все още няма абонати.</p>
        )}
      </div>
    </div>
  );
}
