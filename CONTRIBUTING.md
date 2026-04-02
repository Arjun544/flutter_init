# Contributing to FlutterInit

Welcome! 🚀 We're thrilled you want to help us evolve FlutterInit. Our goal is to eliminate "initial drag" and provide an elite scaffolding experience for Flutter developers worldwide.

## Project Philosophy

FlutterInit is built on the principle of **Contribution-Based Evolution**. We don't just want a static tool; we want an engine that grows alongside the Flutter ecosystem. We value architect-level contributions that prioritize clean code, performance, and best practices.

## Ways to Contribute

1. **New Architectural Patterns**: Add support for MVC, Bloc-Clean, or your specialized team structure by adding a new `architecture` flag and its corresponding overlay.
2. **Web Dashboard Improvements**: Enhance the Next.js wizard UI to make project configuration even more intuitive.
3. **Internal Logic Refinement**: Optimize the `generator/` to handle more complex layered merges or conditional file generation.
4. **Documentation**: Clarify the onboarding experience or add deep-dive guides for advanced project structures.

## Local Setup

We use **Bun** for ultra-fast package management and script execution.

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Arjun544/flutter_init.git
   cd flutter_init
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Run Dev Server**:
   ```bash
   bun run dev
   ```
   *The dashboard will be active at `http://localhost:3000`.*

---

## Branch Naming Convention

Please follow these naming standards for your branches:
- `feat/feature-name` (New features/templates)
- `fix/bug-fix-description` (Bug fixes)
- `docs/doc-updates` (Improvements to markdown)
- `perf/optimization` (Performance enhancements)

## Development Workflow

We provide a specialized dev loop for template creation that provides "Hot Reload" for your scaffolds.

### The Template Dev Loop
1. Open your terminal and run:
   ```bash
   bun run --watch scripts/template-dev.ts
   ```
2. The script will watch your changes in `templates/` and `app/lib/`, auto-regenerating a project into the `dev_out/` folder.
3. It will automatically run `dart analyze` on the generated code and report any errors directly to your terminal.

See the detailed [Template Development Guide](docs/template-development.md) and [Handlebars Guide](docs/handlebars.md) for more info.

---

## PR Checklist

Before submitting your PR, ensure you can check off the following:

- [ ] **Valid Dart**: Run the `template-dev.ts` script and verify that `dart analyze` shows zero errors in `dev_out/`.
- [ ] **Flag Paths**: Check both `true` and `false` paths for any new Handlebars conditionals.
- [ ] **Barrel Exports**: New services/widgets are correctly exported in `services.dart.hbs` or `widgets.dart.hbs`.
- [ ] **Linting**: Ensure any core change to the generator passes `bun run lint`.
- [ ] **Documentation**: Updated `docs/configuration.md` if you added a new flag to `schema.ts`.

## Contributors Hall of Fame

Every merged PR earns you a spot in our **Hall of Fame** listed in the `README.md`. We appreciate your time and expertise in making Flutter development faster for everyone!

---

*Need help? Open an issue or join our community discussions!*
