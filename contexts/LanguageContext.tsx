'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'kk' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Event
    'event.title': 'Event Title',
    'event.description': 'Description',
    'event.date': 'Date',
    'event.location': 'Location',
    'event.maxGuests': 'Max Guests',
    'event.tableSize': 'Table Size',
    
    // RSVP
    'rsvp.name': 'Name',
    'rsvp.email': 'Email (Optional)',
    'rsvp.phone': 'Phone (Optional)',
    'rsvp.status': 'RSVP Status',
    'rsvp.mealChoice': 'Meal Choice',
    'rsvp.yes': 'Yes, I will attend',
    'rsvp.no': 'No, I cannot attend',
    'rsvp.maybe': 'Maybe',
    'rsvp.submit': 'Submit RSVP',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.guests': 'Guests',
    'admin.tables': 'Tables',
    'admin.photos': 'Photos',
    'admin.export': 'Export to CSV',
    'admin.qrCode': 'QR Code',
    'admin.createEvent': 'Create Event',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Login',
    'auth.loginError': 'Invalid credentials',
  },
  kk: {
    // Navigation
    'nav.home': 'Басты бет',
    'nav.admin': 'Әкімші',
    'nav.login': 'Кіру',
    'nav.logout': 'Шығу',
    
    // Common
    'common.save': 'Сақтау',
    'common.cancel': 'Болдырмау',
    'common.delete': 'Жою',
    'common.edit': 'Өңдеу',
    'common.create': 'Жасау',
    'common.loading': 'Жүктелуде...',
    'common.error': 'Қате',
    'common.success': 'Сәтті',
    
    // Event
    'event.title': 'Оқиға атауы',
    'event.description': 'Сипаттама',
    'event.date': 'Күні',
    'event.location': 'Орналасқан жері',
    'event.maxGuests': 'Максималды қонақтар',
    'event.tableSize': 'Үстел мөлшері',
    
    // RSVP
    'rsvp.name': 'Аты-жөні',
    'rsvp.email': 'Электрондық пошта (міндетті емес)',
    'rsvp.phone': 'Телефон (міндетті емес)',
    'rsvp.status': 'RSVP мәртебесі',
    'rsvp.mealChoice': 'Тамақ таңдауы',
    'rsvp.yes': 'Иә, қатысамын',
    'rsvp.no': 'Жоқ, қатыса алмаймын',
    'rsvp.maybe': 'Мүмкін',
    'rsvp.submit': 'RSVP жіберу',
    
    // Admin
    'admin.dashboard': 'Әкімші панелі',
    'admin.guests': 'Қонақтар',
    'admin.tables': 'Үстелдер',
    'admin.photos': 'Фотосуреттер',
    'admin.export': 'CSV-ға экспорттау',
    'admin.qrCode': 'QR код',
    'admin.createEvent': 'Оқиға жасау',
    
    // Auth
    'auth.email': 'Электрондық пошта',
    'auth.password': 'Құпия сөз',
    'auth.login': 'Кіру',
    'auth.loginError': 'Қате деректер',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.admin': 'Админ',
    'nav.login': 'Войти',
    'nav.logout': 'Выйти',
    
    // Common
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.create': 'Создать',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    
    // Event
    'event.title': 'Название события',
    'event.description': 'Описание',
    'event.date': 'Дата',
    'event.location': 'Место проведения',
    'event.maxGuests': 'Максимум гостей',
    'event.tableSize': 'Размер стола',
    
    // RSVP
    'rsvp.name': 'Имя',
    'rsvp.email': 'Email (необязательно)',
    'rsvp.phone': 'Телефон (необязательно)',
    'rsvp.status': 'Статус RSVP',
    'rsvp.mealChoice': 'Выбор блюда',
    'rsvp.yes': 'Да, я буду присутствовать',
    'rsvp.no': 'Нет, я не смогу присутствовать',
    'rsvp.maybe': 'Возможно',
    'rsvp.submit': 'Отправить RSVP',
    
    // Admin
    'admin.dashboard': 'Панель администратора',
    'admin.guests': 'Гости',
    'admin.tables': 'Столы',
    'admin.photos': 'Фотографии',
    'admin.export': 'Экспорт в CSV',
    'admin.qrCode': 'QR код',
    'admin.createEvent': 'Создать событие',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.login': 'Войти',
    'auth.loginError': 'Неверные данные',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
