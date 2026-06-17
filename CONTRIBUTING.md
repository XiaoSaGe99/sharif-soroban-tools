# Contributing Guidelines

First off, thank you for considering contributing to this project! It's people like you that make this ecosystem such a great community.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Local Development Setup](#local-development-setup)
- [Development Process](#development-process)
- [Commit Message Conventions](#commit-message-conventions)
- [Code Style](#code-style)
- [Testing](#testing)
- [Issue Reporting](#issue-reporting)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Security Vulnerabilities](#security-vulnerabilities)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the repository maintainers.

## Getting Started

We welcome all types of contributions — not just code! You can help with:
- **Bug reports** — open an issue with clear reproduction steps
- **Feature requests** — suggest improvements via issues
- **Documentation** — improve README, add examples, fix typos
- **Code** — fix bugs, add features, improve tests

If you're new to open source, look for issues labeled `good first issue` to get started.

## Local Development Setup

### Prerequisites

- **Node.js** (v18 or later) — for JavaScript/TypeScript tooling
- **Rust** (latest stable via rustup) — for Soroban smart contract development
- **Docker** (optional) — for running localized integration environments
- **Soroban CLI** — install via: `cargo install soroban-cli`

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/sharif-soroban-tools.git
cd sharif-soroban-tools

# Install Node.js dependencies
npm install

# Build Rust components (if applicable)
cargo build
```

## Development Process

1. **Fork the repository** by clicking the "Fork" button on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sharif-soroban-tools.git
   cd sharif-soroban-tools
   ```
3. **Add the upstream repository** as a remote to sync changes:
   ```bash
   git remote add upstream https://github.com/sharif-stellar-tools/sharif-soroban-tools.git
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/my-feature-name
   ```
   Use a descriptive name — `fix/`, `feat/`, `docs/`, or `chore/` prefixes are recommended.
5. **Make your changes** — keep them focused on a single concern.
6. **Write or update tests** to cover your changes.
7. **Run the test suite** to ensure nothing is broken:
   ```bash
   npm test
   ```
8. **Commit your changes** with a descriptive commit message (see conventions below).
9. **Push your branch** to your fork:
   ```bash
   git push origin feature/my-feature-name
   ```
10. **Open a Pull Request** against the `master` branch of the upstream repository.

## Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Types

| Type       | Usage                                      |
|------------|--------------------------------------------|
| `feat`     | A new feature                              |
| `fix`      | A bug fix                                  |
| `docs`     | Documentation changes                      |
| `style`    | Code formatting (no logic change)          |
| `refactor` | Code restructuring (no bug fix or feature) |
| `test`     | Adding or updating tests                   |
| `chore`    | Build, CI, or tooling changes              |

### Examples

```
feat(api): add RPC load balancer with fallback support
fix(core): handle edge case when transaction timeout is zero
docs(readme): update installation instructions for Windows
test(api): add unit tests for router error handling
```

## Code Style

- **TypeScript/JavaScript**: We use standard formatting. Run the linter before submitting:
  ```bash
  npm run lint
  ```
- **Rust**: We use `rustfmt`. Format your code with:
  ```bash
  cargo fmt
  ```
- Write clear, self-documenting code. Add comments only for complex logic.
- Keep functions small and focused on a single responsibility.
- Use descriptive variable and function names.

## Testing

- Write tests for any new functionality.
- Ensure all existing tests pass before submitting your PR.
- Run tests with:
  ```bash
  npm test     # JavaScript/TypeScript tests
  cargo test   # Rust tests
  ```
- For integration tests, you may need Docker running locally.

## Pull Request Guidelines

- **One PR per feature/bug fix** — keep changes focused.
- **Reference the issue** — include `Closes #123` in your PR description.
- **Keep PRs reviewable** — aim for under 400 lines changed when possible.
- **Include screenshots** for UI changes.
- **Respond to feedback** — maintainers may request changes; please engage constructively.
- **Ensure CI passes** — all checks must be green before merging.

### PR Review Process

1. A maintainer will review your PR within a few days.
2. They may request changes or ask questions.
3. Once approved, a maintainer will merge your PR.
4. Congratulations — you're now a contributor!

## Issue Reporting

If you encounter a bug or have a feature request, please search the [existing issues](https://github.com/sharif-stellar-tools/sharif-soroban-tools/issues) first to ensure it hasn't already been reported.

When opening a new issue, please use the provided issue templates and include as much detail as possible:
- Operating system and version.
- Version of the software/dependencies you are using.
- Clear steps to reproduce the bug.
- Expected vs. actual behavior.
- Logs or error messages (if applicable).

## Security Vulnerabilities

If you discover a security vulnerability within this project, please DO NOT open a public issue. Instead, contact the repository administrators directly via email. We take security seriously and will address the issue promptly.

---

*Thank you for contributing to sharif-soroban-tools!*
