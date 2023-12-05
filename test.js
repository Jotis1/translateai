const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: "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" });

async function main() {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("C:/Users/usuario/Downloads/test.mp3"),
        model: "whisper-1",
    });

    console.log(transcription.text);
}
main();