import { encode } from "wav-encoder"; // Replace with your chosen encoder
import { WaveFile } from "wavefile";

/**
 * Convert Int16Array to Float32Array.
 * @param input - The Int16Array to convert.
 * @returns The converted Float32Array.
 */
const int16ToFloat32 = (input: Int16Array): Float32Array =>
  Float32Array.from(input, (val) => val / 32768);

/**
 * Convert Float32Array to Int16Array.
 * @param input - The Float32Array to convert.
 * @returns The converted Int16Array.
 */
const float32ToInt16 = (input: Float32Array): Int16Array =>
  Int16Array.from(input, (val) =>
    Math.max(-32768, Math.min(32767, val * 32768))
  );

/**
 * Decode a .wav audio file buffer into raw audio data and metadata.
 * @param buffer - The buffer of the .wav file.
 * @returns Decoded audio data and metadata.
 */
export const decodeAudio = async (buffer: Buffer) => {
  try {
    const wav = new WaveFile();
    wav.fromBuffer(buffer);

    const audioData = {
      sampleRate: (wav.fmt as any).sampleRate,
      channelData: wav.getSamples(true, Int16Array),
    };
    return audioData;
  } catch (error) {
    console.error("Error during decodeAudio:", error);
    throw new Error("Failed to decode audio file.");
  }
};

/**
 * Manipulate the audio data for all channels.
 * @param channelData - The array of raw audio data for each channel.
 * @returns Manipulated audio data for all channels.
 */
export const manipulateAudio = (channelData: Int16Array[]): Int16Array[] => {
  return channelData.map((channel) => {
    const float32Channel = int16ToFloat32(channel);

    // Example manipulation: Reverse the channel
    float32Channel.reverse();

    return float32ToInt16(float32Channel);
  });
};

/**
 * Encode raw audio data back into a .wav file buffer.
 * @param audioData - The manipulated audio data.
 * @param sampleRate - The sample rate of the audio.
 * @returns The encoded .wav file buffer.
 */
export const encodeAudio = async (
  audioData: Int16Array[],
  sampleRate: number
): Promise<Buffer> => {
  try {
    // Convert Int16Array back to Float32Array for encoding
    const float32Data = audioData.map((channel) => int16ToFloat32(channel));

    const encoded = await encode({ sampleRate, channelData: float32Data });
    return Buffer.from(encoded);
  } catch (error) {
    console.error("Error during encodeAudio:", error);
    throw new Error("Failed to encode audio file.");
  }
};
