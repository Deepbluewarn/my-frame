import sizeOf from 'image-size';

export function readFile(file: File) {
    return new Promise<string>((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result as string)
        };
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

export function hashFile(file: File): string {
    const { name, size, type } = file;
    return `${name}-${size}-${type}`;
}

/**
 * 파일 크기를 읽기 쉬운 단위로 변환하는 함수
 * @param {number} bytes - 파일 크기 (바이트 단위)
 * @param {number} decimals - 소수점 이하 자릿수 (기본값: 2)
 * @returns {string} 읽기 쉬운 단위로 변환된 파일 크기
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getImageDimensions(file: File): Promise<{ width: number, height: number }> {
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const dimensions = sizeOf(uint8Array);

    return {
        width: dimensions.width || 0,
        height: dimensions.height || 0
    }
}
