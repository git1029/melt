import { useRef, useMemo } from 'react'
import { useFrame, useThree, createPortal } from '@react-three/fiber'
import {
  OrthographicCamera,
  useFBO,
  useTexture,
  useScroll,
} from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import Trail from './Trail'
import vertexPass from './shaders/vertex'
import fragmentPass from './shaders/fragment'

// https://eriksachse.medium.com/react-three-fiber-custom-postprocessing-render-target-solution-without-using-the-effectcomposer-d3a94e6ae3c3

const Experience = () => {
  const cam = useRef()
  const mesh = useRef()
  const trailRef = useRef()
  const scroll = useScroll()

  const defaults = {
    strength: 1,
    radius: 1,
    decay: 0.5,
    noise: 1,
    colorShift: 1,
    frequency: 1,
    amplitude: 0.2,
  }

  const { strength, noise, colorShift } = useControls('mouse displacement', {
    strength: {
      value: defaults.strength,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => {
        mesh.current.material.uniforms.uDisp.value.x = v
      },
    },
    radius: {
      value: defaults.radius,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => {
        trailRef.current.material.uniforms.uInfo.value.z = v
      },
    },
    decay: {
      value: defaults.decay,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => {
        trailRef.current.material.uniforms.uInfo.value.w = v
      },
    },
    noise: {
      value: defaults.noise,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (v) => {
        mesh.current.material.uniforms.uDisp.value.y = v
      },
    },
    colorShift: {
      value: defaults.colorShift,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (v) => {
        mesh.current.material.uniforms.uDisp.value.z = v
      },
    },
  })

  const { waveEnabled, frequency, amplitude } = useControls('wave effect', {
    waveEnabled: {
      value: true,
      onChange: (v) => {
        mesh.current.material.uniforms.uWave.value.x = v
      },
    },
    frequency: {
      value: defaults.frequency,
      min: 0.5,
      max: 2,
      step: 0.1,
      onChange: (v) => {
        mesh.current.material.uniforms.uWave.value.y = v
      },
    },
    amplitude: {
      value: defaults.amplitude,
      min: 0,
      max: 0.5,
      step: 0.01,
      onChange: (v) => {
        mesh.current.material.uniforms.uWave.value.z = v
      },
    },
  })

  const { perfVisible, showMouse } = useControls('debug', {
    perfVisible: true,
    showMouse: {
      value: false,
      onChange: (v) => {
        mesh.current.material.uniforms.uShowMouse.value = v
      },
    },
  })

  const { mouse, viewport } = useThree()

  // https://github.com/pmndrs/drei#usefbo
  // https://codesandbox.io/s/devto-2-3rv9rf?file=/src/App.js:1022-1068
  // https://dev.to/eriksachse/create-your-own-post-processing-shader-with-react-three-fiber-usefbo-and-dreis-shadermaterial-with-ease-1i6d
  // Create target to render trail to to send plane as texture
  // Textures have max size of 2048x2048 in WebGL, therefore need to cap else won't render anything above this in some browsers (Firefox), plus to keep memory usage down, don't need 1-1 pixel quality for trail (tbc)
  // To do: maybe force tex to closest POT size up to 1028, 128, 256, 512, 1028, etc.
  const limit = 2048 / 2
  const width = viewport.width < limit ? viewport.width : limit
  const height = viewport.height < limit ? viewport.height : limit
  const target = useFBO(width, height, {
    multisample: true,
    stencilBuffer: false,
    depthBuffer: false,
  })

  const [logoTexture, logoTextureC] = useTexture(['melt.png', 'melt_fade.png'])

  const [scene, uniforms] = useMemo(() => {
    const scene = new THREE.Scene()
    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector4(
          viewport.width,
          viewport.height,
          logoTexture.source.data.width,
          logoTexture.source.data.height
        ),
      },
      uDisp: { value: new THREE.Vector3(strength, noise, colorShift) },
      uWave: { value: new THREE.Vector3(waveEnabled, frequency, amplitude) },
      uScene: { value: target.texture },
      uLogo: { value: logoTexture },
      uLogoC: { value: logoTextureC },
      uShowMouse: { value: showMouse },
      uTransition: { value: new THREE.Vector3() },
      PI: { value: Math.PI },
      uMouse: { value: new THREE.Vector2() },
    }

    return [scene, uniforms]
  }, [])

  // Update resolution uniform on viewport resize
  useMemo(() => {
    if (mesh.current && mesh.current.material) {
      mesh.current.material.uniforms.uResolution.value.x = viewport.width
      mesh.current.material.uniforms.uResolution.value.y = viewport.height
    }
  }, [viewport])

  const mousePrev = new THREE.Vector2()

  // On each frame
  useFrame((state, delta) => {
    if (
      (scroll.visible(0, 1 / 3) &&
        mesh.current.material.uniforms.uTransition.value.x === 0) ||
      (!scroll.visible(0, 1 / 3) &&
        mesh.current.material.uniforms.uTransition.value.x === 1)
    ) {
      mesh.current.material.uniforms.uTransition.value.x = scroll.visible(
        0,
        1 / 3
      )
        ? 1
        : 0
      mesh.current.material.uniforms.uTransition.value.y =
        state.clock.elapsedTime
    }
    mesh.current.material.uniforms.uTime.value += delta

    const dist = new THREE.Vector2(
      state.mouse.x - mousePrev.x,
      state.mouse.y - mousePrev.y
    )

    mousePrev.x += dist.x * delta // 0.015
    mousePrev.y += dist.y * delta // 0.015
    mesh.current.material.uniforms.uMouse.value = mousePrev

    state.gl.setRenderTarget(target)
    state.gl.render(scene, cam.current)
    state.gl.setRenderTarget(null)
  })

  return (
    <>
      {perfVisible ? <Perf position="top-left" /> : null}

      <OrthographicCamera
        ref={cam}
        makeDefault
        position={[0, 0, 0]}
        right={1}
        left={-1}
        bottom={-1}
        top={1}
        zoom={1}
        near={-1}
        far={1}
        manual
      />

      {/* mouse events don't fire within portal state (creates new state (?), so need to pass root state mouse values to portal) */}
      {/* https://docs.pmnd.rs/react-three-fiber/tutorials/v8-migration-guide#createportal-creates-a-state-enclave */}
      {/* https://codesandbox.io/s/kp1w5u?file=/src/App.js */}
      {createPortal(
        <Trail
          radius={defaults.radius}
          decay={defaults.decay}
          ref={trailRef}
        />,
        scene,
        {
          mouse,
        }
      )}

      <mesh ref={mesh}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={vertexPass}
          fragmentShader={fragmentPass}
          uniforms={uniforms}
        />
      </mesh>
    </>
  )
}

export default Experience
