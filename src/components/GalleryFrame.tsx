import Image from 'next/image'

export default function GalleryFrame({
    width, height, url, title, description, tags, likes,
    className,
}: {
    width: number, height: number,
    url: string, title: string,
    description: string, tags: string[],
    likes: number,
    className?: string,
}) {
  return (
    <>
      <Image className={className} style={{
        width: '100%', objectFit: 'contain', 
      }} src={url} width={width} height={height} alt={title}/>
    </>
  )
}
