import { CommentForm } from "@/components/CommentForm";
import { SectionHead } from "@/components/SectionHead";
import type { Comment } from "@/types/recipe";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });
}

export function Comments({
  recipeId,
  comments,
}: {
  recipeId: string;
  comments: Comment[];
}) {
  return (
    <section aria-labelledby="comments-head" className="mt-20">
      <SectionHead
        title={comments.length > 0 ? `Коментари (${comments.length})` : "Коментари"}
        id="comments-head"
      />

      <div className="grid gap-10 md:grid-cols-2">
        {comments.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-2xl bg-surface-muted p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-semibold">{comment.author_name}</span>
                  <span className="text-small text-muted-foreground tabular-nums">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="mt-2 leading-relaxed">{comment.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-muted-foreground">
            Още никой не е написал как се е получило. Сготвихте ли я? Разкажете
            първи: с какво я поднесохте, какво променихте.
          </p>
        )}

        <CommentForm recipeId={recipeId} />
      </div>
    </section>
  );
}
