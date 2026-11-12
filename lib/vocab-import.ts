export type ImportFormat = 'tab' | 'dash' | 'colon' | 'space';

export const IMPORT_FORMATS: { value: ImportFormat; label: string; separator: string; help: string }[] = [
  { value: 'tab', label: 'Tab', separator: 'TAB ↹', help: 'term<TAB>definition. A third TAB column can hold a Context Cloze sentence.' },
  { value: 'dash', label: 'Dash', separator: '—', help: 'term - definition. The first spaced dash separates the card.' },
  { value: 'colon', label: 'Colon', separator: ':', help: 'term: definition. Only the first colon separates the card.' },
  { value: 'space', label: 'Space', separator: 'SPACE', help: 'The first word is the term; everything after it is the definition.' },
];

type ParsedVocabLine = {
  term: string;
  definition: string;
  context?: string;
  valid: boolean;
};

export function parseVocabLine(line: string, selectedFormat: ImportFormat): ParsedVocabLine {
  const invalid: ParsedVocabLine = { term: '', definition: '', context: undefined, valid: false };
  if (selectedFormat === 'tab') {
    const columns = line.split('\t').map((value) => value.trim());
    const [term = '', definition = '', context = ''] = columns;
    return { term, definition, context: context || undefined, valid: columns.length >= 2 && columns.length <= 3 && Boolean(term && definition) };
  }

  const separator = selectedFormat === 'dash' ? /\s+[–—-]\s+/ : selectedFormat === 'colon' ? /\s*:\s*/ : /\s+/;
  const trimmed = line.trim();
  const match = separator.exec(trimmed);
  if (!match || match.index <= 0) return invalid;
  const term = trimmed.slice(0, match.index).trim();
  const definition = trimmed.slice(match.index + match[0].length).trim();
  return { term, definition, context: undefined, valid: Boolean(term && definition) };
}
