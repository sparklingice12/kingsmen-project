/src
  /app
    App.jsx
    Routes.jsx
    Providers.jsx
  /features
    /gallery
      GalleryModule.jsx         # container/view
      useGallery.js             # feature hook
      galleryService.js         # data adapter
      galleryConfig.js          # defaults
      index.js
  /components
    /ui                         # primitives
      Button.jsx
      Card.jsx
      Icon.jsx
    /shared                     # reusable composites
      Carousel.jsx
      Modal.jsx
      StatTile.jsx
  /hooks
    useFetch.js
    useInterval.js
    useDevice.js
    usePrefersReducedMotion.js
  /state
    store.js                    # Zustand slices
  /services
    api.js                      # fetch wrapper
    telemetry.js                # analytics adapter
    devices.js                  # sensor/device I/O
  /styles
    tokens.css                  # CSS vars
    globals.css
  /three                        # 3D building blocks (R3F)
    Scene.jsx
    materials.js
    useSpring3d.js
  /utils
    cx.js
    clamp.js
    math.js
main.jsx