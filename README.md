<!--
  PREMIUM OPEN SOURCE README
  Designed with Antigravity 🚀
  Theme: Refined Digital Architecture
-->

<div align="center">
  <img src="public/logo.svg" width="120" alt="FlutterInit Logo" />
  
  <br />

  <h1><b>FlutterInit</b></h1>
  <p><i>The High-Performance Scaffolding Engine for Modern Flutter Apps</i></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Build-Passing-2ecc71?style=flat-square&logo=github-actions&logoColor=white" alt="Build Status" />
    <a href="https://github.com/Arjun544/flutter_init/stargazers"><img src="https://img.shields.io/github/stars/Arjun544/flutter_init?style=flat-square&color=2ecc71&logo=github&logoColor=white" alt="Stars" /></a>
    <a href="https://github.com/Arjun544/flutter_init/network/members"><img src="https://img.shields.io/github/forks/Arjun544/flutter_init?style=flat-square&color=3498db&logo=github&logoColor=white" alt="Forks" /></a>
    <a href="https://github.com/Arjun544/flutter_init/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-10b981?style=flat-square" alt="License" /></a>
  </p>

  <br />

  <table border="0">
    <tr>
      <td align="center">
        <a href="https://flutterinit.com/">
          <img src="https://img.shields.io/badge/🚀_Generate_Your_Project-6366f1?style=for-the-badge&logoColor=white" height="40" alt="Generate Your Project" />
        </a>
      </td>
      <td width="20"></td>
      <td align="center">
        <a href="docs/getting-started.md">
          <img src="https://img.shields.io/badge/📚_Documentation-34495e?style=for-the-badge&logoColor=white" height="40" alt="Read Docs" />
        </a>
      </td>
    </tr>
  </table>

  <br />

  <img src="assets/hero.png" width="100%" alt="FlutterInit Node Pattern Interface" style="border-radius: 20px;" />
</div>

---

