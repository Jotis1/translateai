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
