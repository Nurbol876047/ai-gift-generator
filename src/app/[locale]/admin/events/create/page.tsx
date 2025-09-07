'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Globe, LogOut } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import toast from 'react-hot-toast'

interface EventForm {
  title: string
  description: string
  date: string
  location: string
  maxGuests: number
  tableSize: number
}

export default function CreateEventPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    date: '',
    location: '',
    maxGuests: 100,
    tableSize: 10
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        const event = await response.json()
        toast.success('Event created successfully!')
        router.push(`/admin/events/${event.id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error creating event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Error creating event')
    } finally {
      setLoading(false)
    }
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
                {t('common.back')}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('event.createEvent')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <div className="flex space-x-1">
                  <Link href="/en/admin/events/create" className={`text-sm px-2 py-1 rounded ${locale === 'en' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    EN
                  </Link>
                  <Link href="/ru/admin/events/create" className={`text-sm px-2 py-1 rounded ${locale === 'ru' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    РУС
                  </Link>
                  <Link href="/kk/admin/events/create" className={`text-sm px-2 py-1 rounded ${locale === 'kk' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}>
                    ҚАЗ
                  </Link>
                </div>
              </div>
              
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {t('event.title')} *
              </label>
              <input
                type="text"
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('event.description')}
              </label>
              <textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                placeholder="Enter event description"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                {t('event.date')} *
              </label>
              <input
                type="datetime-local"
                id="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                {t('event.location')}
              </label>
              <input
                type="text"
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-field"
                placeholder="Event location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('event.maxGuests')}
                </label>
                <input
                  type="number"
                  id="maxGuests"
                  min="1"
                  value={form.maxGuests}
                  onChange={(e) => setForm({ ...form, maxGuests: parseInt(e.target.value) || 100 })}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="tableSize" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('event.tableSize')}
                </label>
                <input
                  type="number"
                  id="tableSize"
                  min="1"
                  value={form.tableSize}
                  onChange={(e) => setForm({ ...form, tableSize: parseInt(e.target.value) || 10 })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !form.title || !form.date}
                className="btn-primary flex-1 py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  t('event.createEvent')
                )}
              </button>
              
              <Link href="/admin" className="btn-secondary py-3 px-6">
                {t('common.cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}





