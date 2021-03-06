import { Composition } from '../../Entity'
import DependencyResolver from '../DependencyResolver'
import WebGLContext from '../WebGL/WebGLContext'

export interface IRenderContextBase {
  time: number
  timeOnComposition: number

  frame: number
  frameOnComposition: number

  // Composition properties
  width: number
  height: number
  framerate: number
  durationFrames: number
  samplingRate: number
  audioChannels: number
  neededSamples: number
  isAudioBufferingNeeded: boolean
  transparentBackground: boolean

  rootComposition: Readonly<Composition>

  resolver: DependencyResolver

  // Destinations
  destCanvas: HTMLCanvasElement
  destAudioBuffer: Float32Array[]
  audioContext: OfflineAudioContext
  gl: WebGLContext
}
