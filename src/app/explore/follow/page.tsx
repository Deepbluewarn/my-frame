'use client'

import { actionGetFollowerListWithImages } from '@/actions/image';
import { Avatar, Button, Group, Stack, Text } from '@mantine/core';
import GalleryComponent, { IGallery } from '@/components/Gallery';
import { IFollowerListWithImage } from '@/services/Image';
import { Fragment, useEffect, useState } from 'react';
import Styles from '@/styles/home.module.css'

export default function ExploreFollowerImages() {
  const [fImages, setFImages] = useState<IFollowerListWithImage[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const asyncFn = async () => {
      const initialImages = await actionGetFollowerListWithImages(1);

      setFImages(initialImages);
    }
    asyncFn();
  }, [])

  const loadMore = async () => {
    const images = await actionGetFollowerListWithImages(page + 1);

    setFImages(fImages => [...fImages, ...images])
    setPage(page => page + 1);
  }

  const comp = fImages.map(fList => {
    const gallaryImages: IGallery[] = fList.followerImages.map(img => {
      return {
        _id: img._id,
        url: img.url,
        title: img.title,
        width: img.width,
        height: img.height,
        likes: img.likes,
        ownerDetails: fList.ownerDetails,
      }
    })

    if (!gallaryImages || gallaryImages.length <= 0) {
      return null;
    }
    return (
      <Fragment key={fList.ownerDetails._id}>
        <Group>
          <Avatar src={fList.ownerDetails.profilePicture} alt={fList.ownerDetails.username} />
          <Text>{fList.ownerDetails.username}</Text>
        </Group>
        <GalleryComponent images={gallaryImages} />
      </Fragment>
    )
  })

  // 팔로우한 유저는 있는데 이미지가 하나도 없으면 "표시할 항목이 없습니다. 새로운 사진을 올려보세요!"
  // 만약 팔로우한 유저가 없으면 "친구가 없습니다. 새로운 친구를 팔로우 해보세요!"

  return (
    <Stack className={Styles.content}>
      <Text fw={700} size="xl">팔로우</Text>
      
      {
        comp.length > 0 ? (
          <>
            <Text c={'dimmed'}>팔로우한 유저의 사진입니다.</Text>
            {comp}
            <Button onClick={loadMore}>더 보기</Button>
          </>
        ) : (
          <Text c={'dimmed'}>친구가 없습니다. 새로운 친구를 팔로우 해보세요!</Text>
        )
      }
    </Stack>
  )
}
