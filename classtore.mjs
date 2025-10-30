class Album {
    constructor(newValue) {
        this.max = newValue.max;
        this.photos = [];
    }

    appendToPhotos(image) {
        // images added to beginning of array
        this.photos.unshift(image);
    }

    getMax() {
        return this.max;
    }
    getPhotos() {
        return this.photos;
    }
}

class Image {
    constructor(newValue) {
        this.image = newValue.image
    }
}

export { Album, Image };