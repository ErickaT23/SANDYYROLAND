(() => {
  document.getElementById("dashboard-app").hidden = false;
  document.getElementById("restricted").hidden = true;
  let guests = [], confirmations = [], filter = "todos";
  const date = (value) => value ? new Date(value).toLocaleString("es-GT") : "--";
  function render() {
    const map = new Map(guests.map((guest) => [String(guest.id), guest]));
    const rows = guests.filter((guest) => guest.activo !== false).map((guest) => {
      const confirmation = confirmations.find((item) => String(item.id) === String(guest.id));
      return { ...guest, ...confirmation, nombre: confirmation?.nombre || guest.nombre, respuesta: confirmation?.respuesta || "pendiente", pasesAsignados: guest.pases };
    });
    document.getElementById("total").textContent = guests.filter((g) => g.activo !== false).length;
    document.getElementById("yes").textContent = rows.filter((r) => r.respuesta === "si").length;
    document.getElementById("no").textContent = rows.filter((r) => r.respuesta === "no").length;
    document.getElementById("pending").textContent = Math.max(0, guests.length - rows.length);
    document.getElementById("people").textContent = rows.reduce((sum, r) => sum + Number(r.cantidadConfirmada || 0), 0);
    const query = document.getElementById("search").value.toLowerCase();
    const filtered = rows.filter((r) => (filter === "todos" || r.respuesta === filter) && String(r.nombre || "").toLowerCase().includes(query));
    document.getElementById("confirmation-rows").innerHTML = filtered.map((r) => `<tr><td>${r.id}</td><td>${r.nombre}</td><td>${r.pasesAsignados || r.pases || 1}</td><td>${r.respuesta === "si" ? "Confirmado" : r.respuesta === "no" ? "No asiste" : "Pendiente"}</td><td>${r.respuesta === "pendiente" ? "--" : r.cantidadConfirmada || 0}</td><td>${date(r.fechaConfirmacion)}</td></tr>`).join("");
    document.getElementById("confirmation-cards").innerHTML = filtered.map((r) => `<article class="confirmation-card"><h3><span>#${r.id}</span> · ${r.nombre}</h3><div class="confirmation-card-status">${r.respuesta === "si" ? "Confirmado" : r.respuesta === "no" ? "No asiste" : "Pendiente"}</div><div class="confirmation-card-details"><div><span>Pases</span><strong>${r.pasesAsignados || r.pases || 1}</strong></div><div><span>Pases confirmados</span><strong>${r.respuesta === "pendiente" ? "--" : r.cantidadConfirmada || 0}</strong></div><div><span>Fecha de confirmación</span><strong>${date(r.fechaConfirmacion)}</strong></div></div></article>`).join("");
  }
  window.RSVPDatabase?.subscribeToInvitados((items) => { guests = items; render(); });
  window.RSVPDatabase?.subscribeToConfirmations((items) => { confirmations = items; render(); });
  document.getElementById("search").addEventListener("input", render);
  document.getElementById("clear").addEventListener("click", () => { document.getElementById("search").value = ""; filter = "todos"; render(); });
  document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => { filter = button.dataset.filter; document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("is-active")); button.classList.add("is-active"); render(); }));
  document.getElementById("export").addEventListener("click", () => {
    const lines = [["ID", "Nombre", "Respuesta", "Pases confirmados"], ...confirmations.map((r) => [r.id, r.nombre, r.respuesta, r.cantidadConfirmada || 0])];
    const blob = new Blob([lines.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "confirmaciones-ronald-y-sandy.csv"; link.click(); URL.revokeObjectURL(link.href);
  });
})();
