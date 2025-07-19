'use client'

import { useEffect } from 'react';
import Styles from '@/styles/components/imageDetails.module.css';
import { Text } from "@mantine/core";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";

export default function ImageDetails() {
    const currentImage = useImageDetailStore(store => store.currentImage);
    const setCurrentImageId = useImageDetailStore(store => store.actions.common.setId);
    const navigate = useImageDetailStore(store => store.actions.navigate);

    useEffect(() => {
        const handlePopState = () => {
            const id = window.location.pathname.split('/').pop();
            if (id) {
                setCurrentImageId(id);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className={Styles.viewer_container}>
            <div className={Styles.photo_area}>
                {
                    currentImage ? (
                        <img
                            className={Styles.photo_img}
                            src={currentImage.url}
                            alt="사진"
                        />
                    ) : (
                        <Text>이미지를 찾을 수 없습니다.</Text>
                    )
                }

                <div className={Styles.photo_controls}>
                    <button
                        className={`${Styles.nav_btn} ${Styles.nav_prev_btn}`}
                        aria-label="이전 사진"
                        onClick={() => navigate('prev')}
                    >
                        <svg viewBox="0 0 32 32" aria-hidden="true">
                            <polyline points="20,8 12,16 20,24" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className={Styles.photo_actions}>
                    </div>
                    <button
                        className={`${Styles.nav_btn} ${Styles.nav_next_btn}`}
                        aria-label="다음 사진"
                        onClick={() => navigate('next')}
                    >
                        <svg viewBox="0 0 32 32" aria-hidden="true">
                            <polyline points="12,8 20,16 12,24" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className={Styles.photo_meta}>
                    <div className={Styles.photo_info_and_desc}>
                        <div className={Styles.profile_block}>
                            <img
                                className={Styles.avatar}
                                src="https://live.staticflickr.com/65535/52662320940_3ae921a6c3_k.jpg"
                                alt="프로필"
                            />
                            <span className={Styles.nickname}>bluewarn</span>
                        </div>
                        <span className={Styles.photo_desc}>
                            사진에 대한 간단한 설명이 여기에 들어갑니다.
                        </span>
                        <span className={Styles.like_status}>
                            <svg className={Styles.like_icon} viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span className={Styles.like_count}>123</span>
                        </span>
                    </div>
                    <div className={Styles.exif_info}>
                        <div className={Styles.exif_row}>Canon EOS R6<span>RF24-70mm F2.8</span></div>
                        <div className={Styles.exif_row}>2024-06-08 16:22</div>
                        <div className={Styles.exif_row}>37.5665°N 126.9780°E</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
