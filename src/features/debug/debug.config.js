import content from '@/data/content.json';
import { GALLERY_CONFIG } from '@/features/gallery/gallery.config';
import { detailViewerConfig } from '@/features/detail-viewer/detail-viewer.config';

export const DEBUG_DEFAULTS = {
  flow: {
    detailItemId: content.data.items[0]?.id ?? '',
  },
  layout: {
    backgroundTransitionDuration: 1,
  },
  gallery: {
    scrollAmount: GALLERY_CONFIG.scrollAmount,
    animation: {
      delayChildren: 0.1,
      staggerChildren: 0.03,
      itemFadeDuration: 0.3,
      exitDuration: 0.3,
      exitYOffset: -20,
    },
    mask: {
      enabled: GALLERY_CONFIG.enableMask,
      fadeStrength: 1,
      leftFadeWidth: 10,
      rightFadeWidth: 10,
    },
  },
  detail: {
    animation: {
      type: detailViewerConfig.animation.type,
      damping: detailViewerConfig.animation.damping,
      stiffness: detailViewerConfig.animation.stiffness,
    },
  },
  language: {
    screenDuration: 0.8,
    exitScale: 1.1,
    exitBlur: 10,
    logoInitialScale: 0.8,
    logoDuration: 1,
  },
  inactivity: {
    timeout: 60000,
    warningTime: 29000,
    overlayInitialScale: 0.9,
    overlayExitScale: 0.9,
    panelOffsetY: 24,
    animationDuration: 0.3,
  },
};
