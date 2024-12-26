import Image from 'next/image'
import { CSSProperties, useState } from 'react';
import Styles from '@/styles/components/Gallery.module.css';
import { Avatar, Box, Flex, Text } from '@mantine/core';
import { IGallery } from './Gallery';
import { IconStar } from '@tabler/icons-react';
import Link from 'next/link';

export default function GalleryFrame({
  gallery,
  imageStyle,
  className,
  overlay, link,
}: {
  gallery: IGallery,
  imageStyle?: CSSProperties,
  className?: string,
  overlay: boolean,
  link: boolean,
}) {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const onMouseEnterHandler = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (overlay) {
      setOverlayVisible(true);
    }
  };

  const onMouseLeaveHandler = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (overlay) {
      setOverlayVisible(false);
    }
  };
  const overlayContent = (
    <>
      <Box className={`${Styles.overlay} ${overlayVisible ? Styles.visible : ''}`}>                        <Flex className={Styles.overlay_foot}>
        <Flex direction='column' gap={8} className={Styles.overlay_foot_left}>
          <Text className={Styles.overlay_title}>{gallery.title}</Text>
          <Flex gap={8}>
            <Avatar
              size="sm"
              src={gallery.ownerDetails.profilePicture}
              alt={gallery.ownerDetails.username}
              radius="xl"
            />
            <Text>{gallery.ownerDetails.username}</Text>
          </Flex>
        </Flex>
        <IconStar className={Styles.star} />
      </Flex>
      </Box>
      <Image
        src={gallery.url}
        alt={gallery.title}
        width={gallery.width}
        height={gallery.height}
        style={imageStyle}
        className={className}
      />
    </>
  )
  return (
    <Box
      style={{ '--w': gallery.width, '--h': gallery.height, width: '100%' }}
      className={Styles.image_wrapper}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onTouchStart={onMouseEnterHandler}
      onTouchEnd={onMouseLeaveHandler}
    >
      {
        link ? (
          <Link href={link ? `/image/${gallery._id}` : '#'}>
            {overlayContent}
          </Link>
        ) : overlayContent
      }

    </Box>
  )
}
