import { deleteComment } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

interface CommentRow {
  id: string;
  author_name: string;
  text: string;
  created_at: string;
  recipe: { slug: string; title: string } | null;
}

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, author_name, text, created_at, recipe:recipes(slug, title)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const comments = data as unknown as CommentRow[];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold">Коментари</h1>
      {comments.length === 0 ? (
        <p className="text-muted-foreground">Все още няма коментари.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-border-subtle bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{comment.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {comment.recipe?.title ?? "изтрита рецепта"} ·{" "}
                    {new Date(comment.created_at).toLocaleDateString("bg-BG")}
                  </p>
                </div>
                {comment.recipe && (
                  <form action={deleteComment.bind(null, comment.id, comment.recipe.slug)}>
                    <button type="submit" className="text-xs text-destructive hover:underline">
                      Изтрий
                    </button>
                  </form>
                )}
              </div>
              <p className="mt-2 text-sm">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
