const firebaseConfig = {
  apiKey: "AIzaSyDHbydGJAa1hb5S0w2zvqwM0Y6Y4AKspCQ",
  authDomain: "caos-rpg.firebaseapp.com",
  databaseURL: "https://caos-rpg-default-rtdb.firebaseio.com",
  projectId: "caos-rpg",
  storageBucket: "caos-rpg.firebasestorage.app",
  messagingSenderId: "1056651562841",
  appId: "1:1056651562841:web:c37def09772c89e797c648"
};

let firebaseOk = false;
try {
  firebase.initializeApp(firebaseConfig);
  firebaseOk = true;
} catch(e) {
  console.warn("Firebase indisponível — rodando no modo local:", e);
}

function criarNovaMesa(nomeMesa) {
  const idMesa = "MESA-" + Math.floor(1000 + Math.random() * 9000);
  const dadosMesa = { nome: nomeMesa, criadoEm: Date.now() };
  return firebase.database().ref(`mesas/${idMesa}`).set(dadosMesa).then(() => idMesa);
}

function conectarJogadorMesa(idMesa, dadosPersonagem) {
  if (!idMesa || !dadosPersonagem || !dadosPersonagem.id) {
    return Promise.reject(new Error("idMesa e dadosPersonagem.id são obrigatórios."));
  }
  return firebase.database().ref(`mesas/${idMesa}/jogadores/${dadosPersonagem.id}`).set(dadosPersonagem);
}

function escutarJogadoresDaMesa(idMesa, callback) {
  if (!idMesa) throw new Error("idMesa é obrigatório.");
  const referencia = firebase.database().ref(`mesas/${idMesa}/jogadores`);
  referencia.on("value", snapshot => callback(snapshot.val()), erro => console.error("Erro Firebase:", erro));
  return () => referencia.off("value");
}