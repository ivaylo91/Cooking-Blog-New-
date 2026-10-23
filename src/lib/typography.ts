// Bulgarian typesetting: a one-letter word (в, с, и, а, о, у, к) must not be
// left hanging at the end of a line, so it is tied to the word after it with
// a non-breaking space.
const SHORT_WORD = /(^|[\s(„"])([вВсСиИаАоОуУкК])\s+/g;

export function keepShortWords(text: string): string {
  // Run twice so a pair like "и в" binds both words.
  return text.replace(SHORT_WORD, "$1$2 ").replace(SHORT_WORD, "$1$2 ");
}
