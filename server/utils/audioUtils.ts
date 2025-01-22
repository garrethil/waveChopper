import { encode } from "wav-encoder"; // Replace with your chosen encoder
import { WaveFile } from "wavefile";

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
export const manipulateAudio = (
  channelData: Float32Array[]
): Float32Array[] => {
  // Example: Reverse each channel's data
  return channelData.map((channel) => channel.reverse());
};

/**
 * Encode raw audio data back into a .wav file buffer.
 * @param audioData - The manipulated audio data.
 * @param sampleRate - The sample rate of the audio.
 * @returns The encoded .wav file buffer.
 */
export const encodeAudio = async (
  audioData: Float32Array[],
  sampleRate: number
): Promise<Buffer> => {
  try {
    const encoded = await encode({ sampleRate, channelData: audioData });
    return Buffer.from(encoded);
  } catch (error) {
    console.error("Error during encodeAudio:", error);
    throw new Error("Failed to encode audio file.");
  }
};
