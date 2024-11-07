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
