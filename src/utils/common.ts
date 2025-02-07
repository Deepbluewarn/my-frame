export function listFormat(list: string[], head_length: number = 4) {
    const head = list.slice(0, head_length);
    const formatter = new Intl.ListFormat(
        'ko', { style: 'long', type: 'conjunction' }
    );

    let formattedNames = formatter.format(head);
    const tailLength = list.length - head.length;

    if (tailLength > 0) {
        formattedNames += `외 ${tailLength}명`
    }

    return formattedNames;
}

export function resizeWithRatio(w: number, h: number, maxWidth: number = 500) {
    if (w <= maxWidth) {
        return [w, h];
    } else {
        const r = w / maxWidth
        return [w / r, h / r]
    }
}

export async function fetchWithType<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json() as T;
}

export function updateHistory(url: string) {
    window.history.pushState(null, '', url);
}