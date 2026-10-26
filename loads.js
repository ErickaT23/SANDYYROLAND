const guests = [
    { id: "1", name: "Fam. Rosales", passes: 2, gender: "mixto" },
    { id: "2", name: "Fam. García", passes: 3, gender: "mixto" },
    { id: "3", name: "María López", passes: 1, gender: "femenino" },
    { id: "4", name: "Carlos Méndez", passes: 2, gender: "masculino" },
    { id: "5", name: "Fam. Barrios", passes: 4, gender: "mixto" },
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

    const remoteGuestNameEl = document.getElementById("guest-name");
    const remotePassesEl = document.getElementById("passes");
    const remoteRsvpNameEl = document.getElementById("rsvp-name");

    function applyRemoteGuest(remoteGuest) {
      if (!remoteGuest || String(remoteGuest.id) !== String(guestId)) return;
      window.currentGuest = { id: String(remoteGuest.id), name: remoteGuest.nombre, passes: Number(remoteGuest.pases) || 1, gender: remoteGuest.gender || "mixto" };
      if (remoteGuestNameEl) remoteGuestNameEl.textContent = window.currentGuest.passes === 1
        ? `¡${window.currentGuest.name}, está invitado!`
        : `¡${window.currentGuest.name}, están invitados!`;
      if (remotePassesEl) remotePassesEl.textContent = `${window.currentGuest.passes} ${window.currentGuest.passes === 1 ? "pase" : "pases"}`;
      if (remoteRsvpNameEl) remoteRsvpNameEl.value = window.currentGuest.name;
    }

    const subscribeRemote = () => {
      if (window.RSVPDatabase?.subscribeToInvitados) {
        window.RSVPDatabase.subscribeToInvitados((items) => {
          const remoteGuest = items.find((item) => String(item.id) === String(guestId) && item.activo !== false);
          if (remoteGuest) applyRemoteGuest(remoteGuest);
        });
        return;
      }
      setTimeout(subscribeRemote, 100);
    };
    subscribeRemote();
  });
  
