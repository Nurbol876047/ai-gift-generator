'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Users, 
  Download, 
  QrCode, 
  Camera, 
  Search,
  Filter,
  Globe,
  LogOut,
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
  guests: Guest[]
  tables: Table[]
  photos: Photo[]
}

interface Guest {
  id: string
  name: string
  email: string | null
  phone: string | null
  rsvpStatus: 'PENDING' | 'YES' | 'NO' | 'MAYBE'
  mealChoice: string | null
  table: Table | null
  createdAt: string
}

interface Table {
  id: string
  number: number
  capacity: number
  guests: Guest[]
}

interface Photo {
  id: string
  url: string
  caption: string | null
}

export default function AdminEventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { language, setLanguage, t } = useLanguage()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        toast.error('Event not found')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Error loading event')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `event_${params.id}_guests.csv`
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

  const filteredGuests = event?.guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.phone?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'ALL' || guest.rsvpStatus === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'kk' ? 'kk-KZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'YES': return 'bg-green-100 text-green-800'
      case 'NO': return 'bg-red-100 text-red-800'
      case 'MAYBE': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'YES': return language === 'kk' ? 'Иә' : language === 'ru' ? 'Да' : 'Yes'
      case 'NO': return language === 'kk' ? 'Жоқ' : language === 'ru' ? 'Нет' : 'No'
      case 'MAYBE': return language === 'kk' ? 'Мүмкін' : language === 'ru' ? 'Возможно' : 'Maybe'
      default: return language === 'kk' ? 'Күтуде' : language === 'ru' ? 'Ожидает' : 'Pending'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Link href="/admin" className="btn-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                {language === 'kk' ? 'Артқа' : language === 'ru' ? 'Назад' : 'Back'}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
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
        {/* Event Info */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
              {event.description && (
                <p className="text-gray-600 mb-4">{event.description}</p>
              )}
              <div className="space-y-2">
                <p><strong>{language === 'kk' ? 'Күні:' : language === 'ru' ? 'Дата:' : 'Date:'}</strong> {formatDate(event.date)}</p>
                {event.location && (
                  <p><strong>{language === 'kk' ? 'Орналасқан жері:' : language === 'ru' ? 'Место:' : 'Location:'}</strong> {event.location}</p>
                )}
                <p><strong>{language === 'kk' ? 'Максималды қонақтар:' : language === 'ru' ? 'Максимум гостей:' : 'Max Guests:'}</strong> {event.maxGuests}</p>
                <p><strong>{language === 'kk' ? 'Үстел мөлшері:' : language === 'ru' ? 'Размер стола:' : 'Table Size:'}</strong> {event.tableSize}</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{event.guests.length}</p>
                  <p className="text-sm text-gray-600">{language === 'kk' ? 'Барлық қонақтар' : language === 'ru' ? 'Всего гостей' : 'Total Guests'}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {event.guests.filter(g => g.rsvpStatus === 'YES').length}
                  </p>
                  <p className="text-sm text-gray-600">{language === 'kk' ? 'Қатысатындар' : language === 'ru' ? 'Присутствуют' : 'Attending'}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleExport}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('admin.export')}
                </button>
                <Link
                  href={`/api/events/${event.id}/qr`}
                  target="_blank"
                  className="btn-secondary flex items-center justify-center px-4"
                >
                  <QrCode className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'kk' ? 'Қонақтарды іздеу...' : language === 'ru' ? 'Поиск гостей...' : 'Search guests...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">{language === 'kk' ? 'Барлығы' : language === 'ru' ? 'Все' : 'All'}</option>
                <option value="YES">{language === 'kk' ? 'Иә' : language === 'ru' ? 'Да' : 'Yes'}</option>
                <option value="NO">{language === 'kk' ? 'Жоқ' : language === 'ru' ? 'Нет' : 'No'}</option>
                <option value="MAYBE">{language === 'kk' ? 'Мүмкін' : language === 'ru' ? 'Возможно' : 'Maybe'}</option>
                <option value="PENDING">{language === 'kk' ? 'Күтуде' : language === 'ru' ? 'Ожидает' : 'Pending'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guests Table */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {language === 'kk' ? 'Қонақтар тізімі' : language === 'ru' ? 'Список гостей' : 'Guest List'} ({filteredGuests.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'kk' ? 'Аты-жөні' : language === 'ru' ? 'Имя' : 'Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'kk' ? 'Электрондық пошта' : language === 'ru' ? 'Email' : 'Email'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'kk' ? 'Телефон' : language === 'ru' ? 'Телефон' : 'Phone'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'kk' ? 'RSVP' : language === 'ru' ? 'RSVP' : 'RSVP'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'kk' ? 'Тамақ таңдауы' : language === 'ru' ? 'Выбор блюда' : 'Meal Choice'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'kk' ? 'Үстел' : language === 'ru' ? 'Стол' : 'Table'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {guest.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guest.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guest.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(guest.rsvpStatus)}`}>
                        {getStatusText(guest.rsvpStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guest.mealChoice || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guest.table ? `Table ${guest.table.number}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredGuests.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {language === 'kk' ? 'Қонақтар табылмады' : language === 'ru' ? 'Гости не найдены' : 'No guests found'}
              </p>
            </div>
          )}
        </div>

        {/* Tables Overview */}
        {event.tables.length > 0 && (
          <div className="card mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {language === 'kk' ? 'Үстелдер' : language === 'ru' ? 'Столы' : 'Tables'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.tables.map((table) => (
                <div key={table.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'kk' ? 'Үстел' : language === 'ru' ? 'Стол' : 'Table'} {table.number}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {table.guests.length} / {table.capacity} {language === 'kk' ? 'қонақ' : language === 'ru' ? 'гостей' : 'guests'}
                  </p>
                  <div className="space-y-1">
                    {table.guests.map((guest) => (
                      <div key={guest.id} className="text-sm text-gray-700">
                        {guest.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
