import Image from 'next/image'

export default function GalleryFrame({
    width, height, url, title, description, tags, likes,
}: {
    width: number, height: number,
    url: string, title: string,
    description: string, tags: string[],
    likes: number,
}) {
  return (
    <>
      <Image style={{
        width: '100%', maxHeight: 'inherit', objectFit: 'contain', padding: '32px 8px'
      }} src={url} width={width} height={height} alt={title}/>
    </>
  )
}
