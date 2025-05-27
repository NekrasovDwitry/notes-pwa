# Notes PWA

A modern Progressive Web Application for note-taking, built with React, TypeScript, and Vite.

## 🚀 Features

- Modern React with TypeScript
- Fast development with Vite
- Progressive Web App (PWA) support with offline capabilities
- Type-safe API integration with OpenAPI
- React Query for efficient data fetching
- MobX for state management
- React Hook Form with Zod validation
- JWT-based authentication
- Clean architecture with feature-based organization
- ESLint and Prettier for code quality
- MSW for API mocking
- SASS for styling
- TipTap for text editing

## 📦 Project Structure

```
src/
├── app/          # Application-wide components and configuration
├── features/     # Feature-based modules
│   ├── auth/     # Authentication feature
│   ├── note/     # Single note management
│   └── notes/    # Notes list and management
└── shared/       # Shared utilities, types, and API definitions
    ├── api/      # API integration and types
    ├── model/    # Shared data models
    └── ui/       # Shared UI
```

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 6
- **State Management**:
  - MobX for local state
  - React Query for server state
- **Form Handling**: React Hook Form + Zod
- **Authentication**: JWT
- **API Integration**: OpenAPI + openapi-fetch
- **Routing**: React Router 7
- **Styling**: SASS
- **Code Quality**: ESLint, Prettier
- **API Mocking**: MSW
- **Text Editor**: TipTap

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd notes-pwa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run api` - Generate TypeScript types from OpenAPI schema

## 🔧 Development

### Code Organization

The project follows a feature-based architecture:

- `app/` - Contains application-wide components and configuration
- `features/` - Contains feature-specific modules:
  - `auth/` - Authentication and authorization
  - `note/` - Single note management
  - `notes/` - Notes list and management
- `shared/` - Contains shared utilities, types, and API definitions:
  - `api/` - API integration and type definitions
  - `model/` - Shared data models
  - `ui/` - Shared UI

### State Management

The project uses a combination of state management solutions:

- MobX for local state management
- React Query for server state management
- React Hook Form for form state

### Form Handling

Forms are managed using React Hook Form with Zod validation:

- Type-safe form validation
- Efficient form state management
- Built-in error handling

### API Integration

The project uses OpenAPI for type-safe API integration:

- API types are generated from the schema at `src/shared/api/schema/main.yaml`
- MSW for API mocking in development
- React Query for data fetching and caching

### Code Quality

The project uses ESLint with strict TypeScript rules and Prettier for code formatting:

- Type-aware linting rules
- React-specific rules
- Import sorting and organization
- Code style enforcement
- Feature-based architecture enforcement
