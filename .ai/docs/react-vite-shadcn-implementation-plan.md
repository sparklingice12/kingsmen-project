# React 19 + Vite + Shadcn/ui + Tailwind CSS Template

**Implementation Plan for Reusable Activation Template (pnpm)**

---

## Overview

A production-ready React 19 + Vite template with:

✅ **React 19** - Latest React with improved features  
✅ **Shadcn/ui** - Accessible, customizable component library (React 19 compatible)  
✅ **Tailwind CSS** - Utility-first styling  
✅ **pnpm** - Fast, efficient package manager  
✅ **Zustand** - State management  
✅ **Framer Motion** - Animations  
✅ **Feature-based architecture** - Scalable structure  
✅ **Design tokens** - Integrated theming  
✅ **Accessibility & performance defaults**

> **Note:** Shadcn/ui officially supports React 19 as of their latest release. All components are updated and tested with React 19.

---

## Setup Steps

### 1. Create Vite Project with React 19

```bash
# Initialize in current directory
pnpm create vite@latest . -- --template react

# Install dependencies
pnpm install

# Upgrade to React 19
pnpm add react@^19 react-dom@^19
```

### 2. Install Tailwind CSS

```bash
pnpm add tailwindcss @tailwindcss/vite
pnpm add -D @types/node
```

### 3. Install Shadcn/ui

```bash
# Initialize Shadcn
pnpm dlx shadcn@latest init
```

**Configuration:**
- TypeScript? → **No**
- Style? → **Default**
- Base color? → **Neutral**
- Global CSS? → **src/index.css**
- CSS variables? → **Yes**
- Tailwind config? → **tailwind.config.js**
- Component alias? → **@/components**
- Utils alias? → **@/lib/utils**

### 4. Install Core Dependencies

```bash
# State management & animations
pnpm add zustand framer-motion

# Optional: 3D support
pnpm add @react-three/fiber @react-three/drei three @react-spring/three
```

> **React 19 Note:** Zustand and Framer Motion are both compatible with React 19. If you encounter peer dependency warnings during installation, you can use `pnpm add --force` as a temporary workaround until all packages update their peer dependencies.

### 5. Install Essential Shadcn Components

```bash
# Add core components
pnpm dlx shadcn@latest add button card input dialog label toast
```

---

## File Structure

```
src/
├── app/
│   ├── App.jsx           # Root component
│   └── providers.jsx     # Context providers
├── features/
│   └── gallery/          # Example feature
│       ├── Gallery.module.jsx
│       ├── useGallery.js
│       ├── gallery.service.js
│       ├── gallery.config.js
│       ├── components/   # Feature-specific components (optional)
│       │   └── GalleryCard.jsx
│       └── index.js
├── components/
│   ├── ui/              # Shadcn components (auto-generated)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   └── ...
│   ├── shared/          # Custom composites & extensions
│   │   ├── IconButton.jsx
│   │   ├── StatCard.jsx
│   │   ├── LoadingButton.jsx
│   │   └── index.js
│   └── features/        # Feature-specific shared components (optional)
│       └── ...
├── lib/
│   └── utils.js         # Shadcn utilities (cn helper)
├── hooks/
│   ├── useFetch.js
│   ├── usePrefersReducedMotion.js
│   ├── useInterval.js
│   └── useDevice.js
├── state/
│   └── store.js         # Zustand store
├── services/
│   ├── api.js
│   ├── telemetry.js
│   └── devices.js
├── config/
│   ├── tokens.js        # Design tokens
│   └── theme.js
├── three/               # Optional: 3D components
│   ├── Scene.jsx
│   └── FloatingBox.jsx
├── utils/
│   └── math.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── main.jsx
└── index.css

# Root config files
├── .env.example
├── .prettierrc
├── .eslintrc.cjs
├── components.json      # Shadcn config
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Configuration Files

### `vite.config.js`

```javascript
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

### `src/index.css`

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;

    /* Custom tokens */
    --timing-fast: 150ms;
    --timing-base: 300ms;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans;
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

---

## Core Implementation

### 1. State Management (`src/state/store.js`)

