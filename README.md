# Notes PWA

A modern Progressive Web Application for note-taking, built with React, TypeScript, and Vite.

## 🚀 Features

- Modern React with TypeScript
- Fast development with Vite
- Type-safe API integration with OpenAPI
- React Query for efficient data fetching
- Clean architecture with feature-based organization
- ESLint and Prettier for code quality
- MSW for API mocking

## 📦 Project Structure

```
src/
├── app/          # Application-wide components and configuration
├── features/     # Feature-based modules
└── shared/       # Shared utilities, types, and API definitions
```

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 6
- **State Management**: React Query
- **API Integration**: OpenAPI + openapi-fetch
- **Routing**: React Router 7
- **Code Quality**: ESLint, Prettier
- **API Mocking**: MSW

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
- `features/` - Contains feature-specific modules
- `shared/` - Contains shared utilities, types, and API definitions

### API Integration

The project uses OpenAPI for type-safe API integration. API types are generated from the schema located at `src/shared/api/schema/main.yaml`.

### Code Quality

The project uses ESLint with strict TypeScript rules and Prettier for code formatting. The configuration includes:
- Type-aware linting rules
- React-specific rules
- Import sorting and organization
- Code style enforcement
