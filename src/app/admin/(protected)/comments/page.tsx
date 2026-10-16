import Link from "next/link";
import { deleteComment } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { pageTitle } from "@/components/admin/styles";
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
      <h1 className={`mb-6 ${pageTitle}`}>
        Коментари{" "}
        <span className="font-sans text-body font-medium text-muted-foreground tabular-nums">
          ({comments.length})
        </span>
      </h1>
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
                <div className="min-w-0">
                  <p className="font-semibold">{comment.author_name}</p>
                  <p className="text-small text-muted-foreground">
                    {comment.recipe ? (
                      <Link
                        href={`/recepti/${comment.recipe.slug}#comments-head`}
                        target="_blank"
                        className="font-medium text-link hover:underline"
                      >
                        {comment.recipe.title}
                      </Link>
                    ) : (
                      "изтрита рецепта"
                    )}{" "}
                    · {new Date(comment.created_at).toLocaleDateString("bg-BG")}
                  </p>
                </div>
                {comment.recipe && (
                  <form action={deleteComment.bind(null, comment.id)} className="shrink-0">
                    <ConfirmSubmitButton
                      message={`Изтриване на коментара от ${comment.author_name}?`}
                    >
                      Изтрий
                    </ConfirmSubmitButton>
                  </form>
                )}
              </div>
              <p className="mt-2 whitespace-pre-line">{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