```javascript
import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // UI slice
  ui: {
    theme: 'light',
    modal: null,
    setTheme: (theme) => {
      set((s) => ({ ui: { ...s.ui, theme } }));
      document.documentElement.classList.toggle('dark', theme === 'dark');
    },
    openModal: (id) => set((s) => ({ ui: { ...s.ui, modal: id } })),
    closeModal: () => set((s) => ({ ui: { ...s.ui, modal: null } })),
  },

  // Data slice
  data: {
    items: [],
    loading: false,
    error: null,
    setItems: (items) => set((s) => ({ data: { ...s.data, items } })),
    setLoading: (loading) => set((s) => ({ data: { ...s.data, loading } })),
    setError: (error) => set((s) => ({ data: { ...s.data, error } })),
  },
}));
```

### 2. API Service (`src/services/api.js`)

```javascript
const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

api.get = (path, opts) => api(path, { method: 'GET', ...opts });
api.post = (path, body, opts) => api(path, { method: 'POST', body: JSON.stringify(body), ...opts });
```

### 3. Custom Hooks

#### `src/hooks/useFetch.js`

```javascript
import { useEffect, useState } from 'react';

export function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    
    fn()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, deps);

  return { data, error, loading };
}
```

#### `src/hooks/usePrefersReducedMotion.js`

```javascript
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener('change', onChange);
    
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return prefers;
}
```

### 4. Custom Components with Shadcn

#### `src/components/shared/StatTile.jsx`

```javascript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatTile({ label, value, icon, className }) {
  return (
    <Card className={cn('hover:scale-105 transition-transform', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
```

### 5. Feature Module Example

#### `src/features/gallery/Gallery.module.jsx`

```javascript
import { useGallery } from './useGallery';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Gallery() {
  const { items, loading, currentPage, nextPage, prevPage } = useGallery();

  if (loading) return <div>Loading...</div>;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex gap-2 justify-center">
        <Button onClick={prevPage} variant="outline">Previous</Button>
        <Button onClick={nextPage}>Next</Button>
      </div>
    </section>
  );
}
```

#### `src/features/gallery/useGallery.js`

```javascript
import { useState, useEffect } from 'react';
import { fetchGalleryItems } from './gallery.service';
import { GALLERY_CONFIG } from './gallery.config';

export function useGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchGalleryItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const { itemsPerPage } = GALLERY_CONFIG;
  const paginatedItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return {
    items: paginatedItems,
    loading,
    currentPage,
    nextPage: () => setCurrentPage((p) => p + 1),
    prevPage: () => setCurrentPage((p) => Math.max(0, p - 1)),
  };
}
```

### 6. App Setup

#### `src/app/App.jsx`

```javascript
import { useStore } from '@/state/store';
import { Button } from '@/components/ui/button';
import Gallery from '@/features/gallery/Gallery.module';

export default function App() {
  const { theme, setTheme } = useStore((s) => s.ui);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">React + Vite + Shadcn</h1>
        <Button onClick={toggleTheme} variant="outline">
          Toggle {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
      </header>
      
      <main>
        <Gallery />
      </main>
    </div>
  );
}
```

#### `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Additional Configuration

### `.env.example`

```bash
VITE_API_BASE=https://api.example.com
```

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### `.eslintrc.cjs`

```javascript
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
  },
};
```

---

## Component Organization Patterns

### Where to Put Custom Components

Shadcn/ui gives you full ownership of component code. Here's how to organize custom implementations:

```
src/
├── components/
│   ├── ui/                    # Shadcn base components (CLI-generated)
│   │   ├── button.jsx         # Pure Shadcn button
│   │   ├── card.jsx           # Pure Shadcn card
│   │   └── dialog.jsx         # Pure Shadcn dialog
│   ├── shared/                # Your custom extensions ✨
│   │   ├── IconButton.jsx     # Button + Icon composite
│   │   ├── StatCard.jsx       # Custom card variant
│   │   ├── LoadingButton.jsx  # Button with loading state
│   │   └── ConfirmDialog.jsx  # Dialog with confirmation logic
│   └── features/              # Feature-specific (optional)
│       └── gallery/
│           └── GalleryCard.jsx # Gallery-specific card
```

---

### Approach 1: Shared Composites (Recommended ✅)

**When:** Need reusable custom components across features  
**Where:** `src/components/shared/`

**Example: Icon Button**

`src/components/shared/IconButton.jsx`
```javascript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function IconButton({ icon: Icon, children, className, ...props }) {
  return (
    <Button className={cn('gap-2', className)} {...props}>
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
}
```

**Example: Stat Card**

`src/components/shared/StatCard.jsx`
```javascript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <Card className={cn('hover:scale-105 transition-transform', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

**Example: Loading Button**

`src/components/shared/LoadingButton.jsx`
```javascript
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingButton({ loading, children, disabled, className, ...props }) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

