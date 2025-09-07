import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { name, email, phone, rsvpStatus, mealChoice } = body

    if (!name || !rsvpStatus) {
      return NextResponse.json(
        { error: 'Name and RSVP status are required' },
        { status: 400 }
      )
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.isActive) {
      return NextResponse.json({ error: 'Event is not active' }, { status: 400 })
    }

    // Check if guest already exists
    let guest = await prisma.guest.findFirst({
      where: {
        eventId,
        OR: [
          { email: email || '' },
          { phone: phone || '' }
        ]
      }
    })

    if (guest) {
      // Update existing guest
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: {
          name,
          email,
          phone,
          rsvpStatus,
          mealChoice
        }
      })
    } else {
      // Create new guest
      guest = await prisma.guest.create({
        data: {
          name,
          email,
          phone,
          rsvpStatus,
          mealChoice,
          eventId
        }
      })
    }

    // Auto-assign table if RSVP is YES
    if (rsvpStatus === 'YES' && !guest.tableId) {
      await assignTableToGuest(guest.id, eventId)
    }

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error('Error processing RSVP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function assignTableToGuest(guestId: string, eventId: string) {
  try {
    // Find a table with available capacity
    const availableTable = await prisma.table.findFirst({
      where: {
        eventId,
        guests: {
          some: {
            rsvpStatus: 'YES'
          }
        }
      },
      include: {
        guests: {
          where: {
            rsvpStatus: 'YES'
          }
        }
      }
    })

    if (availableTable && availableTable.guests.length < availableTable.capacity) {
      await prisma.guest.update({
        where: { id: guestId },
        data: { tableId: availableTable.id }
      })
      return
    }

    // Create new table if no available table found
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (event) {
      const tableCount = await prisma.table.count({
        where: { eventId }
      })

      const newTable = await prisma.table.create({
        data: {
          number: tableCount + 1,
          capacity: event.tableSize,
          eventId
        }
      })

      await prisma.guest.update({
        where: { id: guestId },
        data: { tableId: newTable.id }
      })
    }
  } catch (error) {
    console.error('Error assigning table:', error)
  }
}
