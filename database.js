// Importar Firebase y Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, onValue, get, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuración Firebase (reemplaza con la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyAqOZQ5YFOdhL6dblHI5wIx10m6n4xt2Fg",
  authDomain: "buenosdeseos-twodesign.firebaseapp.com",
  databaseURL: "https://buenosdeseos-twodesign-default-rtdb.firebaseio.com",
  projectId: "buenosdeseos-twodesign",
  storageBucket: "buenosdeseos-twodesign.firebasestorage.app",
  messagingSenderId: "577908051871",
  appId: "1:577908051871:web:27fbd4e06b3d18da14b7aa"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const eventId = window.rsvpConfig?.eventId || "ronaldysandy2026";
const eventPath = `eventos/${eventId}`;
const cleanKey = (value) => String(value || "").replace(/[.#$\[\]/]/g, "_");

async function saveConfirmation(confirmation) {
  const id = cleanKey(confirmation.id);
  const response = String(confirmation.respuesta || "no").toLowerCase() === "si" ? "si" : "no";
  const payload = {
    id: String(confirmation.id),
    nombre: String(confirmation.nombre || "Invitado"),
    pasesAsignados: Math.max(1, Number(confirmation.pasesAsignados) || 1),
    respuesta: response,
    cantidadConfirmada: response === "si" ? Math.max(1, Number(confirmation.cantidadConfirmada) || 1) : 0,
    fechaConfirmacion: Date.now()
  };
  await set(ref(db, `${eventPath}/rsvp/${id}`), payload);
  return payload;
}

async function getConfirmation(id) {
  const snapshot = await get(ref(db, `${eventPath}/rsvp/${cleanKey(id)}`));
  return snapshot.exists() ? snapshot.val() : null;
}

function subscribeToInvitados(callback) {
  return onValue(ref(db, `${eventPath}/invitados`), (snapshot) => {
    const value = snapshot.val() || {};
    callback(Object.values(value));
  });
}

function subscribeToConfirmations(callback) {
  return onValue(ref(db, `${eventPath}/rsvp`), (snapshot) => {
    const value = snapshot.val() || {};
    callback(Object.values(value));
  });
}

async function updateInvitado(id, data) {
  const key = cleanKey(id);
  const payload = { id: String(id), nombre: String(data.nombre || "Invitado"), pases: Math.max(1, Number(data.pases) || 1), activo: data.activo !== false };
  await set(ref(db, `${eventPath}/invitados/${key}`), payload);
  return payload;
}

window.RSVPDatabase = { saveConfirmation, getConfirmation, subscribeToInvitados, subscribeToConfirmations, updateInvitado, eventId };

console.log("✅ Firebase conectado correctamente!");

// Función para enviar un buen deseo
window.submitWish = function () {
  const name = document.getElementById("wish-name").value.trim();
  const message = document.getElementById("wish-message").value.trim();

  if (name !== "" && message !== "") {
    push(ref(db, "buenos-deseos/"), {
      nombre: name,
      mensaje: message,
      timestamp: new Date().toISOString()
    })
    .then(() => {
      alert("¡Tu buen deseo ha sido enviado! 🌟");
      document.getElementById("wish-name").value = "";
      document.getElementById("wish-message").value = "";

      // Ocultar formulario
      document.getElementById('wish-form').classList.add('hidden');

      // Mostrar lista de deseos y actualizarla
      const wishesDiv = document.getElementById('wishes');
      if (wishesDiv.classList.contains('hidden')) {
          wishesDiv.classList.remove('hidden');
      }
      cargarDeseos();
    })
    .catch((error) => {
      console.error("Error al guardar el deseo:", error);
    });
  } else {
    alert("Por favor, completa ambos campos antes de enviar.");
  }
};

// Función para cargar y mostrar los buenos deseos desde Firebase
function cargarDeseos() {
  const wishesDiv = document.getElementById('wishes');
  const wishesRef = ref(db, 'buenos-deseos/');

  onValue(wishesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      wishesDiv.innerHTML = "<p>No hay deseos aún. Sé el primero 💌</p>";
      return;
    }
    const arrayWishes = Object.values(data).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    wishesDiv.innerHTML = arrayWishes.map(wish => `
      <p><strong>${wish.nombre}:</strong> ${wish.mensaje}</p>
    `).join('');
  });
}

// Exponer cargarDeseos globalmente para usar desde HTML u otros scripts
window.cargarDeseos = cargarDeseos;

// Funciones para mostrar/ocultar formulario y lista
window.toggleWishForm = function() {
  const form = document.getElementById('wish-form');
  form.classList.toggle('hidden');
};

window.toggleWishes = function() {
  const wishesDiv = document.getElementById('wishes');
  wishesDiv.classList.toggle('hidden');
};

// Cargar deseos automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarDeseos();
});
