/** Pastel gradients for quiz cards; each quiz keeps the same one by id. */
const GRADIENTS = [
  'bg-[linear-gradient(120deg,#b8f0d8,#bfe6f2,#d9d6f5,#b8f0d8)]',
  'bg-[linear-gradient(120deg,#ffd9c2,#ffc8dd,#e2d4ff,#ffd9c2)]',
  'bg-[linear-gradient(120deg,#f6f1b5,#c8f0d0,#b9e3f5,#f6f1b5)]',
  'bg-[linear-gradient(120deg,#e0d4ff,#c9dcff,#bdf0f0,#e0d4ff)]',
  'bg-[linear-gradient(120deg,#bcd9f7,#dfeaf5,#fbefb0,#bcd9f7)]',
] as const;

export function quizGradient(id: number) {
  return GRADIENTS[id % GRADIENTS.length];
}

export function formatDate(iso: string) {
  // Fixed time zone keeps server and client output identical
  return new Date(iso).toLocaleDateString('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  });
}

export function pluralizeQuestions(count: number) {
  return `${count} ${count === 1 ? 'question' : 'questions'}`;
}
