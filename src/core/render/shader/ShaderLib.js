(function(){
zen3d.ShaderLib = {
basic_frag: "#include <common_frag>\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <envMap_pars_frag>\n#include <fog_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <envMap_frag>\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
basic_vert: "#include <common_vert>\n#include <uv_pars_vert>\n#include <envMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <uv_vert>\n    #include <envMap_vert>\n}",
canvas2d_frag: "#include <common_frag>\nvarying vec2 v_Uv;\nuniform sampler2D spriteTexture;\nvoid main() {\n    #include <begin_frag>\n    outColor *= texture2D(spriteTexture, v_Uv);\n    #include <end_frag>\n    #include <premultipliedAlpha_frag>\n}",
canvas2d_vert: "#include <common_vert>\nattribute vec2 a_Uv;\nvarying vec2 v_Uv;\nvoid main() {\n    #include <begin_vert>\n    #include <pvm_vert>\n    v_Uv = a_Uv;\n}",
cube_frag: "#include <common_frag>\nuniform samplerCube cubeMap;\nvarying vec3 v_ModelPos;\nvoid main() {\n    #include <begin_frag>\n    outColor *= textureCube(cubeMap, v_ModelPos);\n    #include <end_frag>\n}",
cube_vert: "#include <common_vert>\nvarying vec3 v_ModelPos;\nvoid main() {\n    #include <begin_vert>\n    #include <pvm_vert>\n    v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;\n}",
depth_frag: "#include <common_frag>\nuniform vec3 lightPos;\nvarying vec3 v_ModelPos;\n#include <packing>\nvoid main() {\n    gl_FragColor = packDepthToRGBA(length(v_ModelPos - lightPos) / 1000.);\n}",
depth_vert: "#include <common_vert>\nvarying vec3 v_ModelPos;\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    v_ModelPos = (u_Model * vec4(transformed, 1.0)).xyz;\n}",
lambert_frag: "#include <common_frag>\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <normal_frag>\n    #include <light_frag>\n    #include <envMap_frag>\n    #include <shadowMap_frag>\n    vec3 totalEmissiveRadiance = emissive;\n    #include <emissiveMap_frag>\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
lambert_vert: "#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <normal_vert>\n    #include <uv_vert>\n    #include <viewModelPos_vert>\n    #include <envMap_vert>\n    #include <shadowMap_vert>\n}",
linedashed_frag: "#include <common_frag>\n#include <fog_pars_frag>\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\nvoid main() {\n    if ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}\n    #include <begin_frag>\n    #include <end_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
linedashed_vert: "#include <common_vert>\nuniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\nvoid main() {\n    vLineDistance = scale * lineDistance;\n    vec3 transformed = vec3(a_Position);\n    #include <pvm_vert>\n}",
particle_frag: "float scaleLinear(float value, vec2 valueDomain) {\n    return (value - valueDomain.x) / (valueDomain.y - valueDomain.x);\n}\nfloat scaleLinear(float value, vec2 valueDomain, vec2 valueRange) {\n    return mix(valueRange.x, valueRange.y, scaleLinear(value, valueDomain));\n}\nvarying vec4 vColor;\nvarying float lifeLeft;\nuniform sampler2D tSprite;\nvoid main() {\n    float alpha = 0.;\n    if( lifeLeft > .995 ) {\n        alpha = scaleLinear( lifeLeft, vec2(1., .995), vec2(0., 1.));\n    } else {\n        alpha = lifeLeft * .75;\n    }\n    vec4 tex = texture2D( tSprite, gl_PointCoord );\n    gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );\n}",
particle_vert: "const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);\nconst vec4 bitMsk = vec4(0.,vec3(1./256.0));\nconst vec4 bitShifts = vec4(1.) / bitSh;\n#define FLOAT_MAX\t1.70141184e38\n#define FLOAT_MIN\t1.17549435e-38\nlowp vec4 encode_float(highp float v) {\n    highp float av = abs(v);\n    if(av < FLOAT_MIN) {\n        return vec4(0.0, 0.0, 0.0, 0.0);\n    } else if(v > FLOAT_MAX) {\n        return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;\n    } else if(v < -FLOAT_MAX) {\n        return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;\n    }\n    highp vec4 c = vec4(0,0,0,0);\n    highp float e = floor(log2(av));\n    highp float m = av * pow(2.0, -e) - 1.0;\n    c[1] = floor(128.0 * m);\n    m -= c[1] / 128.0;\n    c[2] = floor(32768.0 * m);\n    m -= c[2] / 32768.0;\n    c[3] = floor(8388608.0 * m);\n    highp float ebias = e + 127.0;\n    c[0] = floor(ebias / 2.0);\n    ebias -= c[0] * 2.0;\n    c[1] += floor(ebias) * 128.0;\n    c[0] += 128.0 * step(0.0, -v);\n    return c / 255.0;\n}\nvec4 pack(const in float depth)\n{\n    const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\n    const vec4 bit_mask\t= vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);\n    vec4 res = mod(depth*bit_shift*vec4(255), vec4(256))/vec4(255);\n    res -= res.xxyz * bit_mask;\n    return res;\n}\nfloat unpack(const in vec4 rgba_depth)\n{\n    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\n    float depth = dot(rgba_depth, bit_shift);\n    return depth;\n}\nuniform float uTime;\nuniform float uScale;\nuniform sampler2D tNoise;\nuniform mat4 u_Projection;\nuniform mat4 u_View;\nuniform mat4 u_Model;\nattribute vec4 particlePositionsStartTime;\nattribute vec4 particleVelColSizeLife;\nvarying vec4 vColor;\nvarying float lifeLeft;\nvoid main() {\n    vColor = encode_float( particleVelColSizeLife.y );\n    vec4 velTurb = encode_float( particleVelColSizeLife.x );\n    vec3 velocity = vec3( velTurb.xyz );\n    float turbulence = velTurb.w;\n    vec3 newPosition;\n    float timeElapsed = uTime - particlePositionsStartTime.a;\n    lifeLeft = 1. - (timeElapsed / particleVelColSizeLife.w);\n    gl_PointSize = ( uScale * particleVelColSizeLife.z ) * lifeLeft;\n    velocity.x = ( velocity.x - .5 ) * 3.;\n    velocity.y = ( velocity.y - .5 ) * 3.;\n    velocity.z = ( velocity.z - .5 ) * 3.;\n    newPosition = particlePositionsStartTime.xyz + ( velocity * 10. ) * ( uTime - particlePositionsStartTime.a );\n    vec3 noise = texture2D( tNoise, vec2( newPosition.x * .015 + (uTime * .05), newPosition.y * .02 + (uTime * .015) )).rgb;\n    vec3 noiseVel = ( noise.rgb - .5 ) * 30.;\n    newPosition = mix(newPosition, newPosition + vec3(noiseVel * ( turbulence * 5. ) ), (timeElapsed / particleVelColSizeLife.a) );\n    if( velocity.y > 0. && velocity.y < .05 ) {\n        lifeLeft = 0.;\n    }\n    if( velocity.x < -1.45 ) {\n        lifeLeft = 0.;\n    }\n    if( timeElapsed > 0. ) {\n        gl_Position = u_Projection * u_View * u_Model * vec4( newPosition, 1.0 );\n    } else {\n        gl_Position = u_Projection * u_View * u_Model * vec4( particlePositionsStartTime.xyz, 1.0 );\n        lifeLeft = 0.;\n        gl_PointSize = 0.;\n    }\n}",
pbr_frag: "#include <common_frag>\nuniform float u_Metalness;\nuniform float u_Roughness;\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <normal_frag>\n    #include <specularMap_frag>\n    #include <light_frag>\n    #include <shadowMap_frag>\n    vec3 totalEmissiveRadiance = emissive;\n    #include <emissiveMap_frag>\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
pbr_vert: "#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <normal_vert>\n    #include <uv_vert>\n    #include <viewModelPos_vert>\n    #include <envMap_vert>\n    #include <shadowMap_vert>\n}",
phong_frag: "#include <common_frag>\nuniform float u_Specular;\nuniform vec4 u_SpecularColor;\n#include <specularMap_pars_frag>\nuniform vec3 emissive;\n#include <uv_pars_frag>\n#include <diffuseMap_pars_frag>\n#include <normalMap_pars_frag>\n#include <bumpMap_pars_frag>\n#include <light_pars_frag>\n#include <normal_pars_frag>\n#include <viewModelPos_pars_frag>\n#include <bsdfs>\n#include <envMap_pars_frag>\n#include <shadowMap_pars_frag>\n#include <fog_pars_frag>\n#include <emissiveMap_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #include <diffuseMap_frag>\n    #include <normal_frag>\n    #include <specularMap_frag>\n    #include <light_frag>\n    #include <envMap_frag>\n    #include <shadowMap_frag>\n    vec3 totalEmissiveRadiance = emissive;\n    #include <emissiveMap_frag>\n    outColor += vec4(totalEmissiveRadiance.rgb, 0.0);\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
phong_vert: "#include <common_vert>\n#include <normal_pars_vert>\n#include <uv_pars_vert>\n#include <viewModelPos_pars_vert>\n#include <envMap_pars_vert>\n#include <shadowMap_pars_vert>\n#include <skinning_pars_vert>\nvoid main() {\n    #include <begin_vert>\n    #include <skinning_vert>\n    #include <pvm_vert>\n    #include <normal_vert>\n    #include <uv_vert>\n    #include <viewModelPos_vert>\n    #include <envMap_vert>\n    #include <shadowMap_vert>\n}",
point_frag: "#include <common_frag>\n#include <diffuseMap_pars_frag>\n#include <fog_pars_frag>\nvoid main() {\n    #include <begin_frag>\n    #ifdef USE_DIFFUSE_MAP\n        outColor *= texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));\n    #endif\n    #include <end_frag>\n    #include <encodings_frag>\n    #include <premultipliedAlpha_frag>\n    #include <fog_frag>\n}",
point_vert: "#include <common_vert>\nuniform float u_PointSize;\nuniform float u_PointScale;\nvoid main() {\n    #include <begin_vert>\n    #include <pvm_vert>\n    vec4 mvPosition = u_View * u_Model * vec4(transformed, 1.0);\n    #ifdef USE_SIZEATTENUATION\n        gl_PointSize = u_PointSize * ( u_PointScale / - mvPosition.z );\n    #else\n        gl_PointSize = u_PointSize;\n    #endif\n}",
sprite_frag: "uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\n    vec4 texture = texture2D( map, vUV );\n    if ( texture.a < alphaTest ) discard;\n    gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n    if ( fogType > 0 ) {\n        float depth = gl_FragCoord.z / gl_FragCoord.w;\n        float fogFactor = 0.0;\n        if ( fogType == 1 ) {\n            fogFactor = smoothstep( fogNear, fogFar, depth );\n        } else {\n            \n            fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n            fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n        }\n        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n    }\n}",
sprite_vert: "uniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\n    vUV = uvOffset + uv * uvScale;\n    vec2 alignedPosition = position * scale;\n    vec2 rotatedPosition;\n    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n    vec4 finalPosition;\n    finalPosition = viewMatrix * modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\n    finalPosition.xy += rotatedPosition;\n    finalPosition = projectionMatrix * finalPosition;\n    gl_Position = finalPosition;\n}",
}
})();