
// 图片链接改地址
export const imgUrlChangeFn = (imgUrl, oldAddress, newAddress) => {
    // if (imgUrl.startsWith(oldAddress)) {
    //     return newAddress + imgUrl.slice(oldAddress.length);
    // }
    // return imgUrl;

    const regex = new RegExp(`^${oldAddress}`);
    return imgUrl.replace(regex, newAddress);
};
// 图片链接改地址2
export const imgUrlAddFn = (imgUrl, address) => {
    return address + imgUrl;
}