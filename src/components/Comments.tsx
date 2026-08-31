import { addComment } from "@/app/recepti/actions";
import type { Comment } from "@/types/recipe";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });
}

export function Comments({
  recipeId,
  slug,
  comments,
}: {
  recipeId: string;
  slug: string;
  comments: Comment[];
}) {
  return (
    <section className="mt-12 border-t border-border-subtle pt-8">
      <h2 className="mb-5 font-heading text-xl font-semibold">
        Коментари {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length > 0 && (
        <ul className="mb-8 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-border-subtle bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{comment.author_name}</span>
                <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}

      <form action={addComment.bind(null, recipeId, slug)} className="flex flex-col gap-3">
        <input
          type="text"
          name="author_name"
          required
          maxLength={60}
          placeholder="Вашето име"
          className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <textarea
          name="text"
          required
          maxLength={1000}
          rows={3}
          placeholder="Напишете коментар..."
          className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="self-start rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong"
        >
          Публикувай коментар
        </button>
      </form>
    </section>
  );
}
