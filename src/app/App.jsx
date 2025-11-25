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
        <div className="min-h-screen p-8 bg-background text-foreground transition-colors duration-300">
            <header className="mb-8 flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Kingsmen App Template</h1>
                    <p className="text-muted-foreground">
                        A template for Kingsmen applications built on top of React, Vite, and Shadcn UI. Edit <strong className='font-mono font-semibold bg-[#EEE] dark:bg-background text-foreground p-1 rounded'>src/app/App.jsx</strong> to get started.
                    </p>

                </div>
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
