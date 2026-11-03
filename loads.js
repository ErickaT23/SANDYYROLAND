const guests = [
  { id: "1", name: "Julio Marcos y Esposa", passes: 2, gender: "mixto" },
  { id: "2", name: "Vitalina Giron", passes: 2, gender: "mixto" },
  { id: "3", name: "Eduardo Hernández y Familia", passes: 3, gender: "mixto" },
  { id: "4", name: "Asencio Vargas", passes: 3, gender: "mixto" },
  { id: "5", name: "Aracely Girón y Familia", passes: 3, gender: "mixto" },
  { id: "6", name: "Asencio Bulux", passes: 4, gender: "mixto" },
  { id: "7", name: "Girón Martínez", passes: 3, gender: "mixto" },
  { id: "8", name: "Morales Girón", passes: 3, gender: "mixto" },
  { id: "9", name: "Girón Chivalan", passes: 2, gender: "mixto" },
  { id: "10", name: "Carlos Girón", passes: 1, gender: "masculino" },
  { id: "11", name: "Lopez Chanchavac", passes: 4, gender: "mixto" },
  { id: "12", name: "Macario Hernández", passes: 5, gender: "mixto" },
  { id: "13", name: "Milagro Macario", passes: 2, gender: "mixto" },
  { id: "14", name: "Cipriano Macario", passes: 2, gender: "mixto" },
  { id: "15", name: "Ana Cipriano y Familia", passes: 3, gender: "mixto" },
  { id: "16", name: "Martínez Cifuentes", passes: 3, gender: "mixto" },
  { id: "17", name: "Vera Figueroa", passes: 2, gender: "mixto" },
  { id: "18", name: "Matías Silin", passes: 3, gender: "mixto" },
  { id: "19", name: "Guzmán Mejía", passes: 2, gender: "mixto" },
  { id: "20", name: "Lais Puac y Miguel Xutuc", passes: 2, gender: "mixto" },
  { id: "21", name: "Nery Alvarado", passes: 1, gender: "mixto" },
  { id: "22", name: "José Vásquez", passes: 1, gender: "masculino" },
  { id: "23", name: "Guzmán Barrios", passes: 2, gender: "mixto" },
  { id: "24", name: "Alonzo Guzmán y Nuera", passes: 6, gender: "mixto" },
  { id: "25", name: "Castro Guzmán", passes: 5, gender: "mixto" },
  { id: "26", name: "Iris Guzmán y Fam", passes: 4, gender: "mixto" },
  { id: "27", name: "Anygret Guzmán E Hija", passes: 2, gender: "mixto" },
  { id: "28", name: "Lucas Guzmán", passes: 5, gender: "mixto" },
  { id: "29", name: "Guzmán Juárez", passes: 3, gender: "mixto" },
  { id: "30", name: "Heredia Samayoa", passes: 2, gender: "mixto" },
  { id: "31", name: "Andrea Flores y Familia", passes: 3, gender: "mixto" },
  { id: "32", name: "Bolaños Cifuentes", passes: 3, gender: "mixto" },
  { id: "33", name: "Marvin Escobar", passes: 1, gender: "mixto" },
  { id: "34", name: "Ruiz Palacios", passes: 4, gender: "mixto" },
  { id: "35", name: "Ahyris Alva Y Óseas Cuyuch", passes: 2, gender: "mixto" },
  { id: "36", name: "Maria Jose Gutiérrez y Familia", passes: 3, gender: "mixto" },
];

window.localGuests = guests;

  document.addEventListener("DOMContentLoaded", function () {
    function getQueryParams() {
      const params = {};
      const queryString = window.location.search.substring(1);
      if (!queryString) return params;
  
      const pairs = queryString.split("&");
      for (const pair of pairs) {
        const [key, value] = pair.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent((value || "").replace(/\+/g, " "));
      }
      return params;
    }
  
    const queryParams = getQueryParams();
    const guestId = queryParams.id;
  
    const guest = guests.find(g => g.id === guestId);
  
    if (guest) {
      // 👇 DISPONIBLE PARA script.js (WhatsApp, etc.)
      window.currentGuest = guest;
  
      let invitText = "";
  
      if (guest.passes === 1) {
        invitText = guest.gender === "femenino"
          ? `¡${guest.name}, está invitada!`
          : `¡${guest.name}, está invitado!`;
      } else {
        if (guest.gender === "femenino") {
          invitText = `¡${guest.name}, están invitadas!`;
        } else {
          invitText = `¡${guest.name}, están invitados!`;
        }
      }
  
      const guestNameEl = document.getElementById("guest-name");
      const passesEl = document.getElementById("passes");
      const rsvpNameEl = document.getElementById("rsvp-name");

      if (guestNameEl) guestNameEl.textContent = invitText;
      if (passesEl) passesEl.textContent = `${guest.passes} ${guest.passes === 1 ? "pase" : "pases"}`;
      if (rsvpNameEl) rsvpNameEl.value = guest.name;
    } else {
      window.currentGuest = null;
  
      const guestNameEl = document.getElementById("guest-name");
      if (guestNameEl) guestNameEl.textContent = "¡Invitado no encontrado!";
  
      const section = document.querySelector(".invitation-info-section");
      if (section) section.style.display = "none";
    }

    const subscribeRemote = () => {
      if (!window.RSVPDatabase?.subscribeToInvitados) {
        setTimeout(subscribeRemote, 100);
        return;
      }
      window.RSVPDatabase.subscribeToInvitados((items) => {
        const remoteGuest = items.find((item) => String(item.id) === String(guestId) && item.activo !== false);
        if (!remoteGuest) return;
        window.currentGuest = {
          id: String(remoteGuest.id),
          name: remoteGuest.nombre,
          passes: Number(remoteGuest.pases) || 1,
          gender: remoteGuest.gender || "mixto"
        };
        const text = window.currentGuest.passes === 1
          ? `¡${window.currentGuest.name}, está invitado!`
          : `¡${window.currentGuest.name}, están invitados!`;
        const nameEl = document.getElementById("guest-name");
        const passesEl = document.getElementById("passes");
        const rsvpNameEl = document.getElementById("rsvp-name");
        if (nameEl) nameEl.textContent = text;
        if (passesEl) passesEl.textContent = `${window.currentGuest.passes} ${window.currentGuest.passes === 1 ? "pase" : "pases"}`;
        if (rsvpNameEl) rsvpNameEl.value = window.currentGuest.name;
      });
    };
    subscribeRemote();

  });
  
