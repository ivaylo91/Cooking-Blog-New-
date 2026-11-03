import { startTransition, type FormEvent } from "react";

/**
 * An `onSubmit` handler that runs a form's action inside a transition. React
 * clears a form after its action; submitted this way, what the reader typed
 * stays in the fields when the action fails. Without JavaScript the form's
 * plain `action` still works.
 */
export function submitInTransition(action: (data: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  };
}
