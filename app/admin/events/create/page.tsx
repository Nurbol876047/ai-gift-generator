'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, MapPin, Users, Settings, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function CreateEventPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { language, t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxGuests: 100,
    tableSize: 10
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const event = await response.json()
        toast.success(language === 'kk' ? 'Оқиға сәтті жасалды!' : 
                     language === 'ru' ? 'Событие успешно создано!' : 
                     'Event created successfully!')
        router.push(`/admin/events/${event.id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error creating event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(language === 'kk' ? 'Қате орын алды' : 
                 language === 'ru' ? 'Произошла ошибка' : 
                 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxGuests' || name === 'tableSize' ? parseInt(value) || 0 : value
    }))
  }

  if (!session) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'kk' ? 'Артқа' : language === 'ru' ? 'Назад' : 'Back'}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'kk' ? 'Жаңа оқиға жасау' :
             language === 'ru' ? 'Создать новое событие' :
             'Create New Event'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'kk' ? 'Оқиға туралы барлық ақпаратты толтырыңыз' :
             language === 'ru' ? 'Заполните всю информацию о событии' :
             'Fill in all the information about your event'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                {language === 'kk' ? 'Оқиға атауы' :
                 language === 'ru' ? 'Название события' :
                 'Event Title'} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'kk' ? 'Оқиға атауын енгізіңіз' :
                           language === 'ru' ? 'Введите название события' :
                           'Enter event title'}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'kk' ? 'Сипаттама' :
                 language === 'ru' ? 'Описание' :
                 'Description'}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={language === 'kk' ? 'Оқиға туралы толығырақ ақпарат' :
                           language === 'ru' ? 'Подробная информация о событии' :
                           'Detailed information about the event'}
              />
            </div>

            {/* Date and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  {language === 'kk' ? 'Күні' :
                   language === 'ru' ? 'Дата' :
                   'Date'} *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  {language === 'kk' ? 'Орналасқан жері' :
                   language === 'ru' ? 'Место проведения' :
                   'Location'}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={language === 'kk' ? 'Оқиға орналасқан жері' :
                             language === 'ru' ? 'Место проведения события' :
                             'Event location'}
                />
              </div>
            </div>

            {/* Max Guests and Table Size Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Max Guests */}
              <div>
                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  {language === 'kk' ? 'Максималды қонақтар' :
                   language === 'ru' ? 'Максимум гостей' :
                   'Max Guests'}
                </label>
                <input
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Table Size */}
              <div>
                <label htmlFor="tableSize" className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="h-4 w-4 inline mr-2" />
                  {language === 'kk' ? 'Үстел мөлшері' :
                   language === 'ru' ? 'Размер стола' :
                   'Table Size'}
                </label>
                <input
                  type="number"
                  id="tableSize"
                  name="tableSize"
                  value={formData.tableSize}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {language === 'kk' ? 'Болдырмау' :
                 language === 'ru' ? 'Отмена' :
                 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === 'kk' ? 'Жасалуда...' :
                     language === 'ru' ? 'Создание...' :
                     'Creating...'}
                  </div>
                ) : (
                  language === 'kk' ? 'Оқиға жасау' :
                  language === 'ru' ? 'Создать событие' :
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



