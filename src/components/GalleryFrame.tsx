import Image from 'next/image'
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import Styles from '@/styles/components/Gallery.module.css';
import { Avatar, Box, Flex, Text } from '@mantine/core';
import { IGallery } from './Gallery';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { resizeWithRatio } from '@/utils/common';
import { actionAddImageStar, actionHasUserLikedImage, actionRemoveImageStar } from '@/actions/image';

export default function GalleryFrame({
  gallery,
  imageStyle,
  className,
  overlay, link,
  resize = false,
}: {
  gallery: IGallery,
  imageStyle?: CSSProperties,
  className?: string,
  overlay: boolean,
  link: boolean,
  resize?: boolean,
}) {
  const resized = resizeWithRatio(gallery.width, gallery.height);
  const [star, setStar] = useState<boolean>(false);

  useEffect(() => {
    const asyncFn = async() => {
      const star = await actionHasUserLikedImage(gallery._id);
      if (typeof star === 'undefined') {
        return;
      }
      setStar(star)
    }
    asyncFn();
  }, [])

  const onStarClicked = useCallback(async () => {
    let res;

    if (typeof star !== 'undefined' && star) {
      res = await actionRemoveImageStar(gallery._id);
    } else {
      res = await actionAddImageStar(gallery._id);
    }

    if (res) {
      setStar(res.star);
    }
  }, [star])

  return (
    <>
      <Box
        style={{ '--w': resized[0], '--h': resized[1], width: '100%' }}
        className={Styles.image_wrapper}
      >
        <Box className={`${Styles.overlay_top} ${Styles.overlay}`}>
          <Flex gap={8} p={10} align='center'>
            <Avatar
              size="sm"
              src={gallery.ownerDetails.profilePicture}
              alt={gallery.ownerDetails.username}
              radius="xl"
            />
            <Link href={`/user/${gallery.ownerDetails._id}`}>
              <Text fw={500} size="sm">{gallery.ownerDetails.username}</Text>
            </Link>
          </Flex>
        </Box>
        <Box className={`${Styles.overlay_bottom} ${Styles.overlay}`}>
          <Flex p={10}>
            <Text
              fw={500}
              size="sm"
              className={Styles.overlay_title}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {gallery.title}
            </Text>
            {
              star ? (
                <IconStarFilled className={Styles.star} onClick={onStarClicked} />
              ) : (
                <IconStar className={Styles.star} onClick={onStarClicked} />
              )
            }
          </Flex>
        </Box>
        <Link href={link ? `/image/${gallery._id}` : '#'} >
          <Image
            src={gallery.url}
            alt={gallery.title}
            width={resize ? resized[0] : gallery.width}
            height={resize ? resized[1] : gallery.height}
            style={imageStyle}
            className={className}
            placeholder='blur'
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg=="
          />
        </Link>
      </Box>
    </>
  )
}
