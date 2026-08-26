const parametros = new URLSearchParams(window.location.search);
const slugCarrera = parametros.get("carrera");
let carreraActual = null;

const categorias = [
  { id: "vida_laboral", icono: "💼", nombre: "Vida laboral" },
  { id: "famosos", icono: "🌟", nombre: "Famosos que pasaron por esto" },
  { id: "podcasts", icono: "🎧", nombre: "Podcasts" },
  { id: "libros", icono: "📚", nombre: "Biblioteca / Libros" },
  { id: "resenas", icono: "💬", nombre: "Opiniones de estudiantes" },
  { id: "entrevistas", icono: "🎥", nombre: "Entrevistas a egresados" },
  { id: "minijuegos", icono: "🧩", nombre: "Experiencias didácticas" }
];

fetch("carreras/" + slugCarrera + ".json")
  .then(respuesta => respuesta.json())
  .then(carrera => {
    carreraActual = carrera;
    dibujarHero();
    dibujarMenu();
  })
  .catch(() => {
    document.getElementById("ficha-hero").innerHTML = "<p>No se encontró esa carrera.</p>";
  });

function idDeYoutube(url) {
  const resultado = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  return resultado ? resultado[1] : "";
}

function dibujarHero() {
  document.getElementById("ficha-hero").innerHTML = `
    <section class="ficha-hero">
      <img src="${carreraActual.icono}" alt="" class="ficha-icono">
      <div>
        <h1>${carreraActual.nombre}</h1>
        <p class="ficha-resumen">${carreraActual.resumen}</p>
      </div>
    </section>
  `;
}

function dibujarMenu() {
  const menu = document.getElementById("menu-categorias");
  menu.innerHTML = "";
  categorias.forEach(cat => {
    const boton = document.createElement("div");
    boton.className = "casilla-categoria";
    boton.innerHTML = `
      <span class="casilla-icono">${cat.icono}</span>
      <span class="casilla-nombre">${cat.nombre}</span>
    `;
    boton.addEventListener("click", () => abrirCategoria(cat.id, cat.nombre));
    menu.appendChild(boton);
  });
}

