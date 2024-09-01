export interface ImageInterface {
    objectURL: string; // 이미지 파일의 URL (URL.createObjectURL()로 생성)
    key: string; // 파일을 찾을 때 사용하는 속성
    name: string; // 사용자가 지정한 파일의 이름
    tags: Set<string>; // 사용자가 입력한 태그 목록
    size: string; // 파일 크기 (읽기 쉬운 단위로 변환)
}
