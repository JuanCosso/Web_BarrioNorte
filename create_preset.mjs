const cloudName = "dmndohqor";
const apiKey = "375499566263844";
const apiSecret = "6MHz4OKhaIStr5je7wSWyxivUTA";

const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload_presets`, {
  method: "POST",
  headers: {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "noticias_preset",
    unsigned: true
  })
}).then(r => r.json()).then(console.log).catch(console.error);