function abrirCategoria(id, nombre) {
  document.getElementById("menu-categorias").style.display = "none";
  document.getElementById("panel-categoria").style.display = "block";

  const panel = document.getElementById("panel-contenido");
  panel.innerHTML = `<h2>${nombre}</h2>`;

  if (id === "vida_laboral") {
    panel.innerHTML += `<p>${carreraActual.campo_laboral}</p>
      <h3 class="subtitulo-panel">Cómo es el día a día</h3>
      <p>${carreraActual.exigencia}</p>`;
  }

      else if (id === "famosos") {
    if (carreraActual.famosos.length === 0) {
      panel.innerHTML += mensajeVacio();
    } else {
      let htmlFamosos = `<div class="grid-famosos">`;
      carreraActual.famosos.forEach((f, indice) => {
        htmlFamosos += `
          <div class="tarjeta-famoso">
            <img src="${f.imagen}" alt="${f.nombre}" class="imagen-famoso">
            <h3>${f.nombre}</h3>
            <button class="boton-conozcamos" onclick="mostrarInfoFamoso(${indice})">Conozcamos</button>
            <div class="info-famoso" id="info-famoso-${indice}" style="display:none;">
              <p class="libro-autor">${f.conocido_por}</p>
              <p>${f.biografia}</p>
              <p class="resena-destacada">${f.resena}</p>
            </div>
          </div>
        `;
      });
      htmlFamosos += `</div>`;
      panel.innerHTML += htmlFamosos;
    }
  }

  else if (id === "podcasts") {
    if (carreraActual.podcasts.length === 0) {
      panel.innerHTML += mensajeVacio();
    } else {
      panel.innerHTML += `<div class="lista-podcasts">`;
      carreraActual.podcasts.forEach(p => {
        const idVideo = idDeYoutube(p.youtube_url);
        panel.innerHTML += `
          <div class="tarjeta-podcast">
            <div class="video-envoltura">
              <iframe src="https://www.youtube.com/embed/${idVideo}" title="${p.titulo}" allowfullscreen></iframe>
            </div>
            <h3>${p.titulo}</h3>
            <p>${p.descripcion}</p>
          </div>
        `;
      });
      panel.innerHTML += `</div>`;
    }
  }

  else if (id === "libros") {
    if (carreraActual.libros.length === 0) {
      panel.innerHTML += mensajeVacio();
    } else {
      panel.innerHTML += `<div class="lista-libros">`;
      carreraActual.libros.forEach(l => {
                panel.innerHTML += `
          <div class="tarjeta-libro">
            <img src="${l.portada}" alt="${l.titulo}" class="portada-libro">
            <h3>${l.titulo}</h3>
            <p class="libro-autor">${l.autor}</p>
            <p>${l.resena}</p>
          </div>
        `;
      });
      panel.innerHTML += `</div>`;
    }
  }

  else if (id === "resenas") {
    if (carreraActual.resenas.length === 0) {
      panel.innerHTML += mensajeVacio();
    } else {
      carreraActual.resenas.forEach(r => {
        panel.innerHTML += `
          <div class="tarjeta-resena">
            <p class="resena-texto">"${r.texto}"</p>
            <p class="resena-autor">${r.autor} · ${r.rol}</p>
          </div>
        `;
      });
    }
  }

  else if (id === "entrevistas") {
    if (carreraActual.entrevistas.length === 0) {
      panel.innerHTML += mensajeVacio();
    } else {
      panel.innerHTML += `<div class="lista-podcasts">`;
      carreraActual.entrevistas.forEach(e => {
        const idVideo = idDeYoutube(e.video_url);
        panel.innerHTML += `
          <div class="tarjeta-podcast">
            <div class="video-envoltura">
              <iframe src="https://www.youtube.com/embed/${idVideo}" title="${e.nombre}" allowfullscreen></iframe>
            </div>
            <h3>${e.nombre}</h3>
            <p class="libro-autor">${e.cargo_actual}</p>
            <p>${e.resumen}</p>
          </div>
        `;
      });
      panel.innerHTML += `</div>`;
    }
  }

  else if (id === "minijuegos") {
    if (carreraActual.minijuegos.length === 0) {
      panel.innerHTML += mensajeVacio();
    } else {
      carreraActual.minijuegos.forEach((m, indice) => {
        panel.innerHTML += `
          <div class="tarjeta-minijuego" id="minijuego-${indice}">
            <h3>${m.titulo}</h3>
            <p>${m.situacion}</p>
            <div class="opciones-minijuego">
              ${m.opciones.map((op, i) => `
                <button class="opcion-minijuego" onclick="responderMinijuego(${indice}, ${i})">${op}</button>
              `).join("")}
            </div>
            <p class="resultado-minijuego" id="resultado-${indice}"></p>
          </div>
        `;
      });
    }
  }
}

function responderMinijuego(indiceJuego, indiceOpcion) {
  const juego = carreraActual.minijuegos[indiceJuego];
  const resultado = document.getElementById("resultado-" + indiceJuego);
  if (indiceOpcion === juego.respuesta_correcta) {
    resultado.innerHTML = "✅ " + juego.explicacion;
  } else {
    resultado.innerHTML = "❌ No era esa. " + juego.explicacion;
  }
}

function mostrarInfoFamoso(indice) {
  const info = document.getElementById("info-famoso-" + indice);
  info.style.display = info.style.display === "none" ? "block" : "none";
}

function mensajeVacio() {
  return `<p class="vacio">Aún no hay contenido agregado en esta sección.</p>`;
}

document.getElementById("btn-volver-menu").addEventListener("click", () => {
  document.getElementById("panel-categoria").style.display = "none";
  document.getElementById("menu-categorias").style.display = "grid";
});
