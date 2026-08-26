let carreras = [];
let categoriaActiva = "todas";

fetch("carreras-index.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    carreras = datos;
    dibujarCarreras();
  });

function dibujarCarreras() {
  const grid = document.getElementById("grid-carreras");
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase();

  const filtradas = carreras.filter(carrera => {
    const coincideCategoria = categoriaActiva === "todas" || carrera.categoria === categoriaActiva;
    const coincideBusqueda = carrera.nombre.toLowerCase().includes(textoBusqueda);
    return coincideCategoria && coincideBusqueda;
  });

  grid.innerHTML = "";

  if (filtradas.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1 / -1; color:#888780; font-size:13px;'>No se encontraron carreras.</p>";
    return;
  }

  filtradas.forEach(carrera => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "card";
        tarjeta.innerHTML = `
      <img class="card-icono" src="${carrera.icono}" alt="">
      <h3>${carrera.nombre}</h3>
      <p>${carrera.libros} libros, ${carrera.podcasts} podcasts</p>
    `;
    tarjeta.addEventListener("click", () => {
      window.location.href = "ficha.html?carrera=" + carrera.slug;
    });
    grid.appendChild(tarjeta);
  });
}

document.getElementById("buscador").addEventListener("input", dibujarCarreras);

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("chip-activo"));
    chip.classList.add("chip-activo");
    categoriaActiva = chip.dataset.cat;
    dibujarCarreras();
  });
});
