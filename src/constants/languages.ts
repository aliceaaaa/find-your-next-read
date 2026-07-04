export type Language = { code: string; name: string };

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ch', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'he', name: 'Hebrew' },
];

const ALIASES: Record<string, string> = {
  zh: 'Chinese',
};

export const languageName = (code?: string | null): string => {
  if (!code) return '';
  const found = LANGUAGES.find((l) => l.code === code);
  if (found) return found.name;
  return ALIASES[code] ?? code;
};
