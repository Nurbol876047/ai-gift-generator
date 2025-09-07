'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  Plus, 
  Eye, 
  Download, 
  QrCode, 
  Camera,
  LogOut,
  Globe,
  MapPin
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  maxGuests: number
  tableSize: number
  isActive: boolean
  createdAt: string
  _count: {
    guests: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchEvents()
    }
  }, [status, router])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?adminId=' + session?.user?.id)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Error loading events')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `event_${eventId}_guests.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Export successful!')
      } else {
        toast.error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'kk' ? 'kk-KZ' : language === 'ru' ? 'ru-RU' : 'en-US'
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              
              <Link href="/" className="btn-secondary">
                {language === 'kk' ? 'Басты бет' :
                 language === 'ru' ? 'Главная' :
                 'Home'}
              </Link>
              
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="btn-secondary flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'kk' ? `Қош келдіңіз, ${session.user?.name}!` :
             language === 'ru' ? `Добро пожаловать, ${session.user?.name}!` :
             `Welcome, ${session.user?.name}!`}
          </h2>
          <p className="text-gray-600">
            {language === 'kk' ? 'Оқиғаларыңызды басқарыңыз және қонақтардың RSVP-ін көріңіз' :
             language === 'ru' ? 'Управляйте своими событиями и просматривайте RSVP гостей' :
             'Manage your events and view guest RSVPs'}
          </p>
        </div>

        {/* Create Event Button */}
        <div className="mb-8">
          <Link href="/admin/events/create" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t('admin.createEvent')}
          </Link>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'kk' ? 'Оқиғалар жоқ' :
               language === 'ru' ? 'Нет событий' :
               'No events yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'kk' ? 'Алғашқы оқиғаңызды жасау үшін жоғарыдағы батырманы басыңыз' :
               language === 'ru' ? 'Нажмите кнопку выше, чтобы создать ваше первое событие' :
               'Click the button above to create your first event'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.isActive ? 
                      (language === 'kk' ? 'Белсенді' : language === 'ru' ? 'Активно' : 'Active') :
                      (language === 'kk' ? 'Белсенді емес' : language === 'ru' ? 'Неактивно' : 'Inactive')
                    }
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
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
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event._count.guests} {language === 'kk' ? 'қонақ' : language === 'ru' ? 'гостей' : 'guests'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href={`/admin/events/${event.id}`}
                    className="btn-primary flex-1 text-center text-sm py-2"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {language === 'kk' ? 'Көру' : language === 'ru' ? 'Просмотр' : 'View'}
                  </Link>
                  
                  <button
                    onClick={() => handleExport(event.id)}
                    className="btn-secondary text-sm py-2 px-3"
                    title={language === 'kk' ? 'CSV-ға экспорттау' : language === 'ru' ? 'Экспорт в CSV' : 'Export to CSV'}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <Link 
                    href={`/api/events/${event.id}/qr`}
                    target="_blank"
                    className="btn-secondary text-sm py-2 px-3"
                    title={language === 'kk' ? 'QR код' : language === 'ru' ? 'QR код' : 'QR Code'}
                  >
                    <QrCode className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
