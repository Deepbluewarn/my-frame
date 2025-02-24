import Image from 'next/image'
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import Styles from '@/styles/components/Gallery.module.css';
import { Avatar, Box, Flex, Text } from '@mantine/core';
import { IGallery } from './Gallery';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { resizeWithRatio } from '@/utils/common';
import { actionAddImageStar, actionRemoveImageStar } from '@/actions/image';
import { useUserInfoStore } from '@/providers/userid-store-provider';

export default function GalleryFrame({
  gallery, imageStyle,
  className, overlay, link,
  resize = false,
}: {
  gallery: IGallery, imageStyle?: CSSProperties,
  className?: string, overlay: boolean, link: boolean,
  resize?: boolean,
}) {
  const _id = useUserInfoStore(store => store._id);
  const resized = resizeWithRatio(gallery.width, gallery.height);
  const [star, setStar] = useState<boolean>(false);

  useEffect(() => {
    setStar(gallery.likes?.some(likerId => likerId === _id) || false);
  }, [_id])

  const onStarClicked = useCallback(async () => {
    let res;

    try {
      if (typeof star !== 'undefined' && star) {
        res = await actionRemoveImageStar(gallery._id);
      } else {
        res = await actionAddImageStar(gallery._id);
      }

      if (res) {
        setStar(res.star);
      }
    } catch (e) {
      alert((e as Error).message);
    }

  }, [star])

  const image = (
    <img
      src={gallery.url}
      alt={gallery.title}
      width={resize ? resized[0] : gallery.width}
      height={resize ? resized[1] : gallery.height}
      style={imageStyle}
      className={className}
    />
  )

  const overlayComponent = (
    <>
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
    </>
  )

  return (
    <>
      <Box
        style={{ '--w': resized[0], '--h': resized[1], width: '100%' }}
        className={Styles.image_wrapper}
      >
        {
          overlay ? (
            overlayComponent
          ) : null
        }

        {
          link ? (
            <Link href={link ? `/image/${gallery._id}` : '#'} >
              {image}
            </Link>
          ) : image
        }

      </Box>
    </>
  )
}
