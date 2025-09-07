import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, Package } from 'lucide-react'
import axios from 'axios'

const Items = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/items')
      setItems(response.data.data)
      setError(null)
    } catch (err) {
      setError('Ошибка при загрузке элементов')
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new item
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) return

    try {
      setSubmitting(true)
      const response = await axios.post('/api/items', formData)
      setItems([...items, response.data.data])
      setFormData({ name: '', description: '' })
      setShowForm(false)
      setError(null)
    } catch (err) {
      setError('Ошибка при создании элемента')
      console.error('Error creating item:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Delete item
  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return

    try {
      // В реальном приложении здесь был бы DELETE запрос
      setItems(items.filter(item => item.id !== id))
      setError(null)
    } catch (err) {
      setError('Ошибка при удалении элемента')
      console.error('Error deleting item:', err)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка элементов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Элементы</h1>
          <p className="text-gray-600">Управление элементами вашего проекта</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить элемент
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="card mb-8 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Добавить новый элемент</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Название
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Введите название элемента"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Введите описание элемента"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  'Создать элемент'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Элементы не найдены</h3>
          <p className="text-gray-600 mb-4">Начните с добавления первого элемента</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить элемент
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {item.name}
                </h3>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="text-xs text-gray-400">
                ID: {item.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Items
