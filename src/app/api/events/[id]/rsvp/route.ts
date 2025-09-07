import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const rsvpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  rsvpStatus: z.enum(['YES', 'NO', 'MAYBE'], {
    required_error: 'RSVP status is required'
  }),
  mealChoice: z.string().optional(),
})

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const validatedData = rsvpSchema.parse(body)

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
          { email: validatedData.email || '' },
          { phone: validatedData.phone || '' }
        ]
      }
    })

    if (guest) {
      // Update existing guest
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: {
          name: validatedData.name,
          email: validatedData.email || null,
          phone: validatedData.phone || null,
          rsvpStatus: validatedData.rsvpStatus,
          mealChoice: validatedData.mealChoice || null
        }
      })
    } else {
      // Create new guest
      guest = await prisma.guest.create({
        data: {
          name: validatedData.name,
          email: validatedData.email || null,
          phone: validatedData.phone || null,
          rsvpStatus: validatedData.rsvpStatus,
          mealChoice: validatedData.mealChoice || null,
          eventId
        }
      })
    }

    // Auto-assign table if RSVP is YES
    if (validatedData.rsvpStatus === 'YES' && !guest.tableId) {
      await assignTableToGuest(guest.id, eventId)
    }

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error processing RSVP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





