'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Calendar, Users, MapPin, ArrowRight, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
}

export default function HomePage() {
  const { data: session } = useSession()
  const { language, setLanguage, t } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'kk' ? 'kk-KZ' : language === 'ru' ? 'ru-RU' : 'en-US')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">EventManager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'kk' | 'ru')}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="en">EN</option>
                  <option value="kk">ҚАЗ</option>
                  <option value="ru">РУС</option>
                </select>
              </div>
              
              {session ? (
                <Link href="/admin" className="btn-primary">
                  {t('nav.admin')}
                </Link>
              ) : (
                <Link href="/admin/login" className="btn-primary">
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'kk' ? 'Оқиғаларды басқарыңыз' : 
             language === 'ru' ? 'Управляйте событиями' : 
             'Manage Your Events'}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {language === 'kk' ? 'RSVP, қонақтар тізімі, үстел тағайындау және көптеген басқа мүмкіндіктермен оқиғаларыңызды оңай басқарыңыз.' :
             language === 'ru' ? 'Легко управляйте своими событиями с RSVP, списком гостей, назначением столов и многими другими возможностями.' :
             'Easily manage your events with RSVP, guest lists, table assignments, and many more features.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#events" className="btn-primary text-lg px-8 py-3">
              {language === 'kk' ? 'Оқиғаларды көру' :
               language === 'ru' ? 'Посмотреть события' :
               'View Events'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {session && (
              <Link href="/admin" className="btn-secondary text-lg px-8 py-3">
                {t('admin.createEvent')}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'kk' ? 'Ағымдағы оқиғалар' :
             language === 'ru' ? 'Текущие события' :
             'Current Events'}
          </h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {language === 'kk' ? 'Қазіргі уақытта оқиғалар жоқ' :
                 language === 'ru' ? 'В настоящее время нет событий' :
                 'No events at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h4>
                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`/event/${event.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    {language === 'kk' ? 'RSVP жіберу' :
                     language === 'ru' ? 'Отправить RSVP' :
                     'Send RSVP'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'kk' ? 'Мүмкіндіктер' :
             language === 'ru' ? 'Возможности' :
             'Features'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'kk' ? 'Қонақ басқару' :
                 language === 'ru' ? 'Управление гостями' :
                 'Guest Management'}
              </h4>
              <p className="text-gray-600">
                {language === 'kk' ? 'RSVP және қонақтар тізімін басқарыңыз' :
                 language === 'ru' ? 'Управляйте RSVP и списком гостей' :
                 'Manage RSVP and guest lists'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'kk' ? 'Автоматты үстел тағайындау' :
                 language === 'ru' ? 'Автоматическое назначение столов' :
                 'Auto Table Assignment'}
              </h4>
              <p className="text-gray-600">
                {language === 'kk' ? 'Қонақтарды автоматты түрде үстелдерге тағайындаңыз' :
                 language === 'ru' ? 'Автоматически назначайте гостей за столы' :
                 'Automatically assign guests to tables'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'kk' ? 'QR код шақырулар' :
                 language === 'ru' ? 'QR код приглашения' :
                 'QR Code Invites'}
              </h4>
              <p className="text-gray-600">
                {language === 'kk' ? 'Әр оқиға үшін бірегей QR код жасаңыз' :
                 language === 'ru' ? 'Создавайте уникальные QR коды для каждого события' :
                 'Generate unique QR codes for each event'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'kk' ? 'Көптілділік' :
                 language === 'ru' ? 'Многоязычность' :
                 'Multi-language'}
              </h4>
              <p className="text-gray-600">
                {language === 'kk' ? 'Қазақ, орыс және ағылшын тілдерінде' :
                 language === 'ru' ? 'На казахском, русском и английском языках' :
                 'Available in Kazakh, Russian and English'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 EventManager. {language === 'kk' ? 'Барлық құқықтар қорғалған.' :
             language === 'ru' ? 'Все права защищены.' :
             'All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  )
}
