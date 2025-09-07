import { Code, Database, Globe, Shield, Zap, Users } from 'lucide-react'

const About = () => {
  const techStack = [
    {
      category: 'Frontend',
      technologies: ['React 18', 'Vite', 'Tailwind CSS', 'React Router', 'Axios'],
      icon: Code,
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'Backend',
      technologies: ['Node.js', 'Express.js', 'CORS', 'Helmet', 'Morgan'],
      icon: Database,
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'Инструменты',
      technologies: ['ESLint', 'PostCSS', 'Autoprefixer', 'Nodemon'],
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Встроенная защита с Helmet.js и CORS настройками'
    },
    {
      icon: Globe,
      title: 'API готовность',
      description: 'RESTful API endpoints для интеграции с frontend'
    },
    {
      icon: Users,
      title: 'Разработка',
      description: 'Готовый шаблон для командной разработки'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          О проекте
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Современное fullstack веб-приложение, построенное с использованием лучших практик 
          и современных технологий для быстрого старта разработки.
        </p>
      </div>

      {/* Project Overview */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Что это за проект?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Это готовый шаблон fullstack приложения, который включает в себя все необходимые 
              компоненты для начала разработки современного веб-приложения.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Проект демонстрирует лучшие практики разработки, включая структурированный код, 
              современные инструменты сборки и готовую интеграцию между frontend и backend.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                Fullstack
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                React
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Node.js
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Tailwind CSS
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-full mb-6">
                <Code className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Готов к разработке
              </h3>
              <p className="text-gray-600">
                Проект настроен и готов к использованию. Просто клонируйте репозиторий 
                и начните разработку!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Технологический стек
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techStack.map((stack, index) => {
            const Icon = stack.icon
            return (
              <div key={index} className="card">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stack.color} text-white rounded-full mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {stack.category}
                </h3>
                <ul className="space-y-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <li key={techIndex} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Ключевые особенности
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
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
      </section>

      {/* Getting Started */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Как начать работу?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Проект готов к использованию. Следуйте простым шагам для запуска:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 mb-2">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Установка</h3>
              <p className="text-gray-600 text-sm">
                Запустите `npm run install-all` для установки всех зависимостей
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 mb-2">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Запуск</h3>
              <p className="text-gray-600 text-sm">
                Используйте `npm run dev` для запуска в режиме разработки
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 mb-2">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Разработка</h3>
              <p className="text-gray-600 text-sm">
                Начните разработку! Backend на порту 5000, frontend на 5173
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