**No installation required.** Open **[flutterinit.com](https://flutterinit.com)** and generate.

## 🏛️ What is FlutterInit?

FlutterInit is a web-based scaffolding engine for Flutter. 

You visit flutterinit.com, pick your architecture, state management, backend, and navigation style — and FlutterInit generates a production-ready Flutter project as a downloadable zip.

No templates to clone. No CLI to install. Open the dashboard, configure, download, build.

---

## 🔄 How It Works

1. Open **[flutterinit.com](https://flutterinit.com)**
2. Name your project and choose your options:
   - **Architecture:** Clean Architecture, MVVM, Feature-First
   - **State Management:** Riverpod, Bloc, Provider, GetX, MobX
   - **Backend:** Firebase, Supabase, Appwrite, or none
   - **Navigation:** GoRouter, AutoRoute, or imperative
   - **Design:** Material 3, dark mode, ScreenUtil
   - **Extras:** localization, logging, permissions, image picker, etc.
3. Click **"Generate Project"**
4. Download the `.zip`
5. Unzip → `cd` into the folder → run `flutter pub get` → `flutter run`

---

## 📦 What's Inside the Generated Project?

Every generated project includes:
- Folder structure matching your chosen architecture
- Routing pre-configured with your chosen navigation package
- State management boilerplate set up and ready to extend
- `pubspec.yaml` with all chosen dependencies declared
- Environment config (`.env` support via `flutter_dotenv`)
- Logging, error handling, and base network layer (if Dio selected)
- Material 3 theme with dark mode support
- AI context files: `CLAUDE.md`, `AGENTS.md`, `.cursorrules` — pre-written for your exact stack so AI editors have full project context from day one

---

## ⚡ Quick Start

**No installation required.**

1. Go to **[flutterinit.com](https://flutterinit.com)**
2. Configure your stack using the visual dashboard
3. Click **Generate Project** and download your `.zip`
4. Unzip and run:

```bash
cd your_project_name
flutter pub get
flutter run
```

That's it. Your project is ready.

---

## 🛠️ Prerequisites

### To use a generated project
- Flutter SDK `^3.5.0` ([install guide](https://docs.flutter.dev/get-started/install))

No other tools required. FlutterInit runs in your browser.

### To run FlutterInit locally (contributors only)
- Node.js `^20.0.0` or Bun `^1.1.0`
- Flutter SDK (for running `dart analyze` on generated output during testing)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for full setup

---

## 🧩 Support Matrix

You configure all of these options directly in the dashboard — no config files, no flags. The matrix below shows every supported option.

| Category | Supported Options |
| :--- | :--- |
| **Architectures** | Clean Architecture, MVVM, Feature-First |
| **State Management** | Riverpod, Bloc / Cubit, Provider, GetX, MobX |
| **Functional** | FPDart (Either, Option, Task), runTask Wrapper |
| **Backend / DB** | Firebase, Supabase, Appwrite, Hive, Shared Preferences |
| **Networking** | Dio (Interceptors), Http, Cached Network Image |
| **Navigation** | GoRouter, AutoRoute |
| **Design / Motion** | Flutter Animate, Skeletonizer, ScreenUtil, Native Splash |
| **Icons** | Iconsax Plus, Remix Icons, HugeIcons (Stroke/Solid) |
| **Infrastructure** | DotEnv, Logger, Easy Localization, App Version Update |
| **Utilities** | Picker (Image/File), Permissions, Share Plus, Geolocator |

---

## 🤖 AI-Ready From Day One

Every generated project includes pre-written AI context files tailored to your exact stack:

- `CLAUDE.md` — for Claude Code
- `AGENTS.md` — for Codex and other agent workflows  
- `.cursor/rules/flutter-project.mdc` — for Cursor

These files give your AI editor full context about your architecture, state management pattern, folder structure, and conventions — without you having to write a single prompt.

---

## 📚 Documentation

New to FlutterInit? Start with the [Getting Started Guide](docs/getting-started.md).

Explore our technical guides to understand the architecture and flags:

*   **[Getting Started Guide](docs/getting-started.md)**: From download to first successful run.
*   **[Configuration Reference](docs/configuration.md)**: Every project option explained in detail.
*   **[Generated Output Reference](docs/generated-output.md)**: Understanding the "src-first" structure.
*   **[Architecture Overview](docs/architecture.md)**: Under the hood of the Next.js/Handlebars engine.
*   **[Handlebars Language Guide](docs/handlebars.md)**: Logic patterns for template contributors.
*   **[Testing Guide](docs/testing.md)**: Our comprehensive 2-layer validation strategy and tiered CI/CD pipeline.
*   **[Contribution Guide](CONTRIBUTING.md)**: How to add your own patterns.

---

## 🗺️ Roadmap

We use GitHub Projects to track what's in progress and what's coming next.

👉 [View the FlutterInit Roadmap](https://github.com/users/Arjun544/projects/1)

Want to contribute? Pick up any open issue labeled [`good first issue`](https://github.com/Arjun544/flutter_init/issues?q=label%3A%22good+first+issue%22).

---

## 🧑‍💻 Running FlutterInit Locally (Contributors)

If you want to contribute to FlutterInit's engine or templates, you'll need to run it locally.

**Clone & install:**
```bash
git clone https://github.com/Arjun544/flutter_init.git
cd flutter_init
bun install
```

**Start the development server:**
```bash
bun run dev
```

Open `http://localhost:3000` to use the local dashboard.

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Architecture Overview](docs/architecture.md) for how the Handlebars templating engine works.

---

## 💻 Tech Stack

The engine powering FlutterInit:

*   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **Templating**: [Handlebars.js](https://handlebarsjs.com/) for dynamic Dart generation
*   **Icons**: [HugeIcons](https://hugeicons.com/) & [Lucide](https://lucide.dev/)
*   **Runtime**: [Bun](https://bun.sh/) (High-speed package management)

---

## 🛠️ Built By

<div align="center">
  <a href="https://github.com/Arjun544">
    <img src="https://github.com/Arjun544.png" width="100" style="border-radius: 50%;" />
    <br />
    <b>Arjun Mahar</b>
  </a>
  <p><i>Founder & Lead Architect</i></p>
</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/Built_With-Love-e84393?style=for-the-badge&logo=heart" alt="Built with Love" />
  <img src="https://img.shields.io/badge/Made_With-Markdown-000000?style=for-the-badge&logo=markdown" alt="Made with Markdown" />
  <img src="https://img.shields.io/badge/Open-Source-2ecc71?style=for-the-badge&logo=github" alt="Open Source" />
</p>

<div align="center">
  <p>© 2026 FlutterInit Project. Released under the MIT License.</p>
</div>
