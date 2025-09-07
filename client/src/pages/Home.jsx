import { Link } from 'react-router-dom'
import { ArrowRight, Rocket, Code, Zap } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Быстрый старт',
      description: 'Готовый к использованию проект с современным стеком технологий'
    },
    {
      icon: Code,
      title: 'Чистый код',
      description: 'Структурированный и понятный код, готовый для расширения'
    },
    {
      icon: Zap,
      title: 'Производительность',
      description: 'Оптимизированное приложение с быстрой загрузкой'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Добро пожаловать в{' '}
            <span className="text-gradient">Новый Проект</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Современное fullstack веб-приложение, построенное с использованием React, Node.js и Tailwind CSS. 
            Готовый шаблон для ваших будущих проектов.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/items"
              className="btn-primary inline-flex items-center group"
            >
              Начать работу
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/about"
              className="btn-secondary"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Особенности проекта
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Все необходимое для быстрого старта и разработки современного веб-приложения
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center group hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6 group-hover:bg-primary-200 transition-colors duration-200">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Изучите функциональность приложения и начните работу с готовым проектом
          </p>
          <Link
            to="/items"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center group"
          >
            Перейти к элементам
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
