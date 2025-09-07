import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.id

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        guests: {
          include: {
            table: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.adminId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Prepare CSV data
    const csvData = event.guests.map(guest => ({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      rsvpStatus: guest.rsvpStatus,
      mealChoice: guest.mealChoice || '',
      tableNumber: guest.table?.number || '',
      createdAt: guest.createdAt.toISOString()
    }))

    // Create CSV content
    const headers = [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'phone', title: 'Phone' },
      { id: 'rsvpStatus', title: 'RSVP Status' },
      { id: 'mealChoice', title: 'Meal Choice' },
      { id: 'tableNumber', title: 'Table Number' },
      { id: 'createdAt', title: 'Created At' }
    ]

    let csvContent = headers.map(h => h.title).join(',') + '\n'
    csvContent += csvData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    ).join('\n')

    const filename = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_guests.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error exporting guests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





