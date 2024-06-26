import * as THREE from "three"
import { extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { noise } from "./shaders/noise"

// remove json formating from noise

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const NewShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    side: THREE.DoubleSide,
    uPointer: new THREE.Vector2(),
    uTexture: null,
  },
  // THREE.doubleSide renders both sides of the plane

  /*vertex*/ `   
      uniform float uTime;  
      varying vec2 vUv;
      varying vec3 vNormal;
   
     void main() {
        //Position
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        // Final position
        gl_Position = projectionMatrix * viewMatrix * modelPosition;

        //Varyings
        vUv = uv;
        // update normals on movement of the object
        vNormal = normalize(normalMatrix * normal);
      }

      `,
  /*fragment*/ `
      uniform sampler2D uTexture;
      uniform vec2 uResolution;
      varying vec2 vUv;  
      varying vec3 vColor;
      varying vec3 vNormal;

      void main() {

        // create new uv (flatten image not affected by movement of ico)
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        // flatten normals to get flat shading
        vec3 x = dFdx(vNormal);
        vec3 y = dFdy(vNormal);
        vec3 normal = normalize(cross(x, y));

        // Diffuse lighting
        float diffuse = dot(normal, vec3(1.));

        vec4 textureColor = texture2D(uTexture, uv);
  
        gl_FragColor = textureColor;
       // gl_FragColor = vec4(diffuse);
      }`
)

extend({ NewShaderMaterial })

export { NewShaderMaterial }
