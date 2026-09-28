const fs = require('fs');

const flow = JSON.parse(fs.readFileSync('cosas/flows_noticias_db.json', 'utf8'));

// Find nodes to replace/rewire
const prepDbNode = flow.find(n => n.id === 'n-fn-noticia');
const postDbNode = flow.find(n => n.id === 'n-http-post-db');

if (prepDbNode && postDbNode) {
  // New prep cloudinary node
  const prepCloudinary = {
    id: "n-prep-cloudinary",
    type: "function",
    z: prepDbNode.z,
    name: "Preparar Upload Cloudinary",
    func: `
const imageUrl = msg.image_url || "";
if (!imageUrl) {
    node.warn("No hay imagen para subir a Cloudinary");
    return null;
}

// Guardamos los datos de la noticia para el proximo nodo
msg.noticia_datos = msg.datos;
msg.noticia_postUrl = msg.post_url;

msg.url = "https://api.cloudinary.com/v1_1/dmndohqor/image/upload";
msg.headers = { "Content-Type": "application/json" };
msg.payload = {
    file: imageUrl,
    upload_preset: "noticias_preset"
};
return msg;
`,
    outputs: 1,
    x: prepDbNode.x,
    y: prepDbNode.y,
    wires: [["n-req-cloudinary"]]
  };

  const reqCloudinary = {
    id: "n-req-cloudinary",
    type: "http request",
    z: prepDbNode.z,
    name: "Upload a Cloudinary",
    method: "POST",
    ret: "obj",
    url: "",
    x: prepDbNode.x + 200,
    y: prepDbNode.y,
    wires: [["n-prep-db"]]
  };

  const prepDb = {
    id: "n-prep-db",
    type: "function",
    z: prepDbNode.z,
    name: "Preparar POST a Produccion DB",
    func: `
const datos = msg.noticia_datos;
const postUrl = msg.noticia_postUrl;
const cloudinaryUrl = msg.payload.secure_url;

if (!cloudinaryUrl) {
    node.error("Fallo la subida a Cloudinary: " + JSON.stringify(msg.payload));
    return null;
}

msg.payload = {
    title: datos.titulo,
    summary: datos.resumen,
    category: datos.categoria || "Fútbol",
    tags: Array.isArray(datos.tags) ? datos.tags : ["Norteños"],
    imageUrl: cloudinaryUrl, 
    source: "Instagram",
    sourceUrl: postUrl
};

// URL de produccion en Netlify
msg.url = "https://clubbarrionorte.netlify.app/api/admin/noticias";
msg.headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic Z2FsZ286MjVkZU1heW8xMjIz" // galgo:25deMayo1223
};

node.log("✅ Enviando noticia a la DB en PROD: " + datos.titulo);
return msg;
`,
    outputs: 1,
    x: prepDbNode.x + 400,
    y: prepDbNode.y,
    wires: [["n-http-post-db"]]
  };

  // Rewire the node that originally pointed to prepDbNode
  const routerNode = flow.find(n => n.wires && n.wires.some(w => w.includes('n-fn-noticia')));
  if (routerNode) {
    routerNode.wires = routerNode.wires.map(w => w.map(id => id === 'n-fn-noticia' ? 'n-prep-cloudinary' : id));
  }

  // Update postDb position to make space
  postDbNode.x = prepDb.x + 250;

  // Add new nodes, remove old prepDbNode
  const newFlow = flow.filter(n => n.id !== 'n-fn-noticia');
  newFlow.push(prepCloudinary, reqCloudinary, prepDb);

  fs.writeFileSync('cosas/flows_produccion.json', JSON.stringify(newFlow, null, 4), 'utf8');
  console.log("Created cosas/flows_produccion.json");
} else {
  console.log("Could not find nodes");
}
