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
    const { name, size, type, lastModified } = file;
    return `${name}-${size}-${type}-${lastModified}`;
}
