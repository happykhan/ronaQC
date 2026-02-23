# Contributing to RonaQC

Thank you for considering contributing to RonaQC! This is an open source project and we welcome pull requests for documentation, bug fixes, and new features.

## Development Setup

```bash
git clone https://github.com/happykhan/ronaQC.git
cd ronaQC
npm install
npm run dev
```

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` and `npm run type-check` to ensure code quality
4. Run `npm test` to verify all tests pass
5. Submit a pull request

## Code Style

- TypeScript strict mode is enforced
- Use the GenomicX design tokens (`gx-*` classes) for styling
- Follow existing component patterns in `components/`
- Add tests for new logic in `lib/__tests__/`

## Reporting Issues

Please use the [GitHub issue tracker](https://github.com/happykhan/ronaQC/issues) for bugs, feature requests, or questions.
