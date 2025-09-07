# Toy Event Platform

A full-stack web application for managing toy events built with Next.js 14, TypeScript, TailwindCSS, Prisma, PostgreSQL, and NextAuth.

## 🚀 Features

- **Event Management**: Create and manage toy events with guest lists
- **RSVP System**: Guests can RSVP with meal preferences
- **QR Code Invites**: Generate unique QR codes for each event
- **Automatic Table Assignment**: Auto-assign guests to tables (configurable table size)
- **Photo Gallery**: Upload and view event photos
- **Multi-language Support**: Available in English, Russian, and Kazakh
- **Admin Dashboard**: Complete admin interface for event management
- **CSV Export**: Export guest lists to CSV
- **Authentication**: Secure admin login with NextAuth
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Internationalization**: next-intl
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, Docker Compose
- **Validation**: Zod

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth configuration
│   │   │   └── events/        # Event-related endpoints
│   │   ├── [locale]/          # Internationalized pages
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── event/         # Guest event pages
│   │   │   └── page.tsx       # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # Context providers
│   ├── lib/                   # Utilities and configurations
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── utils.ts          # Utility functions
│   ├── messages/              # Translation files
│   │   ├── en.json           # English translations
│   │   ├── ru.json           # Russian translations
│   │   └── kk.json           # Kazakh translations
│   └── i18n/                  # Internationalization config
├── prisma/                    # Database schema and migrations
├── scripts/                   # Utility scripts
├── __tests__/                 # Test files
├── docker-compose.dev.yml     # Development Docker setup
├── docker-compose.prod.yml    # Production Docker setup
└── Dockerfile                 # Docker configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd toy-event-platform
   ```

2. **Start the application with Docker Compose**
   ```bash
   # Development
   npm run docker:dev
   
   # Or manually
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npx prisma db push
   ```

4. **Create admin user**
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npm run create-admin
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Database: localhost:5432

### Option 2: Local Development (SQLite)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   The `.env.local` file is already configured for SQLite with `DATABASE_URL="file:./dev.db"`

3. **Set up the database**
   ```bash
   # Run Prisma migrations to create SQLite database
   npx prisma migrate dev --name init
   
   # Generate Prisma client
   npm run db:generate
   ```

4. **Create admin user**
   ```bash
   npm run create-admin
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000

## 📋 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Testing
```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Docker
```bash
npm run docker:dev   # Start development containers
npm run docker:prod  # Start production containers
npm run docker:down  # Stop all containers
npm run docker:build # Build Docker images
```

### Utilities
```bash
npm run create-admin # Create admin user
```

## 🌐 API Endpoints

### Events
- `POST /api/events` - Create new event (admin only)
- `GET /api/events` - Get all events or admin's events
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event (admin only)
- `DELETE /api/events/[id]` - Delete event (admin only)

### RSVP
- `POST /api/events/[id]/rsvp` - Submit RSVP

### QR Codes
- `GET /api/events/[id]/qr` - Get QR code for event

### Export
- `GET /api/events/[id]/export` - Export guest list to CSV (admin only)

### Photos
- `POST /api/events/[id]/photos` - Upload photo (admin only)
- `GET /api/events/[id]/photos` - Get event photos

## 🗄 Database Schema

### Models

#### Admin
- `id`: String (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `name`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Event
- `id`: String (Primary Key)
- `title`: String
- `description`: String (Optional)
- `date`: DateTime
- `location`: String (Optional)
- `maxGuests`: Int (Default: 100)
- `tableSize`: Int (Default: 10)
- `isActive`: Boolean (Default: true)
- `adminId`: String (Foreign Key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Guest
- `id`: String (Primary Key)
- `name`: String
- `email`: String (Optional)
- `phone`: String (Optional)
- `rsvpStatus`: Enum (PENDING, YES, NO, MAYBE)
- `mealChoice`: String (Optional)
- `tableId`: String (Foreign Key, Optional)
- `eventId`: String (Foreign Key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Table
- `id`: String (Primary Key)
- `number`: Int
- `capacity`: Int (Default: 10)
- `eventId`: String (Foreign Key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Photo
- `id`: String (Primary Key)
- `filename`: String
- `url`: String
- `caption`: String (Optional)
- `eventId`: String (Foreign Key)
- `createdAt`: DateTime

## 🌍 Multi-language Support

The application supports three languages:
- **English** (en) - Default
- **Russian** (ru) - Русский
- **Kazakh** (kk) - Қазақ тілі

Language can be switched using the language selector in the header.

### Adding New Translations

1. Add new keys to `src/messages/en.json`
2. Add corresponding translations to `src/messages/ru.json` and `src/messages/kk.json`
3. Use the `useTranslations()` hook in components

## 🔐 Authentication

Admin authentication is handled by NextAuth.js with credentials provider.

### Default Demo Credentials
- Email: `admin@example.com`
- Password: `password123`

### Creating New Admin Users

```bash
# Using npm script
npm run create-admin

# Using tsx directly
npx tsx scripts/create-admin.ts admin@example.com password123 "Admin Name"
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- Tests are located in `__tests__/` directory
- API route tests use Jest with mocked Prisma client
- Component tests use React Testing Library

### Example Test
```typescript
// __tests__/api/events/[id]/rsvp.test.ts
import { POST } from '@/app/api/events/[id]/rsvp/route'

describe('/api/events/[id]/rsvp', () => {
  it('should create a new guest RSVP successfully', async () => {
    // Test implementation
  })
})
```

## 🐳 Docker Deployment

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Set environment variables
export POSTGRES_PASSWORD="secure-password"
export NEXTAUTH_SECRET="your-secret-key"
export NEXTAUTH_URL="https://your-domain.com"
export NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Start production environment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/toy_event_platform?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production Variables
```env
# Production Database
POSTGRES_PASSWORD="secure-password-change-in-production"

# Production URLs
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Production
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Manual Deployment
   ```bash
# Build the application
   npm run build

# Start production server
npm start
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Ensure PostgreSQL is running and `DATABASE_URL` is correct.

#### Prisma Client Not Generated
```
Error: @prisma/client did not initialize
```
**Solution**: Run `npm run db:generate`

#### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: 
- Kill process using port 3000: `lsof -ti:3000 | xargs kill -9`
- Or change port in `package.json` scripts

#### Docker Container Issues
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs app
docker-compose logs postgres

# Restart containers
docker-compose restart
```

#### Environment Variables Not Loading
**Solution**: Ensure `.env.local` is in the root directory and restart the development server.

### Reset Everything
```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all Docker data
docker system prune -a

# Start fresh
docker-compose up -d
docker-compose exec app npx prisma db push
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs app`
3. Open an issue in the repository
4. Check the documentation

## 🎯 Roadmap

- [ ] Email notifications for RSVP
- [ ] Real-time updates with WebSockets
- [ ] Mobile app with React Native
- [ ] Advanced analytics dashboard
- [ ] Integration with payment systems
- [ ] Social media sharing
- [ ] Event templates
- [ ] Bulk guest import
- [ ] Advanced reporting
- [ ] API rate limiting
- [ ] Caching with Redis
- [ ] CDN integration for photos

---

**Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.**