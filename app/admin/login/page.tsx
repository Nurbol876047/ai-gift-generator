'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false
      })

      if (result?.error) {
        toast.error(t('auth.loginError'))
      } else {
        toast.success(
          language === 'kk' ? 'Сәтті кірдіңіз!' :
          language === 'ru' ? 'Успешный вход!' :
          'Login successful!'
        )
        router.push('/admin')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'kk' ? 'Басты бетке оралу' :
             language === 'ru' ? 'Вернуться на главную' :
             'Back to Home'}
          </Link>
          
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-primary-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'kk' ? 'Әкімші кіруі' :
             language === 'ru' ? 'Вход администратора' :
             'Admin Login'}
          </h2>
          <p className="mt-2 text-gray-600">
            {language === 'kk' ? 'Оқиғаларды басқару үшін кіріңіз' :
             language === 'ru' ? 'Войдите для управления событиями' :
             'Sign in to manage your events'}
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder={language === 'kk' ? 'Электрондық поштаңызды енгізіңіз' :
                           language === 'ru' ? 'Введите ваш email' :
                           'Enter your email'}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder={language === 'kk' ? 'Құпия сөзіңізді енгізіңіз' :
                           language === 'ru' ? 'Введите ваш пароль' :
                           'Enter your password'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {language === 'kk' ? 'Кіруде...' :
                   language === 'ru' ? 'Вход...' :
                   'Signing in...'}
                </div>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {language === 'kk' ? 'Демо деректер:' :
             language === 'ru' ? 'Демо данные:' :
             'Demo credentials:'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            admin@example.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}
