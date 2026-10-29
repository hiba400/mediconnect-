# Security Guidelines

## Important Security Notes

### Default Configuration

This repository contains default configuration files for development purposes. **Do not use these settings in production** without modification.

### Required Changes Before Production

1. **JWT Secret Key**
   - Change `Jwt__Key` in `appsettings.json` and docker-compose.yml
   - Use a cryptographically secure random key (minimum 32 characters)
   - Generate with: `openssl rand -base64 32`

2. **Database Passwords**
   - Change PostgreSQL password in docker-compose.yml
   - Use strong passwords for all database connections
   - Store credentials in environment variables or secret management

3. **AI Service API Key**
   - Configure `OPENAI_API_KEY` for AI service if using OpenAI
   - Use environment variables, never commit actual keys
   - Set up usage limits and monitoring

### Environment Variables

Sensitive configuration should use environment variables:

```bash
# Docker Compose
JWT_KEY=your-secret-key
POSTGRES_PASSWORD=your-db-password
OPENAI_API_KEY=your-api-key

# Local Development
# Use appsettings.Development.json or user secrets
dotnet user-secrets set "Jwt:Key" "your-secret-key"
```

### Authentication

- JWT tokens expire after 60 minutes (configurable)
- Passwords are hashed using BCrypt
- Role-based access control enforced on all endpoints
- All API endpoints require valid JWT (except register/login)

### Data Protection

- All passwords hashed with BCrypt before storage
- Database connections use SSL in production
- API communication over HTTPS in production
- CORS configured to allow only trusted origins

### Security Best Practices

1. **Keep Dependencies Updated**
   ```bash
   # Frontend
   npm audit
   npm update

   # Backend
   dotnet list package --vulnerable
   ```

2. **Enable HTTPS**
   - Configure SSL certificates for production
   - Force HTTPS redirects
   - Use HSTS headers

3. **Rate Limiting**
   - Implement rate limiting on authentication endpoints
   - Consider DDoS protection for public APIs

4. **Input Validation**
   - All DTOs validated with FluentValidation
   - SQL injection prevention via Entity Framework Core
   - XSS protection via React sanitization

5. **Logging and Monitoring**
   - Enable security event logging
   - Monitor for suspicious activity
   - Set up alerts for authentication failures

### Database Security

- Use least-privilege database users
- Regular backups with encryption
- Separate databases for each service
- Network isolation in production

### Git Security

- Never commit `.env` files
- Never commit actual API keys or secrets
- Use `.gitignore` to exclude sensitive files
- Review commit history before pushing

### Testing Security

- Run security audits regularly
- Test authentication and authorization
- Validate input sanitization
- Check for exposed endpoints

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly. Do not create public issues for security concerns.

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [.NET Security Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
