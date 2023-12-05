"use server";

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: "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" });


// async function Transcript({ audioURL }: { audioURL: string }) {

//     const transcription = await openai.audio.transcriptions.create({
//         file: audioURL,
//         model: "whisper-1",
//     });

//     console.log(transcription.text);
// }

export default async function TranslateFile(prevState: any, e: FormData) {
    try {



        /** 
        Transcript({ audioURL: e }); 
        */

        return {
            response: {
                ok: true,
                message: "Archivo pusheado con éxito",
                file: { name: "" || "", proccessedFile: "" }
            }
        };
    } catch (err: any) {
        console.log(err);
        return {
            response: {
                ok: false,
                message: "Ha ocurrido un error",
                file: null
            }
        };
    }
}
