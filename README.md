# Memory Heist — Vocab Run

![Memory Heist social preview](public/og.png)

Memory Heist is a fast, private vocabulary arcade for SAT, A-Level, and
self-directed study. Paste or import a word set, choose a run type, and practise
recall through short keyboard-friendly games. The app is offline-ready and does
not require an account.

**Live app:** [memory-heist-vocab.slowlyfaierman.chatgpt.site](https://memory-heist-vocab.slowlyfaierman.chatgpt.site)

## Game modes

- Recall and Perfect Recall for typed active retrieval.
- Quick Pick and Mixed Raid for timed multiple-choice practice.
- Matching, Definition Jigsaw, Recall Ladder, and Context Cloze puzzles.
- Blind Elimination for five-column question-bank imports.

## Features

- Tab, CSV, arrow, colon, and custom-delimiter imports.
- Forward, reverse, and mixed study directions.
- Lenient, balanced, and strict answer matching with typo feedback.
- Timers, streaks, recovery queues, keyboard shortcuts, sound controls, and a
  distraction-free focus mode.
- Local PWA shell and service worker for offline study.
- No sign-in, analytics profile, or remote vocabulary storage.

## Local development

Requirements: Node.js 22.13+ and pnpm 11.

```bash
git clone https://github.com/byAsyl/vocab-run.git
cd vocab-run
pnpm install --frozen-lockfile
pnpm dev
```

Then open the local URL printed by the development server.

## Quality checks

```bash
pnpm lint
pnpm build
```

## Import examples

The simplest format is one tab-separated card per line:

```text
mitigate\tmake less severe\tShade trees can {{term}} summer heat.
equivocal\tambiguous or open to multiple interpretations
```

Question-bank mode expects five tab-separated columns: question, correct
answer, and three distinct wrong answers.

## License

[MIT](LICENSE) © 2026 Assylzhan Koikatov.

