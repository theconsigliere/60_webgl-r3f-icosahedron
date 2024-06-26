import { useRef } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import * as THREE from "three"

import { NewShaderMaterial } from "./Shader"

export default function Plane() {
  const ref = useRef()
  const { viewport, size } = useThree()

  const shaderProps = useControls("Shader Props", {
    wireframe: false,
    timeMultiplier: { value: 0.1, min: 0.001, max: 1.0 },
  })

  useFrame((state, delta) => {
    ref.current.uTime += delta * 0.05
  })

  return (
    <mesh scale={[viewport.width / 2, viewport.height / 2, 1]}>
      {/*  */}
      <planeGeometry args={[1, 1, 10, 10]} />
      <newShaderMaterial
        ref={ref}
        key={NewShaderMaterial.key}
        uResolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        wireframe={shaderProps.wireframe}
        uMultiplyTime={shaderProps.timeMultiplier}
      />
    </mesh>
  )
}
