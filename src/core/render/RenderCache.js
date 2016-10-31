(function() {
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;

    /**
     * Render Cache
     * use this class to cache and organize objects
     */
    var RenderCache = function() {

        // render list
        this.opaqueObjects = new Array();
        this.transparentObjects = new Array();

        this.shadowObjects = new Array();

        // lights
        this.ambientLights = new Array();
        this.directLights = new Array();
        this.pointLights = new Array();
        this.spotLights = new Array();

        this.shadowLights = new Array();
    }

    var helpVector3 = new zen3d.Vector3();

    /**
     * cache object
     */
    RenderCache.prototype.cache = function(object, camera) {

        // cache all type of objects
        switch (object.type) {
            case OBJECT_TYPE.MESH:
                var material = object.material;

                var array;
                if(material.transparent) {
                    array = this.transparentObjects;
                } else {
                    array = this.opaqueObjects;
                }

                // TODO frustum test

                helpVector3.setFromMatrixPosition( object.worldMatrix );
				helpVector3.applyMatrix4( camera.viewMatrix ).applyMatrix4( camera.projectionMatrix );

                array.push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });

                if(object.castShadow) {
                    this.shadowObjects.push(object);
                }
                
                break;
            case OBJECT_TYPE.LIGHT:
                if(object.lightType == LIGHT_TYPE.AMBIENT) {
                    this.ambientLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.DIRECT) {
                    this.directLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.POINT) {
                    this.pointLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.SPOT) {
                    this.spotLights.push(object);
                }

                if(object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
                    this.shadowLights.push(object);
                }

                break;
            case OBJECT_TYPE.CAMERA:
                // do nothing
                // main camera will set by hand
                // camera put to object tree just for update position
                break;
            case OBJECT_TYPE.SCENE:
                // do nothing
                break;
            case OBJECT_TYPE.GROUP:
                // do nothing
                break;
            default:
                console.log("undefined object type")
        }

        // handle children by recursion
        var children = object.children;
		for ( var i = 0, l = children.length; i < l; i ++ ) {
			this.cache(children[i], camera);
		}
    }

    /**
     * sort render list
     */
    RenderCache.prototype.sort = function() {
        // opaque objects render from front to back
        this.opaqueObjects.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return za - zb;
        });

        // transparent objects render from back to front
        this.transparentObjects.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });
    }

    /**
     * clear
     */
    RenderCache.prototype.clear = function() {
        this.transparentObjects.length = 0;
        this.opaqueObjects.length = 0;

        this.shadowObjects.length = 0;

        this.ambientLights.length = 0;
        this.directLights.length = 0;
        this.pointLights.length = 0;
        this.spotLights.length = 0;

        this.shadowLights.length = 0;
    }

    zen3d.RenderCache = RenderCache;
})();
