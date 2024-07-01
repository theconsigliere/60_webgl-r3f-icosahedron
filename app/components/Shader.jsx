import * as THREE from "three"
import { extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { noise } from "./shaders/noise"

// remove json formating from noise

// https://www.youtube.com/watch?v=dyvhB6UVxwE&t=1200s

const NewShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    side: THREE.DoubleSide,
    uPointer: new THREE.Vector2(),
    uTexture: null,
  },
  // THREE.doubleSide renders both sides of the Ico

  /*vertex*/ `   
      uniform float uTime;  
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 eyeVector;
   
     void main() {
        //Position
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        // Final position
        gl_Position = projectionMatrix * viewMatrix * modelPosition;

        //Varyings
        vUv = uv;
        // update normals on movement of the object
        vNormal = normalize(normalMatrix * normal);
        // the vector from the vertex to the camera
        eyeVector = normalize(modelPosition.xyz - cameraPosition);
     }

      `,
  /*fragment*/ `
      uniform sampler2D uTexture;
      uniform vec2 uResolution;
      varying vec2 vUv;  
      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 eyeVector;

      vec2 hash2( vec2 p ) {
        p = fract(p*vec2(5.3983,5.4427));
        p += dot(p.yx,p.xy+vec2(21.5351,14.3137));
        return fract(vec2(p.x*p.y* 95.4337, p.x * p.y * 97.597));
      }

      void main() {

        // flatten normals to get flat shading
        vec3 x = dFdx(vNormal);
        vec3 y = dFdy(vNormal);
        vec3 normal = normalize(cross(x, y));
        
        // Diffuse lighting
        float diffuse = dot(normal, vec3(1.));
        // offset the uv randomly so each image on each face is different
        vec2 rand = hash2(vec2(floor(diffuse*10.)));


        // randomize the uv and stop it going below 0
        rand = vec2(
          sign(rand.x - 0.5)*1. + (rand.x - 0.5)*0.6, 
          sign(rand.y - 0.5)*1. + (rand.y - 0.5)*0.6
          );

        // create new uv (flatten image not affected by movement of ico)
        vec2 uv = rand * gl_FragCoord.xy / uResolution.xy;

        // get refraction
        vec3 refracted = refract(eyeVector, normal, 1./3.);
        // distort the uv with the refraction
        uv += refracted.xy * 0.2;




        vec4 textureColor = texture2D(uTexture, uv);
  
        gl_FragColor = textureColor;

       // gl_FragColor = vec4(diffuse);
      }`
)

extend({ NewShaderMaterial })

export { NewShaderMaterial }
