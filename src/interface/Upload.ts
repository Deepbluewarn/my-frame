export interface ImageInterface {
    object: File;
    key: string; // 파일을 찾을 때 사용하는 속성
    name: string; // 사용자가 지정한 파일의 이름
    tags: Set<string>; // 사용자가 입력한 태그 목록
    url: Promise<string>; // base64로 인코딩된 이미지 파일
}
