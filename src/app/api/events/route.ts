import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string().optional(),
  maxGuests: z.number().min(1).default(100),
  tableSize: z.number().min(1).default(10),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        adminId: session.user.id,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')

    if (adminId) {
      // Get events for specific admin
      const events = await prisma.event.findMany({
        where: { adminId },
        include: {
          _count: {
            select: { guests: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(events)
    }

    // Get all active events
    const events = await prisma.event.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





