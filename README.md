# CricTourney Frontend

A comprehensive cricket tournament management system built with React and Vite. This application provides a complete platform for organizing and managing cricket tournaments with role-based access control, team management, scheduling, and an AI-powered help system.

## Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based authentication with role-based access (Admin/User)
- **Tournament Management** - Create, view, and manage cricket tournaments
- **Team Management** - Register teams, manage players, edit team details
- **Match Scheduling** - Create and view match schedules
- **Payment System** - Track payment history and transactions
- **AI-Powered Help System** - RAG-based chat assistant for instant support

### User Roles
- **Admin**: Full tournament management, schedule creation, system oversight
- **User**: Team registration, tournament participation, schedule viewing

### Key Pages
- **Dashboard** - Role-specific dashboards (Admin/User)
- **Team Management** - Register, view, edit teams
- **Tournament Details** - Comprehensive tournament information
- **Schedule Management** - Create and view match schedules
- **Payment History** - Transaction tracking
- **Help Center** - AI-powered support with knowledge base

## Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Material-UI** - Component library for consistent UI
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication

### Key Dependencies
- `@mui/material` - UI components
- `react-router-dom` - Routing
- `axios` - API requests
- `jwt-decode` - JWT token handling
- `react-hot-toast` - Notifications
- `lucide-react` - Icons
- `country-state-city` - Location data
- `react-select` - Enhanced select components

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   ├── RAGChat.jsx     # AI chat interface
│   └── RAGWidget.jsx   # Floating chat widget
├── pages/              # Application pages
│   ├── Login.jsx       # User authentication
│   ├── Signup.jsx      # User registration
│   ├── AdminTournamentDashboard.jsx
│   ├── UserTournamentDashboard.jsx
│   ├── TournamentDetails.jsx
│   ├── RegisterTeam.jsx
│   ├── MyTeams.jsx
│   ├── ViewTeam.jsx
│   ├── EditTeam.jsx
│   ├── CreateSchedule.jsx
│   ├── ViewSchedule.jsx
│   ├── PaymentHistory.jsx
│   └── HelpCenter.jsx
├── services/           # API and business logic
│   ├── api.jsx        # API configuration
│   ├── authService.jsx # Authentication services
│   └── ragService.js  # RAG chat functionality
├── data/
│   └── knowledgeBase.json # AI knowledge base
├── assets/            # Static assets
└── App.jsx           # Main application component
```

## Services & APIs

### Authentication Service
- **Base URL**: `http://localhost:8081/auth`
- **Endpoints**: `/signup`, `/login`
- **Features**: JWT token management, user session handling

### API Services
- **User API**: `http://localhost:8765/api` - User management
- **Tournament API**: `http://localhost:8765` - Tournament operations
- **Team API**: `http://localhost:8765` - Team management
- **Scheduler API**: `http://localhost:8765` - Match scheduling

### RAG (Retrieval-Augmented Generation) System
- **AI-powered chat assistant** available on all pages
- **Knowledge base** covering platform features and technical details
- **Context-aware responses** with source attribution
- **Help center** with categorized topics and quick actions

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend services running on specified ports

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd crictourney-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

## Configuration

### Environment Setup
Ensure backend services are running:
- Authentication Service: `http://localhost:8081`
- Main API Gateway: `http://localhost:8765`

### Build Configuration
- **Vite Config**: Modern build setup with React plugin
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing
- **ESLint**: Code quality and consistency

## Features in Detail

### Authentication & Security
- JWT-based authentication
- Protected routes with role-based access
- Automatic token management
- Secure logout functionality

### Tournament Management
- Create and manage tournaments
- View tournament details and statistics
- Admin oversight and control
- User participation tracking

### Team Operations
- Team registration with player details
- Team editing and management
- View team information
- Player roster management

### Scheduling System
- Match schedule creation (Admin)
- Schedule viewing for all users
- Tournament timeline management
- Fixture organization

### AI Help System
- Floating chat widget on all pages
- Natural language query processing
- Comprehensive knowledge base
- Instant answers about platform features
- Help center with categorized information

## Testing

### Test Setup
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Coverage reporting** - Code coverage analysis

### Running Tests
```bash
npm run test          # Run all tests
npm run test:coverage # Run with coverage report
```

## Development

### Code Quality
- **ESLint** configuration for code consistency
- **SonarLint** integration for code quality
- **Prettier** formatting (via ESLint)

### Development Server
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Instant feedback during development

## Deployment

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Build Output
- Optimized bundle with code splitting
- Asset optimization and compression
- Modern JavaScript output

## Contributing

1. Follow the existing code structure
2. Maintain component organization
3. Use proper PropTypes for type checking
4. Follow ESLint rules
5. Add tests for new features
6. Update documentation as needed

## License

This project is private and proprietary.