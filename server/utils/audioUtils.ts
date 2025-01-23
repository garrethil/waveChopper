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
 * Reverse the audio data for all channels.
 * @param channelData - The array of raw audio data for each channel.
 * @returns Reversed audio data for all channels.
 */
export const reverseAudio = (channelData: Int16Array[]): Int16Array[] => {
  return channelData.map((channel) => {
    const float32Channel = int16ToFloat32(channel);

    // Reverse the channel
    float32Channel.reverse();

    return float32ToInt16(float32Channel);
  });
};

/**
 * Randomize the audio data for all channels in larger chunks.
 * @param channelData - The array of raw audio data for each channel.
 * @param sampleRate - The sample rate of the audio.
 * @returns Jumbled audio data for all channels.
 */
export const jumbleAudio = (
  channelData: Int16Array[],
  sampleRate: number
): Int16Array[] => {
  const chunkSize = sampleRate / 2; // Half-second chunks

  return channelData.map((channel) => {
    const float32Channel = int16ToFloat32(channel);
    const numChunks = Math.ceil(float32Channel.length / chunkSize);
    const chunks: Float32Array[] = [];

    // Split the channel into chunks
    for (let i = 0; i < numChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, float32Channel.length);
      chunks.push(float32Channel.slice(start, end));
    }

    // Shuffle the chunks using Fisher-Yates algorithm
    for (let i = chunks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
    }

    // Flatten the shuffled chunks back into a single array
    const shuffledChannel = new Float32Array(float32Channel.length);
    let offset = 0;
    for (const chunk of chunks) {
      shuffledChannel.set(chunk, offset);
      offset += chunk.length;
    }

    return float32ToInt16(shuffledChannel);
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
