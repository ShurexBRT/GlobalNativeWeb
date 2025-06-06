// JS logika za unos firme u Firestoredocument.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("firmForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      naziv: form.naziv.value.trim(),
      opis: form.opis.value.trim(),
      kategorija: form.kategorija.value,
      jezici: Array.from(form.querySelectorAll("input[name='jezici']:checked")).map(cb => cb.value),
      grad: form.grad.value.trim(),
      drzava: form.drzava.value.trim(),
      adresa: form.adresa.value.trim(),
      email: form.email.value.trim(),
      telefon: form.telefon.value.trim(),
      websajt: form.websajt.value.trim(),
      logo: form.slika.value.trim(),
      timestamp: new Date().toISOString()
    };

    console.log("Podaci za slanje:", formData);

    // TODO: Firebase slanje (naknadno)
    alert("Podaci su spremni za slanje. Firebase integracija dolazi uskoro.");

    form.reset();
  });

