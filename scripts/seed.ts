import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User'
      }
    })

    console.log('✅ Admin user created:', admin.email)

    // Create sample event
    const event = await prisma.event.create({
      data: {
        title: 'Toy Collection Event 2024',
        description: 'Join us for our annual toy collection and sharing event!',
        date: new Date('2024-12-25T18:00:00Z'),
        location: 'Community Center, Main Street',
        maxGuests: 50,
        tableSize: 8,
        adminId: admin.id
      }
    })

    console.log('✅ Sample event created:', event.title)

    // Create sample guests
    const guests = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
        rsvpStatus: 'YES' as const,
        mealChoice: 'Vegetarian',
        eventId: event.id
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1234567891',
        rsvpStatus: 'YES' as const,
        mealChoice: 'Regular',
        eventId: event.id
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        rsvpStatus: 'MAYBE' as const,
        eventId: event.id
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        rsvpStatus: 'NO' as const,
        eventId: event.id
      }
    ]

    for (const guestData of guests) {
      const guest = await prisma.guest.create({
        data: guestData
      })
      console.log('✅ Guest created:', guest.name)
    }

    // Create sample tables
    const table1 = await prisma.table.create({
      data: {
        number: 1,
        capacity: 8,
        eventId: event.id
      }
    })

    const table2 = await prisma.table.create({
      data: {
        number: 2,
        capacity: 8,
        eventId: event.id
      }
    })

    console.log('✅ Sample tables created')

    // Assign guests to tables
    const yesGuests = await prisma.guest.findMany({
      where: {
        eventId: event.id,
        rsvpStatus: 'YES'
      }
    })

    for (let i = 0; i < yesGuests.length; i++) {
      const tableId = i < 4 ? table1.id : table2.id
      await prisma.guest.update({
        where: { id: yesGuests[i].id },
        data: { tableId }
      })
    }

    console.log('✅ Guests assigned to tables')

    // Create sample photos
    const photos = [
      {
        filename: 'event-photo-1.jpg',
        url: '/uploads/event-photo-1.jpg',
        caption: 'Previous year event highlights',
        eventId: event.id
      },
      {
        filename: 'event-photo-2.jpg',
        url: '/uploads/event-photo-2.jpg',
        caption: 'Community gathering',
        eventId: event.id
      }
    ]

    for (const photoData of photos) {
      const photo = await prisma.photo.create({
        data: photoData
      })
      console.log('✅ Photo created:', photo.filename)
    }

    console.log('🎉 Database seed completed successfully!')
    console.log('\n📋 Summary:')
    console.log('- Admin user: admin@example.com / password123')
    console.log('- Sample event with guests and tables')
    console.log('- Sample photos')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()





