import Image from "next/image";

export function GalleryStrip({ images }: { images: { id: string; url: string }[] }) {
  if (images.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Galerija</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {images.map((image) => (
          <a
            key={image.id}
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-secondary"
          >
            <Image src={image.url} alt="" fill className="object-cover" unoptimized />
          </a>
        ))}
      </div>
    </div>
  );
}
