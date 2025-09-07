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
  LogOut,
  Globe,
  MapPin
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
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
  const t = useTranslations()
  const locale = useLocale()
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
    return new Date(dateString).toLocaleDateString(locale)
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
              <h1 className="text-2xl font-bold text-gray-900">ToyEvent</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <div className="flex space-x-1">
                  <Link href="/en/admin" className={`text-sm px-2 py-1 rounded ${locale === 'en' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    EN
                  </Link>
                  <Link href="/ru/admin" className={`text-sm px-2 py-1 rounded ${locale === 'ru' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    РУС
                  </Link>
                  <Link href="/kk/admin" className={`text-sm px-2 py-1 rounded ${locale === 'kk' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    ҚАЗ
                  </Link>
                </div>
              </div>
              
              <Link href="/" className="btn-secondary">
                {t('navigation.home')}
              </Link>
              
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="btn-secondary flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('navigation.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.welcome')}, {session.user?.name}!
          </h2>
          <p className="text-gray-600">
            Manage your events and view guest RSVPs
          </p>
        </div>

        {/* Create Event Button */}
        <div className="mb-8">
          <Link href="/admin/events/create" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t('event.createEvent')}
          </Link>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('event.noEvents')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('event.createFirstEvent')}
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
                    {event.isActive ? 'Active' : 'Inactive'}
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
                    <span>{event._count.guests} guests</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href={`/admin/events/${event.id}`}
                    className="btn-primary flex-1 text-center text-sm py-2"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {t('common.view')}
                  </Link>
                  
                  <button
                    onClick={() => handleExport(event.id)}
                    className="btn-secondary text-sm py-2 px-3"
                    title="Export to CSV"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <Link 
                    href={`/api/events/${event.id}/qr`}
                    target="_blank"
                    className="btn-secondary text-sm py-2 px-3"
                    title="QR Code"
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
