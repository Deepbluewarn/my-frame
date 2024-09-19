export interface IGalleryFrame {
    _id: string;
    owner: string;
    url: string;
    width: number;
    height: number;
    title: string;
    description?: string;
    tags?: string[];
    uploadedAt: Date;
    likes?: number;
    comments?: {
        userId: string;
        username: string;
        text: string;
        createdAt: Date;
    }[];
    visibility: 'public' | 'follow' | 'private';
    owned: boolean;
}
