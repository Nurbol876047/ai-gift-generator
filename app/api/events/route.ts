import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, location, maxGuests, tableSize } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        maxGuests: maxGuests || 100,
        tableSize: tableSize || 10,
        adminId: session.user.id,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
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
