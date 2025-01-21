declare module "wav-decoder" {
  export interface DecodeResult {
    channelData: Float32Array[];
    sampleRate: number;
    bitDepth: number;
    length: number;
  }

  export namespace decode {
    function sync(buffer: Uint8Array): DecodeResult;
  }
}
