(() => {
  document.getElementById("dashboard-app").hidden = false;
  let guests = [], confirmations = [];
  const date = (value) => value ? new Date(value).toLocaleString("es-GT") : "--";
  function render() {
    const map = new Map(guests.map((guest) => [String(guest.id), guest]));
    const rows = confirmations.map((item) => ({ ...map.get(String(item.id)), ...item }));
    document.getElementById("total").textContent = guests.filter((g) => g.activo !== false).length;
    document.getElementById("yes").textContent = rows.filter((r) => r.respuesta === "si").length;
    document.getElementById("no").textContent = rows.filter((r) => r.respuesta === "no").length;
    document.getElementById("pending").textContent = Math.max(0, guests.length - rows.length);
    document.getElementById("people").textContent = rows.reduce((sum, r) => sum + Number(r.cantidadConfirmada || 0), 0);
    const query = document.getElementById("search").value.toLowerCase();
    document.getElementById("confirmation-rows").innerHTML = rows.filter((r) => String(r.nombre || "").toLowerCase().includes(query)).map((r) => `<tr><td>${r.id}</td><td>${r.nombre}</td><td>${r.pasesAsignados || r.pases || 1}</td><td>${r.respuesta === "si" ? "Confirmado" : "No asiste"}</td><td>${r.cantidadConfirmada || 0}</td><td>${date(r.fechaConfirmacion)}</td></tr>`).join("");
  }
  window.RSVPDatabase?.subscribeToInvitados((items) => { guests = items; render(); });
  window.RSVPDatabase?.subscribeToConfirmations((items) => { confirmations = items; render(); });
  document.getElementById("search").addEventListener("input", render);
  document.getElementById("export").addEventListener("click", () => {
    const lines = [["ID", "Nombre", "Respuesta", "Pases confirmados"], ...confirmations.map((r) => [r.id, r.nombre, r.respuesta, r.cantidadConfirmada || 0])];
    const blob = new Blob([lines.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "confirmaciones-ronald-y-sandy.csv"; link.click(); URL.revokeObjectURL(link.href);
  });
})();
