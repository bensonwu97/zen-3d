/**
 * A loader for loading an Image.
 * @constructor
 * @memberof zen3d
 */
function ImageLoader() {
    this.crossOrigin = undefined;
    this.path = undefined;
}

Object.assign(ImageLoader.prototype, /** @lends zen3d.ImageLoader.prototype */{

    /**
     * Load the URL and pass the response to the onLoad function. 
     * @param {string} url — the path or URL to the file. This can also be a Data URI.
     * @param {Function} [onLoad=] — Will be called when loading completes. The argument will be the loaded image.
     * @param {Function} [onProgress=] — Will be called while load progresses. todo.
     * @param {Function} [onError=] — Will be called if an error occurs.
     */
    load: function(url, onLoad, onProgress, onError) {
        if (url === undefined) url = '';
        if (this.path !== undefined) url = this.path + url;

        var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

        image.addEventListener('load', function() {
            if (onLoad) onLoad(this);
        }, false);

        // image.addEventListener('progress', function(event) {
        //     if (onProgress) onProgress(event);
        // }, false);

        image.addEventListener('error', function(event) {
            if (onError) onError(event);
        }, false);

        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
        }

        image.src = url;

        return image;
    },

    /**
     * If set, assigns the crossOrigin attribute of the image to the value of crossOrigin, prior to starting the load. 
     * Default is "anonymous".
     * @param {string} value
     * @return {zen3d.ImageLoader}
     */
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
        return this;
    },

    /**
     * Set the base path or URL from which to load files. 
     * This can be useful if you are loading many images from the same directory. 
     * @param {string} value
     * @return {zen3d.ImageLoader}
     */
    setPath: function(value) {
        this.path = value;
        return this;
    }

});

export {ImageLoader};