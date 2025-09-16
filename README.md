# AI-Based Course Recommendation Backend

A sophisticated backend service for an EdTech platform that provides personalized course recommendations using AI-driven algorithms based on user behavior, interests, and engagement patterns.

## 🎯 **Overview**

This system analyzes user interactions (views, scroll time, interests) and course popularity to deliver highly personalized course recommendations. Built with modern backend technologies and designed for scalability.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Backend API   │    │   PostgreSQL    │
│   (NextJS)      │◄──►│   (Node.js)     │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Recommendation  │
                       │    Engine       │
                       │ (4-Factor AI)   │
                       └─────────────────┘
```

## 🧠 **Recommendation Algorithm**

The system uses a **4-factor weighted scoring algorithm**:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Interest Matching** | 25% | Matches user interests/career goals with course tags |
| **Engagement Signals** | 30% | Analyzes scroll time and interaction depth |
| **View Frequency & Recency** | 25% | Considers how often and recently user viewed courses |
| **Course Popularity** | 20% | Incorporates global course popularity and enrollment |

### Algorithm Formula:
```
Score = (Interest × 0.25) + (Engagement × 0.30) + (Views × 0.25) + (Popularity × 0.20)
```

## 🚀 **Tech Stack**

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose
- **Security**: Helmet, bcrypt, CORS

## 📁 **Project Structure**

```
src/
├── controllers/        # HTTP request handlers
│   ├── authController.js
│   ├── courseController.js
│   ├── userController.js
│   └── recommendationController.js
├── services/          # Core business logic
│   └── recommendationService.js
├── routes/           # API route definitions
├── middleware/       # Auth & validation
├── utils/           # Database utilities
└── app.js          # Main application entry
```

## 🗄️ **Database Schema**

### Key Models:
- **Users**: Profile, interests, career goals
- **Courses**: Content, tags, popularity metrics
- **UserActivity**: Tracks views, scroll engagement, timestamps

## 📊 **API Endpoints**

### Authentication
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
```

### Courses
```http
GET  /api/courses                    # List courses with filters
GET  /api/courses/:id                # Get course details
POST /api/courses/:id/view           # Track course view
POST /api/courses/:id/scroll         # Track scroll engagement
```

### Recommendations
```http
GET /api/recommendations                      # Get personalized recommendations
GET /api/recommendations/user/:userId         # Get recommendations for specific user
GET /api/recommendations/popular              # Get popular courses
GET /api/recommendations/category/:category   # Get category-based recommendations
```

### Users
```http
PUT /api/users/profile     # Update user profile
GET /api/users/activity    # Get user activity history
GET /api/users/stats       # Get user engagement statistics
```

## 🔧 **Installation & Setup**

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd course-recommendation-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Database setup**
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

5. **Start the server**
```bash
npm run dev
```

### Docker Setup (Recommended)

```bash
# Start with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma db seed
```

The API will be available at `http://localhost:3000`

## 🧪 **Testing the System**

### Sample Test Users
The seed data provides 6 test users with different personas:

| User | Email | Focus Area | Use Case |
|------|-------|------------|----------|
| John Developer | john.programmer@example.com | Programming | High engagement testing |
| Sarah Analytics | sarah.datascientist@example.com | Data Science | Interest matching |
| Mike Creative | mike.designer@example.com | Design | Category-specific recs |
| Lisa Strategy | lisa.business@example.com | Business | Cross-category interests |
| Alex Explorer | alex.explorer@example.com | Mixed | Balanced recommendations |
| New User | newbie@example.com | Minimal | Popular course fallback |

**Password for all users**: `password123`

### Testing Recommendations

1. **Login as John (JavaScript enthusiast)**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.programmer@example.com","password":"password123"}'
```

2. **Get personalized recommendations**
```bash
curl -X GET http://localhost:3000/api/recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Expected result**: React, Node.js, and Full Stack courses (high scores due to engagement)

## 🎯 **Key Features**

### ✅ **Intelligent Recommendations**
- Multi-factor scoring algorithm
- Real-time personalization
- Behavioral pattern analysis
- Interest and career goal matching

### ✅ **Activity Tracking**
- Course view tracking
- Scroll engagement measurement  
- Recency and frequency analysis
- User behavior insights

### ✅ **Scalable Architecture**
- Clean separation of concerns
- Database query optimization
- Both ORM and raw SQL implementations
- Docker containerization

### ✅ **Security & Validation**
- JWT authentication
- Input validation and sanitization
- Password hashing with bcrypt
- SQL injection prevention

## 📈 **Performance Optimizations**

- **Database Indexing**: Optimized queries on user_id, course_id, activity_type
- **Query Optimization**: Both Prisma ORM and raw SQL implementations
- **Caching Ready**: Structured for Redis integration
- **Connection Pooling**: Efficient database connections

## 🔮 **Future Enhancements**

- **Redis Caching**: Cache frequent recommendation requests
- **Machine Learning**: Implement collaborative filtering
- **A/B Testing**: Framework for recommendation algorithm testing
- **Real-time Updates**: WebSocket-based activity tracking
- **Analytics Dashboard**: Admin interface for system metrics

## 🐳 **Docker Commands**

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Execute commands in container
docker-compose exec app npm run db:seed

# Stop services
docker-compose down
```

## 📝 **Environment Variables**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/course_recommendation"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

## 🧪 **API Testing Examples**

### Get Recommendations with Score Breakdown
```bash
curl -X GET "http://localhost:3000/api/recommendations/user/1?limit=3"
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": 2,
      "title": "React Complete Guide",
      "category": "Programming",
      "recommendationScore": 0.87,
      "scoreBreakdown": {
        "interest": 0.75,
        "engagement": 0.90,
        "views": 0.85,
        "popularity": 0.92
      }
    }
  ],
  "userId": 1,
  "algorithm": "prisma-based"
}
```

### Track User Activity
```bash
# Track course view
curl -X POST "http://localhost:3000/api/courses/1/view" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# Track scroll engagement  
curl -X POST "http://localhost:3000/api/courses/1/scroll" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "duration": 45}'
```

## 📊 **System Metrics**

The system tracks and can report on:
- User engagement rates
- Course popularity trends  
- Recommendation accuracy
- API response times
- Database query performance

## 🤝 **Contributing**

This is a take-home assignment project demonstrating backend architecture and AI recommendation systems for EdTech platforms.

---