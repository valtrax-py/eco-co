/* ==========================================================
   ECO-COM — JavaScript commun
   1) menu mobile  2) apparition au défilement
   3) images manquantes -> emplacement visible  4) simulateur de prix
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // 1) Menu mobile
  const burger = document.querySelector('.burger'), menu = document.querySelector('.nav ul');
  if (burger) burger.addEventListener('click', () => {
    const ouvert = menu.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', ouvert);
  });

  // 2) Apparition douce des cartes
  const cibles = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }), { threshold: .12 });
    cibles.forEach(c => obs.observe(c));
  } else cibles.forEach(c => c.classList.add('visible'));

  // 3) Image absente : on affiche un emplacement qui indique le nom du fichier à ajouter
  //    (ou, pour un logo ODD, une tuile colorée de remplacement)
  const remplacer = img => {
    const d = document.createElement('div');
    if (img.dataset.odd) {                       // tuile ODD provisoire
      d.className = 'tuile';
      d.style.background = img.dataset.couleur;
      d.innerHTML = `<span>${img.dataset.odd}</span><small>${img.alt}</small>`;
    } else {
      d.className = 'vide';
      d.innerHTML = `<b>Image à ajouter</b><span>${img.getAttribute('src')}</span>`;
    }
    img.replaceWith(d);
  };
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) remplacer(img);
    else img.addEventListener('error', () => remplacer(img), { once: true });
  });

  // 4) Simulateur de prix (page prix.html) — PRIX FICTIFS
  //    Modifier les paliers ici : [quantité minimale, prix fictif par brique en €]
  const PALIERS = [[1, 12], [11, 10], [101, 8]];
  const curseur = document.getElementById('qte');
  if (curseur) {
    const maj = () => {
      const q = +curseur.value;
      const p = [...PALIERS].reverse().find(t => q >= t[0])[1];
      document.getElementById('qte-val').textContent = q;
      document.getElementById('prix-unit').textContent = p.toFixed(2).replace('.', ',') + ' €';
      document.getElementById('prix-total').textContent = (q * p).toLocaleString('fr-FR') + ' €';
    };
    curseur.addEventListener('input', maj); maj();
  }

  // Année dans le pied de page
  document.querySelectorAll('.annee').forEach(s => s.textContent = new Date().getFullYear());
});
