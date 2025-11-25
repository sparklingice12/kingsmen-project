export async function fetchGalleryItems() {
  // Mock data
  return Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    title: `Gallery Item ${i + 1}`,
    url: `https://picsum.photos/seed/${i}/400/300`,
  }));
}
