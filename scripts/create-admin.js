const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = process.argv[2] || 'admin@example.com'
    const password = process.argv[3] || 'password123'
    const name = process.argv[4] || 'Admin User'

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', email)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('👤 Name:', name)
    console.log('🆔 ID:', admin.id)

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()





