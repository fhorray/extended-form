export type ComprehensiveForm = {
  username: string;
  email: string;
  password: string;
  bio?: string;

  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    country?: 'us' | 'uk';
  };

  theme?: 'light' | 'dark' | 'system';
  notifications?: Array<'email' | 'push' | 'sms'>;
  interests?: Array<'tech' | 'science' | 'arts'>;

  age: number;
  budget?: {
    amount: number;
    currency: string; // "USD" por padrão, mas pode mudar se `showCurrencySelector` for true
  };
  completion?: number; // porcentagem de 0 a 100
  rating?: number; // de 0 a 10

  avatar?: File; // ou uma URL se você for fazer upload e salvar primeiro
  documents?: File[];

  coordinates?: {
    latitude: number;
    longitude: number;
  };
  region?: any; // depende muito de como é o formato do polígono selecionado no mapa

  experience?: Array<{
    company?: string;
    position?: string;
    period?: {
      start: string; // ISO date
      end: string;   // ISO date
    };
  }>;

  customFields?: Record<string, string>; // chave-valor livre
};
