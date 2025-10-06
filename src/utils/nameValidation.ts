// Nome validation utility with LGPD compliance
export const NAME_VALIDATION = {
  REGEX: /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,20}$/,
  MIN_LENGTH: 2,
  MAX_LENGTH: 20,
  BANNED_WORDS: [
    'admin', 'test', 'fake', 'spam', 'bot', 'null', 'undefined',
    'delete', 'drop', 'script', 'select', 'insert', 'update',
    'porra', 'merda', 'caralho', 'puta', 'fodeu', 'buceta'
  ]
};

export interface NameValidationResult {
  isValid: boolean;
  error?: string;
  cleaned?: string;
}

export const validateName = (input: string): NameValidationResult => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  const trimmed = input.trim();
  
  if (trimmed.length < NAME_VALIDATION.MIN_LENGTH) {
    return { isValid: false, error: 'Digite pelo menos 2 letras' };
  }

  if (trimmed.length > NAME_VALIDATION.MAX_LENGTH) {
    return { isValid: false, error: 'Nome muito longo (máximo 20 caracteres)' };
  }

  if (!NAME_VALIDATION.REGEX.test(trimmed)) {
    return { isValid: false, error: 'Digite só o primeiro nome (apenas letras)' };
  }

  // Check for banned words
  const lowerTrimmed = trimmed.toLowerCase();
  const hasBannedWord = NAME_VALIDATION.BANNED_WORDS.some(word => 
    lowerTrimmed.includes(word)
  );
  
  if (hasBannedWord) {
    return { isValid: false, error: 'Digite um nome válido' };
  }

  // Capitalize each word
  const capitalized = trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return { isValid: true, cleaned: capitalized };
};

export const getNameLengthBucket = (name: string): string => {
  const len = name.trim().length;
  if (len <= 3) return '2-3';
  if (len <= 6) return '4-6';
  return '7+';
};

export const hashName = async (name: string): Promise<string> => {
  if (!name || typeof crypto === 'undefined' || !crypto.subtle) {
    return '';
  }
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(name.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
};

// Local storage helpers
export const saveFirstName = (name: string): void => {
  if (name && name.trim()) {
    localStorage.setItem('first_name', name.trim());
  } else {
    localStorage.removeItem('first_name');
  }
};

export const getFirstName = (): string => {
  return localStorage.getItem('first_name') || '';
};

export const clearFirstName = (): void => {
  localStorage.removeItem('first_name');
};