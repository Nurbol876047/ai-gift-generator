export const translations = {
  ru: {
    title: 'AI Генератор Подарков',
    subtitle: 'Найдите идеальный подарок с помощью искусственного интеллекта',
    age: 'Возраст',
    gender: 'Пол',
    genderOptions: {
      Female: 'Женский',
      Male: 'Мужской',
      Other: 'Другой'
    },
    occasion: 'Повод',
    occasionOptions: {
      Birthday: 'День рождения',
      Anniversary: 'Годовщина',
      'New Year': 'Новый год',
      Graduation: 'Выпускной',
      Other: 'Другой'
    },
    budget: 'Бюджет (тенге)',
    interests: 'Интересы',
    interestsPlaceholder: 'спорт, музыка, IT...',
    generate: 'Сгенерировать',
    generateAgain: 'Сгенерировать снова',
    copy: 'Копировать',
    download: 'Скачать PDF',
    share: 'Поделиться',
    why: 'Почему подходит',
    price: 'Примерная цена',
    loading: 'Генерируем идеи...',
    error: 'Произошла ошибка',
    offlineMode: 'Офлайн режим',
    offlineDescription: 'Попробуйте офлайн режим для получения идей',
    tryOffline: 'Попробовать офлайн',
    theme: 'Тема',
    light: 'Светлая',
    dark: 'Темная',
    language: 'Язык',
    emptyState: 'Заполните форму и нажмите "Сгенерировать" для получения идей подарков',
    copied: 'Скопировано!',
    shared: 'Поделились!',
    aiPowered: 'AI by Mistral (via HF)',
    currency: 'тенге'
  },
  en: {
    title: 'AI Gift Generator',
    subtitle: 'Find the perfect gift with artificial intelligence',
    age: 'Age',
    gender: 'Gender',
    genderOptions: {
      Female: 'Female',
      Male: 'Male',
      Other: 'Other'
    },
    occasion: 'Occasion',
    occasionOptions: {
      Birthday: 'Birthday',
      Anniversary: 'Anniversary',
      'New Year': 'New Year',
      Graduation: 'Graduation',
      Other: 'Other'
    },
    budget: 'Budget (tenge)',
    interests: 'Interests',
    interestsPlaceholder: 'sports, music, IT...',
    generate: 'Generate',
    generateAgain: 'Generate Again',
    copy: 'Copy',
    download: 'Download PDF',
    share: 'Share',
    why: 'Why it fits',
    price: 'Approximate price',
    loading: 'Generating ideas...',
    error: 'An error occurred',
    offlineMode: 'Offline Mode',
    offlineDescription: 'Try offline mode to get gift ideas',
    tryOffline: 'Try Offline',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    emptyState: 'Fill out the form and click "Generate" to get gift ideas',
    copied: 'Copied!',
    shared: 'Shared!',
    aiPowered: 'AI by Mistral (via HF)',
    currency: 'tenge'
  }
};

export function t(key, lang = 'ru') {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
