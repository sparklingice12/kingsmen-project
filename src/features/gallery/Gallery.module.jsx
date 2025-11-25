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
