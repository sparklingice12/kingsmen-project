# Kingsmen App Template - Code Agent Context

## Project Overview

This is a production-ready **React 19 + Vite + Shadcn/ui + Tailwind CSS** application template designed for rapid activation of new web projects. It follows modern best practices with a feature-based architecture, type-safe patterns, and accessibility defaults.

**Package Manager:** `pnpm` (required)

## Tech Stack

### Core
- **React 19** - Latest React with improved features
- **Vite 7** - Fast build tool with HMR
- **JavaScript** - No TypeScript (intentional design choice)

### UI & Styling
- **Shadcn/ui** - React 19-compatible accessible component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible primitives (via Shadcn)
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant management

### State & Data
- **Zustand** - Lightweight state management
- **Framer Motion** - Animation library

### Code Quality
- **ESLint** - Linting with React-specific rules
- **Prettier** - Code formatting (configured)

## Project Structure

```
kingsmen-app-template/
├── .ai/
│   └── docs/
│       └── react-vite-shadcn-implementation-plan.md  # Complete setup guide
├── src/
│   ├── app/
│   │   └── App.jsx                   # Main application component
│   ├── features/                     # Feature-based modules
│   │   └── gallery/                  # Example feature
│   ├── components/
│   │   ├── ui/                       # Shadcn components (auto-generated)
│   │   └── shared/                   # Custom composite components
│   ├── lib/
│   │   └── utils.js                  # Shadcn utilities (cn helper)
│   ├── hooks/
│   │   ├── useFetch.js              # Data fetching hook
│   │   ├── usePrefersReducedMotion.js
│   │   └── use-toast.js             # Toast notifications
│   ├── state/
│   │   └── store.js                 # Zustand global store
│   ├── services/
│   │   └── api.js                   # API client utilities
│   ├── assets/                      # Images, icons, fonts
│   ├── index.css                    # Global styles with Tailwind
│   └── main.jsx                     # Application entry point
├── components.json                  # Shadcn configuration
├── tailwind.config.js               # Tailwind configuration
├── vite.config.js                   # Vite configuration
└── package.json

```

## Key Features

### 1. Feature-Based Architecture
Each feature is self-contained with its own:
- Component module (`*.module.jsx`)
- Custom hook (`use*.js`)
- Service layer (`*.service.js`)
- Configuration (`*.config.js`)

**Example:** `src/features/gallery/`

### 2. Design System Integration
- **CSS Variables** - Theme tokens defined in `src/index.css`
- **Tailwind Extensions** - Custom colors, animations, fonts in `tailwind.config.js`
- **Dark Mode** - Built-in dark mode support via `.dark` class
- **Accessibility** - Reduced motion support, semantic HTML

### 3. State Management Pattern (Zustand)
Slice-based organization in `src/state/store.js`:
```javascript
{
  ui: { theme, modal, setTheme, openModal, closeModal },
  data: { items, loading, error, setItems, setLoading, setError }
}
```

### 4. Component Organization

**Shadcn Components (`src/components/ui/`)**
- CLI-generated, fully owned code
- Modify directly for global changes
- Examples: `button.jsx`, `card.jsx`, `dialog.jsx`

**Custom Composites (`src/components/shared/`)**
- Built on top of Shadcn components
- Reusable across features
- Examples: `IconButton.jsx`, `StatCard.jsx`, `LoadingButton.jsx`

**Feature Components (`src/features/*/components/`)**
- Feature-specific, not shared
- Example: `gallery/components/GalleryCard.jsx`

## Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

### Adding Shadcn Components
```bash
# Add individual components
pnpm dlx shadcn@latest add button card input dialog

# View available components
pnpm dlx shadcn@latest add
```

### Environment Variables
Create `.env` file (see `.env.example`):
```bash
VITE_API_BASE=https://api.example.com
```

Access via `import.meta.env.VITE_*`

## Important Conventions

### File Naming
- **Components:** PascalCase (e.g., `App.jsx`, `GalleryCard.jsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useFetch.js`)
- **Services:** camelCase with `.service.js` suffix
- **Configuration:** camelCase with `.config.js` suffix
- **Feature Modules:** PascalCase with `.module.jsx` suffix

### Import Aliases
```javascript
// Configured in vite.config.js
import { Button } from '@/components/ui/button';
import { useStore } from '@/state/store';
import { api } from '@/services/api';
```

