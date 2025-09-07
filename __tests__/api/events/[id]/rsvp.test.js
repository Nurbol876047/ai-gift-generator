import { POST } from '@/app/api/events/[id]/rsvp/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
    },
    guest: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// Mock NextRequest
const mockRequest = (body) => ({
  json: jest.fn().mockResolvedValue(body),
})

const mockResponse = (data, status = 200) => ({
  json: jest.fn().mockReturnValue(data),
  status,
})

describe('/api/events/[id]/rsvp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new guest RSVP successfully', async () => {
    const eventId = 'test-event-id'
    const rsvpData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      rsvpStatus: 'YES',
      mealChoice: 'Vegetarian'
    }

    // Mock event exists and is active
    prisma.event.findUnique.mockResolvedValue({
      id: eventId,
      isActive: true
    })

    // Mock guest doesn't exist
    prisma.guest.findFirst.mockResolvedValue(null)

    // Mock guest creation
    const createdGuest = {
      id: 'guest-id',
      ...rsvpData,
      eventId
    }
    prisma.guest.create.mockResolvedValue(createdGuest)

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: eventId }
    })
    expect(prisma.guest.findFirst).toHaveBeenCalledWith({
      where: {
        eventId,
        OR: [
          { email: rsvpData.email },
          { phone: rsvpData.phone }
        ]
      }
    })
    expect(prisma.guest.create).toHaveBeenCalledWith({
      data: {
        ...rsvpData,
        eventId
      }
    })
  })

  it('should update existing guest RSVP', async () => {
    const eventId = 'test-event-id'
    const rsvpData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      rsvpStatus: 'NO',
      mealChoice: 'None'
    }

    const existingGuest = {
      id: 'existing-guest-id',
      name: 'John Doe',
      email: 'john@example.com',
      rsvpStatus: 'YES'
    }

    // Mock event exists and is active
    prisma.event.findUnique.mockResolvedValue({
      id: eventId,
      isActive: true
    })

    // Mock guest exists
    prisma.guest.findFirst.mockResolvedValue(existingGuest)

    // Mock guest update
    const updatedGuest = {
      ...existingGuest,
      ...rsvpData
    }
    prisma.guest.update.mockResolvedValue(updatedGuest)

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(prisma.guest.update).toHaveBeenCalledWith({
      where: { id: existingGuest.id },
      data: rsvpData
    })
  })

  it('should return 400 if name is missing', async () => {
    const eventId = 'test-event-id'
    const rsvpData = {
      email: 'john@example.com',
      rsvpStatus: 'YES'
    }

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(response.status).toBe(400)
  })

  it('should return 400 if rsvpStatus is missing', async () => {
    const eventId = 'test-event-id'
    const rsvpData = {
      name: 'John Doe',
      email: 'john@example.com'
    }

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(response.status).toBe(400)
  })

  it('should return 404 if event not found', async () => {
    const eventId = 'non-existent-event'
    const rsvpData = {
      name: 'John Doe',
      rsvpStatus: 'YES'
    }

    // Mock event not found
    prisma.event.findUnique.mockResolvedValue(null)

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(response.status).toBe(404)
  })

  it('should return 400 if event is not active', async () => {
    const eventId = 'inactive-event'
    const rsvpData = {
      name: 'John Doe',
      rsvpStatus: 'YES'
    }

    // Mock inactive event
    prisma.event.findUnique.mockResolvedValue({
      id: eventId,
      isActive: false
    })

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(response.status).toBe(400)
  })

  it('should handle database errors gracefully', async () => {
    const eventId = 'test-event-id'
    const rsvpData = {
      name: 'John Doe',
      rsvpStatus: 'YES'
    }

    // Mock database error
    prisma.event.findUnique.mockRejectedValue(new Error('Database error'))

    const request = mockRequest(rsvpData)
    const response = await POST(request, { params: { id: eventId } })

    expect(response.status).toBe(500)
  })
})

