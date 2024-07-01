import { useRef } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { useControls } from "leva"
import * as THREE from "three"

import { NewShaderMaterial } from "./Shader"

export default function Icosahedron() {
  const ref = useRef()
  const ico = useRef()
  const { viewport, size } = useThree()

  const shaderProps = useControls("Shader Props", {
    wireframe: false,
    timeMultiplier: { value: 0.1, min: 0.001, max: 1.0 },
    rotation: { value: 0.1, min: 0.1, max: 10.0 },
  })

  useFrame((state, delta) => {
    ref.current.uTime += delta * 0.05
    ico.current.rotation.y += 0.05 * delta * shaderProps.rotation
    ico.current.rotation.x += 0.05 * delta * shaderProps.rotation
  })

  const texture = () => {
    const t = useTexture("/images/2.jpg")
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    return t
  }

  return (
    <mesh
      scale={[viewport.height / 3, viewport.height / 3, viewport.height / 3]}
      ref={ico}
    >
      {/*  */}
      <icosahedronGeometry args={[1, 1]} />
      <newShaderMaterial
        ref={ref}
        key={NewShaderMaterial.key}
        uResolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        wireframe={shaderProps.wireframe}
        uMultiplyTime={shaderProps.timeMultiplier}
        uTexture={texture()}
      />
    </mesh>
  )
}
