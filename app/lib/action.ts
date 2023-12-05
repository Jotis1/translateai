"use server";

import { PutBlobResult, put } from "@vercel/blob";
import fetch from "node-fetch";

import OpenAI from 'openai';
import ai from "ai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function Transcript({ audioBlob }: { audioBlob: PutBlobResult }) {

    const res = await fetch(audioBlob.url);

    const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: res
    })

    var transcripted = response.text;

    if (!transcripted) throw new Error("Ha ocurrido un error en la transcripción");

    const translated = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "You will be provided with a sentence in English, and your task is to translate it into Spanish" },
            { role: "user", content: transcripted }
        ],
        temperature: 0,
        max_tokens: 256
    })

    var content = translated.choices[0].message.content;

    if (!content) throw new Error("");

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: content,
        response_format: "mp3"
    });

    return Buffer.from(await mp3.arrayBuffer());
}

export default async function TranslateFile(prevState: any, e: any) {
    try {

        const file = e.get('file');
        if (file === null) throw new Error("El archivo es null");

        const blob = await put(file.name, file, { access: 'public' });

        const mp3Buffer = await Transcript({ audioBlob: blob });

        const mp3Blob = await put('output.mp3', mp3Buffer, { access: 'public' });

        console.log(mp3Blob);

        return {
            response: {
                ok: true,
                message: "Archivo pusheado con éxito",
                file: { name: "output.mp3", url: "https://bmltirehqochqjpq.public.blob.vercel-storage.com/output-ULJmQ8YQII145MiS9OlrBWqA1eTcxb.mp3" }
            }
        };
    } catch (err: any) {
        return {
            response: {
                ok: false,
                message: err.message,
                file: null
            }
        };
    }
}
