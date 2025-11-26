import { useState, useEffect } from 'react';
import { fetchGalleryItems } from './gallery.service';
import { GALLERY_CONFIG } from './gallery.config';

export function useGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
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
