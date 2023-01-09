import { StrictMode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scroll, useScroll, ScrollControls } from '@react-three/drei'
import { Leva } from 'leva'
import Experience from './Experience'

const glSettings = {
  antialias: false,
  // toneMapping: THREE.CineonToneMapping,
  // outputEncoding: THREE.sRGBEncoding,
  // alpha: true,
}

const created = (state) => {
  console.log('Canvas ready')
}

const App = () => {
  return (
    <StrictMode>
      <Leva />
      <Canvas dpr={[1, 2]} gl={glSettings} onCreated={created}>
        <ScrollControls
          damping={6}
          // pages={3}
        >
          <Experience />
          <Scroll html style={{ width: '100%' }}>
            {/* <div
              className="card"
              style={{
                position: 'absolute',
                top: `150vh`,
                left: '50vw',
                transform: 'translate(-50%, 0)',
              }}
            ></div> */}
          </Scroll>
        </ScrollControls>
      </Canvas>
    </StrictMode>
  )
}

export default App
