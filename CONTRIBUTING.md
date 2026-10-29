# Contributing to MediConnect

Thank you for your interest in contributing to MediConnect. This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- .NET 10.0 SDK
- Node.js 22
- Docker and Docker Compose
- PostgreSQL 16 (or use Docker)

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/mediconnect-.git
   cd mediconnect-
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Start development services:
   ```bash
   cd docker
   docker compose up -d
   ```

## Code Style

### Backend (C#)

- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML documentation comments for public APIs
- Run code analysis:
  ```bash
  dotnet format
  ```

### Frontend (TypeScript/React)

- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Add TypeScript types for all functions
- Format code:
  ```bash
  npm run format
  ```
- Lint code:
  ```bash
  npm run lint
  ```

## Commit Guidelines

### Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality
fix(messaging): resolve SignalR connection timeout
docs(readme): update installation instructions
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the README if new features are added
4. Create a pull request with a clear description
5. Link related issues

## Testing

### Backend Tests

```bash
cd monolith
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
# Test monolith API
powershell -ExecutionPolicy Bypass -File scripts/test-monolith.ps1

# Test messaging
powershell -ExecutionPolicy Bypass -File scripts/test-messaging.ps1
```

## Project Structure

When adding new features:

- **Backend**: Add controllers in appropriate service, update DTOs in Domain project
- **Frontend**: Add routes in `src/routes/`, hooks in `src/hooks/`, components in `src/components/`
- **Database**: Add migrations for schema changes

## Documentation

- Update `IMPLEMENTATION_GUIDE.md` for backend changes
- Update API documentation in README for new endpoints
- Add comments for complex logic

## Questions?

Feel free to open an issue for questions or discussion.
