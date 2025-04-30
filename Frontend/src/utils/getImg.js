function getImgUrl (name) {
    return new URL(`../assets/furniture/${name}`, import.meta.url)
}

export {getImgUrl}