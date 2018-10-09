import {TextureBase} from './TextureBase.js';
import {Vector2} from '../math/Vector2.js';
import {Matrix3} from '../math/Matrix3.js';
import {WEBGL_TEXTURE_TYPE, WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE, WEBGL_TEXTURE_FILTER} from '../const.js';
import {ImageLoader} from '../loader/ImageLoader.js';
import {TGALoader} from '../loader/TGALoader.js';

/**
 * Creates a cube texture made up of single image.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.TextureBase
 */
function Texture2D() {

    TextureBase.call(this);

    this.textureType = WEBGL_TEXTURE_TYPE.TEXTURE_2D;

    /**
     * Image data for this texture.
     * @member {null|HTMLImageElement|Object[]}
     * @default null
     */
    this.image = null;

    /**
     * Array of user-specified mipmaps (optional).
     * @member {HTMLImageElement[]|Object[]}
     * @default []
     */
    this.mipmaps = [];

    /**
     * How much a single repetition of the texture is offset from the beginning, in each direction U and V. 
     * Typical range is 0.0 to 1.0. 
     * _Note:_ The offset property is a convenience modifier and only affects the Texture's application to the first set of UVs on a model. 
     * If the Texture is used as a map requiring additional UV sets (e.g. the aoMap or lightMap of most stock materials), those UVs must be manually assigned to achieve the desired offset..
     * @member {zen3d.Vector2}
     * @default zen3d.Vector2(0, 0)
     */
    this.offset = new Vector2();

    /**
     * How many times the texture is repeated across the surface, in each direction U and V. 
     * If repeat is set greater than 1 in either direction, the corresponding Wrap parameter should also be set to {@link zen3d.WEBGL_TEXTURE_WRAP.REPEAT} or {@link zen3d.WEBGL_TEXTURE_WRAP.MIRRORED_REPEAT} to achieve the desired tiling effect. 
     * _Note:_ The repeat property is a convenience modifier and only affects the Texture's application to the first set of UVs on a model. 
     * If the Texture is used as a map requiring additional UV sets (e.g. the aoMap or lightMap of most stock materials), those UVs must be manually assigned to achieve the desired repetiton.
     * @member {zen3d.Vector2}
     * @default zen3d.Vector2(1, 1)
     */
    this.repeat = new Vector2(1, 1);

    /**
     * The point around which rotation occurs. 
     * A value of (0.5, 0.5) corresponds to the center of the texture. 
     * Default is (0, 0), the lower left.
     * @member {zen3d.Vector2}
     * @default zen3d.Vector2(0, 0)
     */
    this.center = new Vector2();

    
    /**
     * How much the texture is rotated around the center point, in radians. 
     * Postive values are counter-clockwise.
     * @member {number}
     * @default 0
     */
    this.rotation = 0;

    /**
     * The uv-transform matrix for the texture. Updated by the renderer from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center} when the texture's {@link zen3d.Texture2D#matrixAutoUpdate} property is true. 
     * When {@link zen3d.Texture2D#matrixAutoUpdate}  property is false, this matrix may be set manually. 
     * Default is the identity matrix.
     * @member {zen3d.Matrix3}
     * @default Matrix3()
     */
    this.matrix = new Matrix3();

    /**
     * Whether to update the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
     * Set this to false if you are specifying the uv-transform matrix directly.
     * @member {boolean}
     * @default true
     */
    this.matrixAutoUpdate = true;
}

Texture2D.prototype = Object.assign(Object.create(TextureBase.prototype), /** @lends zen3d.Texture2D.prototype */{

    constructor: Texture2D,

    copy: function(source) {
        TextureBase.prototype.copy.call(this, source);

        this.image = source.image;
        this.mipmaps = source.mipmaps.slice(0);
        
        this.offset.copy( source.offset );
		this.repeat.copy( source.repeat );
		this.center.copy( source.center );
        this.rotation = source.rotation;
        
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy( source.matrix );

        return this;
    },

    /**
     * Update the texture's uv-transform {@link zen3d.Texture2D#matrix} from the texture properties {@link zen3d.Texture2D#offset}, {@link zen3d.Texture2D#repeat}, {@link zen3d.Texture2D#rotation}, and {@link zen3d.Texture2D#center}.
     */
    updateMatrix: function() {
        this.matrix.setUvTransform( this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y );
    }

});

/**
 * Create Texture2D from image.
 * @param {HTMLImageElement} image 
 * @return {TextureCube} - The result Texture.
 */
Texture2D.fromImage = function(image) {
    var texture = new Texture2D();

    texture.image = image;
    texture.version++;

    return texture;
}

/**
 * Create Texture2D from src.
 * @param {string} src 
 * @return {TextureCube} - The result Texture.
 */
Texture2D.fromSrc = function(src) {
    var texture = new Texture2D();

    // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
    var isJPEG = src.search( /\.(jpg|jpeg)$/ ) > 0 || src.search( /^data\:image\/jpeg/ ) === 0;

    var isTGA = src.search( /\.(tga)$/ ) > 0 || src.search( /^data\:image\/tga/ ) === 0;

    var loader = isTGA ? new TGALoader() : new ImageLoader();
    loader.load(src, function(image) {
        texture.pixelFormat = isJPEG ? WEBGL_PIXEL_FORMAT.RGB : WEBGL_PIXEL_FORMAT.RGBA;
        texture.image = image;
        texture.version++;

        texture.dispatchEvent({type: 'onload'});
    });

    return texture;
}

/**
 * Creates a texture for use as a Depth Texture. 
 * Require support for the {@link https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/ WEBGL_depth_texture extension}.
 * @param {boolean} stencil
 * @return {zen3d.Texture2D}
 */
Texture2D.createDepthTexture = function(stencil) {
    var texture = new Texture2D();

    texture.image = {data: null, width: 4, height: 4};

    if (stencil) { // for DEPTH_STENCIL_ATTACHMENT
        texture.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_INT_24_8;
        texture.pixelFormat = WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
    } else { // for DEPTH_ATTACHMENT
        texture.pixelType = WEBGL_PIXEL_TYPE.UNSIGNED_SHORT; // UNSIGNED_SHORT, UNSIGNED_INT
        texture.pixelFormat = WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT;
    }

    texture.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
    texture.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

    texture.generateMipmaps = false;
    texture.flipY = false;

    return texture;
}

/**
 * Creates a texture directly from raw data, width and height.
 * @param {TypedArray} data - The data of the texture.
 * @param {number} width - The width of the texture.
 * @param {number} height - The height of the texture.
 * @return {zen3d.Texture2D}
 */
Texture2D.createDataTexture = function(data, width, height) {
    var texture = new Texture2D();

    texture.image = {data: data, width: width, height: height};

    texture.pixelType = WEBGL_PIXEL_TYPE.FLOAT;

    texture.magFilter = WEBGL_TEXTURE_FILTER.NEAREST;
    texture.minFilter = WEBGL_TEXTURE_FILTER.NEAREST;

    texture.generateMipmaps = false;
    texture.flipY = false;

    return texture;
}

export {Texture2D};