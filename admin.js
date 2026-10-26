(() => {
  const params = new URLSearchParams(location.search);
  const authorized = params.get("key") === window.rsvpConfig?.adminKey;
  const app = document.getElementById("admin-app");
  const status = document.getElementById("admin-status");
  if (!authorized) return;
  app.hidden = false;
  document.getElementById("restricted").hidden = true;
  const rows = document.getElementById("guest-rows");
  let guests = [];
  const setStatus = (text) => { status.textContent = text; };
  async function syncLocalGuests() {
    const localGuests = window.localGuests || [];
    await Promise.all(localGuests.map((guest) => window.RSVPDatabase.updateInvitado(guest.id, {
      nombre: guest.name,
      pases: guest.passes,
      activo: true
    })));
  }
  function render() {
    rows.innerHTML = guests.map((guest) => `<tr><td>${guest.id}</td><td>${guest.nombre}</td><td>${guest.pases}</td><td>${guest.activo === false ? "No" : "Sí"}</td><td><button data-toggle="${guest.id}">${guest.activo === false ? "Activar" : "Desactivar"}</button></td></tr>`).join("");
    rows.querySelectorAll("[data-toggle]").forEach((button) => button.addEventListener("click", async () => {
      const guest = guests.find((item) => String(item.id) === button.dataset.toggle);
      await window.RSVPDatabase.updateInvitado(guest.id, { ...guest, activo: guest.activo === false });
      setStatus("Invitado actualizado.");
    }));
  }
  window.RSVPDatabase?.subscribeToInvitados((items) => { guests = items; render(); });
  setTimeout(() => syncLocalGuests().catch((error) => {
    console.error(error);
    setStatus("No se pudieron sincronizar los invitados.");
  }), 0);
  document.getElementById("guest-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("guest-id").value.trim();
    await window.RSVPDatabase.updateInvitado(id, { nombre: document.getElementById("guest-name").value.trim(), pases: document.getElementById("guest-passes").value, activo: true });
    event.target.reset(); document.getElementById("guest-passes").value = 1; setStatus("Invitado guardado.");
  });
})();
