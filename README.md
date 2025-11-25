# Kingsmen App Template

> **Production-ready React 19 + Vite + Shadcn/ui + Tailwind CSS starter template**

A modern, scalable web application template with best practices baked in. Built for rapid activation of new projects with a feature-based architecture, accessible components, and developer-friendly conventions.

---

## ⚡ Quick Start

```bash
# Install dependencies (pnpm required)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

**Important:** This project uses `pnpm` as the package manager. Install it globally if you haven't already:
```bash
npm install -g pnpm
```

---

## 🚀 Tech Stack

### Core Framework
- **React 19** - Latest React with improved rendering and performance
- **Vite 7** - Lightning-fast build tool with HMR
- **JavaScript** - Intentionally using JS (not TypeScript) for flexibility

### UI & Styling
- **Shadcn/ui** - Accessible, customizable component library
- **Tailwind CSS 4** - Utility-first CSS with design tokens
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, consistent icon set
- **Framer Motion** - Production-ready animation library

### State & Tools
- **Zustand** - Lightweight, scalable state management
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting (configured)

---

## 📁 Project Structure

```
src/
├── app/              # Main application components
├── features/         # Feature-based modules (self-contained)
├── components/
│   ├── ui/          # Shadcn components (CLI-generated)
│   └── shared/      # Custom reusable components
├── hooks/           # Custom React hooks
├── state/           # Zustand store slices
├── services/        # API clients and external services
└── lib/             # Utilities and helpers
```

---

## 🎯 Key Features

### ✅ **Feature-Based Architecture**
Organize code by feature, not by file type. Each feature is self-contained with its own components, hooks, and services.

### ✅ **Component Design System**
- Pre-configured Shadcn/ui components
- Accessible by default (WCAG compliant)
- Fully customizable with CSS variables
- Dark mode support built-in

### ✅ **Developer Experience**
- Path aliases (`@/components`, `@/hooks`, etc.)
- Hot Module Replacement (HMR)
- ESLint + Prettier pre-configured
- Clear file naming conventions

### ✅ **Performance & Accessibility**
- Reduced motion support
- Semantic HTML patterns
- Optimized bundle sizes
- Fast refresh in development

---

## 🛠️ Common Tasks

### Adding Shadcn Components
```bash
pnpm dlx shadcn@latest add button card dialog input
```

### Creating a New Feature
```bash
mkdir -p src/features/my-feature
# Then add: MyFeature.module.jsx, useMyFeature.js, my-feature.service.js
```

### Environment Variables
Create a `.env` file in the root:
```bash
VITE_API_BASE=https://api.example.com
```

Access in code: `import.meta.env.VITE_API_BASE`

---

## 📚 Documentation

> **🤖 For AI Assistants & Detailed Docs:** See [AGENTS.md](./AGENTS.md)

The AGENTS.md file contains comprehensive information about:
- Complete tech stack details
- Architecture patterns and conventions
- Code examples and best practices
- Component organization strategies
- State management patterns
- Common troubleshooting solutions

---

## 🎨 Development Workflow

### File Naming Conventions
- **Components:** `PascalCase.jsx` (e.g., `App.jsx`, `UserCard.jsx`)
- **Hooks:** `useCamelCase.js` (e.g., `useFetch.js`)
- **Services:** `camelCase.service.js` (e.g., `api.service.js`)
- **Feature Modules:** `PascalCase.module.jsx` (e.g., `Gallery.module.jsx`)

### Import Aliases
```javascript
import { Button } from '@/components/ui/button';
import { useStore } from '@/state/store';
import { api } from '@/services/api';
```

### State Management
```javascript
// Access specific slices to prevent unnecessary re-renders
const { theme, setTheme } = useStore((s) => s.ui);
```

### Barrel Exports (Recommended)
Create `src/components/shared/index.js` for cleaner imports:
```javascript
// src/components/shared/index.js
export { IconButton } from './IconButton';
export { StatCard } from './StatCard';
export { LoadingButton } from './LoadingButton';
```

Then import multiple components easily:
```javascript
import { IconButton, StatCard, LoadingButton } from '@/components/shared';
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build optimized production bundle |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint checks |

---

## 🔧 Configuration Files

- **`vite.config.js`** - Vite build configuration with path aliases
- **`tailwind.config.js`** - Tailwind theme customization
- **`components.json`** - Shadcn/ui configuration
- **`eslint.config.js`** - ESLint rules and settings
- **`.prettierrc`** - Code formatting rules

---

## 💡 When to Use This Template

**✅ Perfect for:**
- Production web applications
- Marketing sites with interactive components
- Dashboards and admin panels
- Client portals and internal tools
- MVP prototypes that need to scale

**❌ Consider alternatives for:**
- Static blogs → Use Astro or Next.js
- E-commerce sites → Use Next.js with App Router
- Mobile apps → Use React Native

---

## 🐛 Troubleshooting

### Peer Dependency Warnings
React 19 is new; some packages haven't updated peer dependencies yet. These warnings are safe to ignore.

### Shadcn Components Not Found
Ensure `jsconfig.json` has path aliases configured properly. Check the `@/*` mapping.

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm build
```

---

## 🎨 Theme Customization

### Using Shadcn Theme Generator
Visit [ui.shadcn.com/themes](https://ui.shadcn.com/themes) to generate custom color schemes.

### Manual Customization
Edit CSS variables in `src/index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... customize other colors */
}
```

### Dark Mode
Dark mode is built-in and controlled by the `.dark` class on `<html>`:
```javascript
// Toggle dark mode
const { theme, setTheme } = useStore((s) => s.ui);
setTheme(theme === 'light' ? 'dark' : 'light');
```

---

## ⚡ React 19 Features

This template leverages React 19 improvements:

- **No more forwardRef** - Shadcn components updated to remove forwardRef wrappers
- **Improved Hooks** - Better performance with new `use` hook and optimized rendering
- **Automatic Batching** - Better state update batching out of the box
- **Enhanced Error Handling** - Better error boundaries and development warnings

> **Note:** Some dependencies may show peer dependency warnings as the ecosystem updates to React 19. These are safe to ignore or use `pnpm add --force` if needed.

---

## 📖 Additional Resources

- **Implementation Guide:** [.ai/docs/react-vite-shadcn-implementation-plan.md](./.ai/docs/react-vite-shadcn-implementation-plan.md)
- **React 19 Release Notes:** [react.dev/blog/2024/12/05/react-19](https://react.dev/blog/2024/12/05/react-19)
- **Shadcn/ui Documentation:** [ui.shadcn.com](https://ui.shadcn.com)
- **Shadcn React 19 Guide:** [ui.shadcn.com/docs/react-19](https://ui.shadcn.com/docs/react-19)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- **Vite Guide:** [vite.dev](https://vite.dev)
- **Zustand:** [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)
- **Framer Motion:** [framer.com/motion](https://www.framer.com/motion)

---

## 📝 License

This is a template project maintained by the Migo Kartel team.

---

**Last Updated:** 2025-11-25  
**Template Version:** 1.0.0
