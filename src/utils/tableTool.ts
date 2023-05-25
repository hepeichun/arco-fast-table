export default (options: { label: string; value: string }[], value: any[] | any, separator = ' | ') => {
    // 处理options
    const tmpOptions: { [gender: string]: any } = {}
    for (let i = 0; i < options.length; i += 1) {
        tmpOptions[options[i].value] = options[i].label
    }

    if (value instanceof Array) {
        const res: string[] = []
        for (let i = 0; i < value.length; i += 1) {
            if (tmpOptions[value[i]] === undefined) {
                res.push(value[i])
            } else {
                res.push(tmpOptions[value[i]])
            }
        }
        return res.join(separator)
    }

    if (tmpOptions[value] === undefined) {
        return value
    }
    return tmpOptions[value]
}