**Usage:**
```javascript
import { IconButton } from '@/components/shared/IconButton';
import { StatCard } from '@/components/shared/StatCard';
import { LoadingButton } from '@/components/shared/LoadingButton';
import { Download, Users } from 'lucide-react';

export function Dashboard() {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="space-y-4">
      <StatCard
        title="Total Users"
        value="1,234"
        icon={Users}
        trend="+12% from last month"
      />
      
      <IconButton icon={Download} onClick={handleDownload}>
        Download Report
      </IconButton>
      
      <LoadingButton loading={loading} onClick={handleSubmit}>
        Submit
      </LoadingButton>
    </div>
  );
}
```

---

### Approach 2: Direct Modification

**When:** Need to change default behavior for ALL usages  
**Where:** `src/components/ui/<component>.jsx`

**Example: Add default icon size to all buttons**

Edit `src/components/ui/button.jsx` directly:
```javascript
// You own this file - modify freely!
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 ...", // Added gap-2
  {
    variants: {
      // ... existing variants
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10", // Change all icon button sizes
      },
    },
  }
);
```

---

### Approach 3: Feature-Specific Components

**When:** Component only used in one feature  
**Where:** `src/features/<feature>/components/`

**Example: Gallery-specific card**

`src/features/gallery/components/GalleryCard.jsx`
```javascript
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';

export function GalleryCard({ image, title, onLike, onShare }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" onClick={onLike}>
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{title}</h3>
      </CardContent>
    </Card>
  );
}
```

**Updated folder structure:**
```
src/features/gallery/
├── Gallery.module.jsx
├── useGallery.js
├── gallery.service.js
├── gallery.config.js
├── components/           # Feature-specific components
│   └── GalleryCard.jsx
└── index.js
```

---

### Best Practices

1. **Keep `ui/` clean** - Only Shadcn CLI-generated components
2. **Use `shared/` for reusable customs** - Composites, wrappers, variants
3. **Use feature folders for feature-specific** - Keep feature logic contained
4. **Composition over modification** - Prefer wrapping over editing base components
5. **Export from index** - Create `src/components/shared/index.js` for clean imports

**Example barrel export:**

`src/components/shared/index.js`
```javascript
export { IconButton } from './IconButton';
export { StatCard } from './StatCard';
export { LoadingButton } from './LoadingButton';
export { ConfirmDialog } from './ConfirmDialog';
```

**Clean imports:**
```javascript
import { IconButton, StatCard, LoadingButton } from '@/components/shared';
```

---

## Usage Guide

### Adding New Shadcn Components

```bash
# See available components
pnpm dlx shadcn@latest add

# Add specific component
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add dropdown-menu
```

### Creating New Features

1. Create folder in `src/features/<feature-name>/`
2. Add files:
   - `<Feature>.module.jsx` - UI component
   - `use<Feature>.js` - Business logic hook
   - `<feature>.service.js` - API calls
   - `<feature>.config.js` - Configuration
   - `index.js` - Exports

### Theme Customization

Modify CSS variables in `src/index.css` or use Shadcn's theme generator:
https://ui.shadcn.com/themes

---

## Verification Checklist

- [ ] React 19 is installed (`pnpm list react` shows v19.x.x)
- [ ] `pnpm dev` starts successfully
- [ ] `pnpm build` completes without errors
- [ ] No console errors or warnings in browser
- [ ] Theme toggle works (light/dark mode)
- [ ] All Shadcn components render correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Reduced motion preference is respected
- [ ] ESLint passes
- [ ] Code is formatted with Prettier

---

## Next Steps

1. ✅ Review this plan
2. Execute setup steps
3. Install additional Shadcn components as needed
4. Create feature modules following the pattern
5. Customize theme colors
6. Add telemetry/analytics integration
7. Deploy and test

---

## React 19 Features

This template leverages React 19 improvements:

- **No more forwardRef** - Shadcn components updated to remove forwardRef wrappers
- **Improved Hooks** - Better performance with `use` hook and optimized rendering
- **Enhanced Server Components** - If using Next.js or similar frameworks
- **Automatic Batching** - Better state update batching out of the box
- **Better TypeScript Support** - Even though we're using JavaScript, the types are improved

---

## Resources

- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Shadcn React 19 Guide](https://ui.shadcn.com/docs/react-19)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [Framer Motion Docs](https://www.framer.com/motion)
