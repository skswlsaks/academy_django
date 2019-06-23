export const parseError = data => {
    const key = Object.keys(data)[0];
    return data[key];
}