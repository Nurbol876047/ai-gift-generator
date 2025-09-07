import { Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gradient">Новый Проект</span>
            </div>
            <p className="text-gray-600 text-sm">
              Современное fullstack веб-приложение, построенное с использованием React и Node.js
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Быстрые ссылки
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200">
                  Главная
                </a>
              </li>
              <li>
                <a href="/items" className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200">
                  Элементы
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200">
                  О проекте
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Социальные сети
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Новый Проект. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
