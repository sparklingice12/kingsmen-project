// Settings modal component
import { useState } from 'react';
import { useStore } from '@/state/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioControls from '@/features/audio/components/AudioControls';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { playSfx } from '@/features/audio/audio.service';

export default function SettingsModal() {
    const modalOpen = useStore((s) => s.ui.modalOpen);
    const closeModal = useStore((s) => s.ui.closeModal);

    const isOpen = modalOpen === 'settings';

    const handleClose = () => {
        playSfx('click');
        closeModal();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5" />
                        Game Settings
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="absolute right-4 top-4 p-2"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </DialogHeader>

                <Tabs defaultValue="audio" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="audio"
                            onClick={() => playSfx('click')}
                        >
                            Audio
                        </TabsTrigger>
                        <TabsTrigger
                            value="game"
                            onClick={() => playSfx('click')}
                        >
                            Game
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="audio" className="mt-6">
                        <AudioControls />
                    </TabsContent>

                    <TabsContent value="game" className="mt-6 space-y-6">
                        <div className="text-center text-muted-foreground">
                            <p>Game settings will be added in future updates.</p>
                            <p className="text-sm mt-2">
                                Currently, all game preferences are automatically saved.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Settings button component for HUD
export function SettingsButton({ className = '' }) {
    const openModal = useStore((s) => s.ui.openModal);

    const handleClick = () => {
        playSfx('click');
        openModal('settings');
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className={`p-2 ${className}`}
            title="Settings"
        >
            <SettingsIcon className="w-4 h-4" />
        </Button>
    );
}