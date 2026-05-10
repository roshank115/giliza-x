# Contributing to Giliza X

Thank you for contributing to global healthcare access! Here's how to get started.

## Code Style

### JavaScript/TypeScript
```bash
# Format code
npm run lint:fix

# Check types
tsc --noEmit
```

### Python
```bash
# Format code
black ai-service/
pylint ai-service/

# Type checking
mypy ai-service/
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai-service && pytest
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
6. Wait for code review
7. Address feedback
8. Merge!

## Reporting Issues

Use GitHub Issues with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment info

## Community

- **Discussions**: GitHub Discussions
- **Documentation**: See `docs/` folder
- **Email**: support@giliza-x.com

---

Thanks for making healthcare better! 💚
