
document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/company-list/firms.json")
    .then((res) => res.json())
    .then((data) => {
      const kategorije = new Set();
      const drzave = new Set();
      const gradoviPoDrzavi = {};

      data.forEach((firma) => {
        kategorije.add(firma.kategorija);
        drzave.add(firma.drzava);

        if (!gradoviPoDrzavi[firma.drzava]) {
          gradoviPoDrzavi[firma.drzava] = new Set();
        }
        gradoviPoDrzavi[firma.drzava].add(firma.grad);
      });

      // Popuni kategorije
      const katSelect = document.getElementById("category");
      kategorije.forEach((kat) => {
        const opt = document.createElement("option");
        opt.value = kat;
        opt.textContent = kat.charAt(0).toUpperCase() + kat.slice(1);
        katSelect.appendChild(opt);
      });

      // Popuni države
      const drzavaSelect = document.getElementById("drzava");
      drzave.forEach((drzava) => {
        const opt = document.createElement("option");
        opt.value = drzava;
        opt.textContent = drzava;
        drzavaSelect.appendChild(opt);
      });

      // Reaguj na promenu države da popuni gradove
      const gradSelect = document.getElementById("grad");
      drzavaSelect.addEventListener("change", () => {
        const izabranaDrzava = drzavaSelect.value;
        gradSelect.innerHTML = '<option value="">-- Izaberi grad --</option>';

        if (gradoviPoDrzavi[izabranaDrzava]) {
          Array.from(gradoviPoDrzavi[izabranaDrzava]).sort().forEach((grad) => {
            const opt = document.createElement("option");
            opt.value = grad;
            opt.textContent = grad;
            gradSelect.appendChild(opt);
          });
        }
      });
    })
    .catch((err) => console.error("Greška pri učitavanju firmi:", err));
});
