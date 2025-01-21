declare module "wav-encoder" {
  export interface EncodeOptions {
    sampleRate: number; // The sample rate of the audio data
    channelData: Float32Array[]; // Array of audio channels (e.g., [left, right] for stereo)
  }

  export function encode(options: EncodeOptions): Promise<Uint8Array>; // Asynchronous encoding
}
