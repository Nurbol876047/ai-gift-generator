'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, MapPin, Users, Camera, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  photos: Photo[]
}

interface Photo {
  id: string
  url: string
  caption: string | null
}

interface RSVPForm {
  name: string
  email: string
  phone: string
  rsvpStatus: 'YES' | 'NO' | 'MAYBE'
  mealChoice: string
}

export default function EventPage() {
  const params = useParams()
  const { language, t } = useLanguage()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<RSVPForm>({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'YES',
    mealChoice: ''
  })

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
        // Fetch QR code for this event
        try {
          const qrRes = await fetch(`/api/events/${params.id}/qr`)
          if (qrRes.ok) {
            const qrData = await qrRes.json()
            setQrCode(qrData.qrCode)
          }
        } catch {}
      } else {
        toast.error('Event not found')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Error loading event')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        toast.success(
          language === 'kk' ? 'RSVP сәтті жіберілді!' :
          language === 'ru' ? 'RSVP успешно отправлен!' :
          'RSVP submitted successfully!'
        )
        setForm({
          name: '',
          email: '',
          phone: '',
          rsvpStatus: 'YES',
          mealChoice: ''
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error submitting RSVP')
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      toast.error('Error submitting RSVP')
    } finally {
      setSubmitting(false)
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'kk' ? 'Оқиға табылмады' :
             language === 'ru' ? 'Событие не найдено' :
             'Event not found'}
          </h1>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'kk' ? 'Басты бетке оралу' :
             language === 'ru' ? 'Вернуться на главную' :
             'Back to Home'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {language === 'kk' ? 'Басты бетке оралу' :
               language === 'ru' ? 'Вернуться на главную' :
               'Back to Home'}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Info */}
          <div className="space-y-6">
            <div className="card">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              {event.description && (
                <p className="text-gray-600 mb-6">{event.description}</p>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>

            {qrCode && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">QR Code</h3>
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            )}

            {/* Photo Gallery */}
            {event.photos && event.photos.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  {language === 'kk' ? 'Фотосуреттер' :
                   language === 'ru' ? 'Фотографии' :
                   'Photos'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Event photo'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {photo.caption && (
                        <p className="text-sm text-gray-600 mt-2">{photo.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RSVP Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'kk' ? 'RSVP жіберу' :
               language === 'ru' ? 'Отправить RSVP' :
               'Send RSVP'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder={language === 'kk' ? 'Аты-жөніңізді енгізіңіз' :
                             language === 'ru' ? 'Введите ваше имя' :
                             'Enter your name'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder={language === 'kk' ? 'Электрондық поштаңыз' :
                             language === 'ru' ? 'Ваш email' :
                             'Your email'}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  placeholder={language === 'kk' ? 'Телефон нөміріңіз' :
                             language === 'ru' ? 'Ваш номер телефона' :
                             'Your phone number'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.status')} *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'YES', label: t('rsvp.yes') },
                    { value: 'NO', label: t('rsvp.no') },
                    { value: 'MAYBE', label: t('rsvp.maybe') }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rsvpStatus"
                        value={option.value}
                        checked={form.rsvpStatus === option.value}
                        onChange={(e) => setForm({ ...form, rsvpStatus: e.target.value as 'YES' | 'NO' | 'MAYBE' })}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="mealChoice" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.mealChoice')}
                </label>
                <input
                  type="text"
                  id="mealChoice"
                  value={form.mealChoice}
                  onChange={(e) => setForm({ ...form, mealChoice: e.target.value })}
                  className="input-field"
                  placeholder={language === 'kk' ? 'Тамақ таңдауыңыз' :
                             language === 'ru' ? 'Ваш выбор блюда' :
                             'Your meal choice'}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !form.name}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {language === 'kk' ? 'Жіберілуде...' :
                     language === 'ru' ? 'Отправка...' :
                     'Submitting...'}
                  </div>
                ) : (
                  t('rsvp.submit')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
