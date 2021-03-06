import {RenderTargetBase} from './RenderTargetBase.js';
import {Texture2D} from '../texture/Texture2D.js';
import {ATTACHMENT} from '../const.js';

/**
 * Render Target that render to 2d texture.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.RenderTargetBase
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTarget2D(width, height) {

    RenderTargetBase.call(this, width, height);

    this._textures = {};

    /**
     * The texture attached to COLOR_ATTACHMENT0.
     * @type {zen3d.Texture2D}
     * @default Texture2D()
     */
    this.texture = new Texture2D();

}

RenderTarget2D.prototype = Object.assign(Object.create(RenderTargetBase.prototype), /** @lends zen3d.RenderTarget2D.prototype */{

    constructor: RenderTarget2D,

    /**
     * Attach a texture(RTT) to the framebuffer.
     * Notice: For now, dynamic Attachment during rendering is not supported.
     * @param  {zen3d.Texture2D} texture
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
    attach: function(texture, attachment) {
        if (texture.image && texture.image.rtt) {
            if (texture.image.width !== this.width || texture.image.height !== this.height) {
                texture.version++;
                texture.image.width = this.width;
                texture.image.height = this.height;
            }
        } else {
            texture.version++;
            texture.image = {rtt: true, data: null, width: this.width, height: this.height};
        }
        this._textures[attachment || ATTACHMENT.COLOR_ATTACHMENT0] = texture;
    },

    /**
     * Detach a texture.
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
    detach: function(attachment) {
        delete this._textures[attachment || ATTACHMENT.COLOR_ATTACHMENT0];
    },

    /**
     * @override   
     */
    resize: function(width, height) {

        var changed = RenderTargetBase.prototype.resize.call(this, width, height);

        if (changed) {
            for (var attachment in this._textures) {
                var texture = this._textures[attachment];
    
                if (texture) {
                    texture.image = {rtt: true, data: null, width: this.width, height: this.height};
                    texture.version++;
                }
            }
        }

        return changed;

    },

});

Object.defineProperties(RenderTarget2D.prototype, {

    texture: {

        set: function(texture) {
            if (texture) {
                this.attach(texture, ATTACHMENT.COLOR_ATTACHMENT0);
            } else {
                this.detach(ATTACHMENT.COLOR_ATTACHMENT0);
            }
        },

        get: function() {
            return this._textures[ATTACHMENT.COLOR_ATTACHMENT0];
        }

    }

});

export {RenderTarget2D};