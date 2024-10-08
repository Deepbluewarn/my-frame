import { Visibility } from "@/db/models/Image";

export interface ImageInterface {
    originalFileName: string,
    objectURL: string; // 이미지 파일의 URL (URL.createObjectURL()로 생성)
    key: string; // 파일을 찾을 때 사용하는 속성
    name: string; // 사용자가 지정한 파일의 이름
    tags: Set<string>; // 사용자가 입력한 태그 목록
    description: string;
    visibility: Visibility;
    size: string; // 파일 크기 (읽기 쉬운 단위로 변환)
}

export interface MetaFileInterface extends ImageInterface {
    fileObject: File; // 실제 파일 객체
    width: number;
    height: number;
}
