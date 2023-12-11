/**
 * @author Jotis
 * This is a Server Action. Server Actions run on the server, instead of in the browser, and can be called from both the client and the server.
 * We use "use server" to tell the compiler that this file is a Server Action.
 * In this file we define logic for handling requests and authenticating users.
 */
'use server';
/**
 * We import the `PrevStateProps` type from the `types.ts` file.
 * This type is used to define the shape of the `prevState` object.
 * The `prevState` object contains the previous state of the form response.
 * It is passed to the Server Action as the first argument.
 * The `prevState` object is used to store the state of the form response between requests.
 * It is useful for storing data that you want to access between requests.
 * @example You can use it to store the URL of a file that you have uploaded to the server.
 */
import { PrevStateProps } from '@/app/types';
/**
 * We import the `put` function from the `@vercel/blob` package.
 * This function is used to upload files to the server as Blobs.
 * @example You can use it to upload files to the server.
 */
import { PutBlobResult, put } from '@vercel/blob';
/**
 * We import the `fetch` function from the `node-fetch` package.
 * This function is used to make HTTP requests to external APIs.
 * @example You can use it to make HTTP requests to external APIs.
 */
import fetch from 'node-fetch';
/**
 * We import the `OpenAI` class from the `openai` package.
 * This class is used to make requests to the OpenAI API.
 * @example You can use it to make requests to the OpenAI API.
 */
import OpenAI from 'openai';
/**
 * We create a new instance of the `OpenAI` class.
 * We pass the OpenAI API key to the constructor.
 * The OpenAI API key is stored in the `OPENAI_API_KEY` environment variable.
 * @argument apiKey The OpenAI API key. Is stored in the `OPENAI_API_KEY` environment variable.
 */
const openai: OpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
/**
 * This function is used to fetch the audio blob from the server.
 * @param url The URL of the audio blob.
 * @returns The audio blob.
 */
async function fetchAudioBlob(url: string): Promise<any> {
  try {
    const res = await fetch(url);
    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
/**
 * This function is used to create a transcription of the audio blob.
 * @param audioBlob The audio blob.
 * @returns The transcription of the audio blob.
 */
async function createTranscription(audioBlob: PutBlobResult): Promise<string> {
  try {
    const res = await fetchAudioBlob(audioBlob.url);
    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: res
    });
    var transcripted: string = response.text;
    if (!transcripted)
      throw new Error('Ha ocurrido un error en la transcripción');
    return transcripted;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
/**
 * This function is used to create a translation of the transcription.
 * @param transcripted The transcription of the audio blob.
 * @returns The translation of the transcription.
 */
async function createTranslation(transcripted: string): Promise<string> {
  try {
    const translated = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You will be provided with a sentence in English, and your task is to translate it into Spanish'
        },
        { role: 'user', content: transcripted }
      ],
      temperature: 0,
      max_tokens: 256
    });
    var content = translated.choices[0].message.content;
    if (!content) throw new Error('');
    return content;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
/**
 * This function is used to create a speech of the translation.
 * @param content The translation of the transcription.
 * @returns The speech of the translation.
 */
async function createSpeech(content: string): Promise<any> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'onyx',
      input: content,
      response_format: 'mp3'
    });

    return Buffer.from(await mp3.arrayBuffer());
  } catch (err: any) {
    throw new Error(err.message);
  }
}
/**
 * This function is used to translate the audio blob.
 * @param audioBlob The audio blob.
 * @returns The mp3 buffer.
 */
async function TranslateBuffer({ audioBlob }: { audioBlob: PutBlobResult }) {
  try {
    const transcripted = await createTranscription(audioBlob);
    const translated = await createTranslation(transcripted);
    const mp3Buffer = await createSpeech(translated);

    return mp3Buffer;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
/**
 * This function is used to translate the audio blob.
 * @param prevState
 * @param formEvent
 * @returns The form response.
 */
export default async function TranslateFile(
  prevState: PrevStateProps,
  formEvent: any
): Promise<PrevStateProps> {
  try {
    /**
     * We get the file from the form event.
     */
    const file = formEvent.get('file');
    /**
     * We check if the file is null.
     */
    if (file === null) throw new Error('El archivo es null');
    /**
     * We upload the file to the server.
     */
    const blob = await put(file.name, file, { access: 'public' });
    /**
     * We translate the file.
     */
    const mp3Buffer = await TranslateBuffer({ audioBlob: blob });
    /**
     * We upload the translated file to the server.
     */
    const mp3Blob = await put('translateIA-output.mp3', mp3Buffer, {
      access: 'public'
    });
    /**
     * We return the form response.
     */
    return {
      response: {
        ok: true,
        message: 'Archivo pusheado con éxito',
        file: { name: 'translateIA-output.mp3', url: mp3Blob.url }
      }
    };
  } catch (err: any) {
    /**
     * We return the form response.
     */
    return {
      response: {
        ok: false,
        message: err.message,
        file: null
      }
    };
  }
}
/**
 * This function is used to authenticate the user.
 * @param prevState
 * @param formEvent
 * @returns The authentication response.
 */
export async function AuthUser(
  prevState: any,
  formEvent: any
): Promise<boolean> {
  try {
    /**
     * We get the name and password from the form event.
     */
    const name = formEvent.get('name');
    const password = formEvent.get('password');
    /**
     * We check if the name and password are correct and return the authentication response.
     */
    if (
      name !== process.env.USER_NAME ||
      password !== process.env.USER_PASSWORD
    ) {
      return false;
    } else {
      return true;
    }
  } catch (error: any) {
    /**
     * We return the error message.
     */
    return error.message;
  }
}