### Styling Patterns
```javascript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

### State Access
```javascript
// Access specific slices to prevent unnecessary re-renders
const { theme, setTheme } = useStore((s) => s.ui);
const { items, loading } = useStore((s) => s.data);
```

## Code Examples

### Creating a New Feature

1. **Create feature directory:**
```bash
mkdir -p src/features/my-feature/components
```

2. **Create module component:**
```javascript
// src/features/my-feature/MyFeature.module.jsx
import { useMyFeature } from './useMyFeature';

export default function MyFeature() {
  const { data, loading } = useMyFeature();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <section>
      {/* Feature UI */}
    </section>
  );
}
```

3. **Create custom hook:**
```javascript
// src/features/my-feature/useMyFeature.js
import { useState, useEffect } from 'react';

export function useMyFeature() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Logic here
  
  return { data, loading };
}
```

### Creating a Custom Component

```javascript
// src/components/shared/MyButton.jsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MyButton({ icon: Icon, children, className, ...props }) {
  return (
    <Button className={cn('gap-2', className)} {...props}>
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
}
```

## Design Tokens

### Theme Colors (HSL format)
Defined in `src/index.css` as CSS variables:
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--accent`, `--destructive`
- `--border`, `--input`, `--ring`

### Custom Timing
- `--timing-fast: 150ms`
- `--timing-base: 300ms`

### Typography
- **Sans:** Inter
- **Mono:** Fira Code

### Border Radius
- `--radius: 0.5rem`
- Computed: `lg`, `md`, `sm`

## Common Tasks

### Toggle Dark Mode
```javascript
const { theme, setTheme } = useStore((s) => s.ui);
setTheme(theme === 'light' ? 'dark' : 'light');
```

### Make API Calls
```javascript
import { api } from '@/services/api';

// GET request
const data = await api.get('/endpoint');

// POST request
const result = await api.post('/endpoint', { key: 'value' });
```

### Show Toast Notification
```javascript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: "Success",
  description: "Your action was completed.",
});
```

## Performance Considerations

### Reduced Motion
Automatically respects `prefers-reduced-motion`:
```javascript
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const prefersReducedMotion = usePrefersReducedMotion();
```

### Code Splitting
Use dynamic imports for heavy features:
```javascript
const HeavyFeature = lazy(() => import('@/features/heavy/Heavy.module'));
```

## React 19 Notes

- Shadcn/ui is officially compatible with React 19
- Some dependencies may show peer dependency warnings during `pnpm install`
- Use `pnpm add --force` if needed (temporary until ecosystem catches up)
- ESLint settings reference React 18.2 in config (cosmetic, doesn't affect functionality)

## Resources

- **Implementation Guide:** [.ai/docs/react-vite-shadcn-implementation-plan.md](file:///.ai/docs/react-vite-shadcn-implementation-plan.md)
- **Shadcn/ui Docs:** https://ui.shadcn.com
- **Tailwind CSS Docs:** https://tailwindcss.com
- **Zustand Docs:** https://zustand-demo.pmnd.rs
- **Vite Docs:** https://vite.dev

## When to Use This Template

✅ **Good for:**
- Production web applications
- Marketing sites with interactive components
- Dashboards and admin panels
- Client portals
- Internal tools

❌ **Not ideal for:**
- Static blogs (use Astro/Next.js)
- E-commerce (use Next.js with App Router)
- Mobile apps (use React Native)

## Modification Guidelines

### Adding TypeScript
This template intentionally uses JavaScript. To add TypeScript:
1. Install: `pnpm add -D typescript @types/react @types/react-dom`
2. Add `tsconfig.json`
3. Rename `.jsx` files to `.tsx`
4. Update `vite.config.js` imports

### Adding Routing
```bash
# For SPA routing
pnpm add react-router-dom

# Or use file-based routing with Vite plugins
pnpm add vite-plugin-pages
```

### Adding Forms
```bash
# React Hook Form + Zod validation
pnpm add react-hook-form @hookform/resolvers zod
pnpm dlx shadcn@latest add form
```

## Troubleshooting

### Peer Dependency Warnings
React 19 is new; some packages haven't updated peer dependencies yet. Safe to ignore or use `--force`.

### Shadcn Components Not Found
Ensure `jsconfig.json` has the `@` alias configured:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm build
```

---

**Last Updated:** 2025-11-25  
**Template Version:** 0.0.0  
**Maintained by:** Kingsmen SG Team
