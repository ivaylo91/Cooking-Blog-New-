import { deleteSubscriber } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { pageTitle } from "@/components/admin/styles";
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
        <h1 className={pageTitle}>
          Абонати{" "}
          <span className="font-sans text-body font-medium text-muted-foreground tabular-nums">
            ({subscribers.length})
          </span>
        </h1>
        {subscribers.length > 0 && (
          <CopyEmailsButton emails={subscribers.map((s) => s.email)} />
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
        <table className="w-full text-left">
          <thead className="border-b border-border-subtle text-muted-foreground">
            <tr className="text-small">
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
                    <ConfirmSubmitButton message={`Да се отпише ли ${subscriber.email}?`}>
                      Изтрий
                    </ConfirmSubmitButton>
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
