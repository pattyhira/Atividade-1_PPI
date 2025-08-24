async function carregarCursos() {
  const cont = document.getElementById('lista-cursos');
  cont.innerHTML = '<span class="badge">Carregando...</span>';

  try {
    const resp = await fetch('/api/cursos');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const cursos = await resp.json();

    cont.innerHTML = '';

    cursos.forEach((c) => {
      const el = document.createElement('article');
      el.className = 'card';

      el.innerHTML = [
        '<div class="card__media">',
        `  <img class="card__img" src="${c.imagem}" alt="Capa do curso ${c.nome}">`,
        '</div>',
        '<div class="card__body">',
        `  <h3 class="card__title">${c.nome}</h3>`,
        '  <div class="card__meta">',
        `    <span class="badge">Início: ${c.inicio}</span>`,
        `    <span class="badge">Duração: ${c.duracao}</span>`,
        '  </div>',
        `  <div class="card__price">Preço: R$ ${Number(c.preco).toFixed(2).replace('.', ',')}</div>`,
        '  <div class="card__actions">',
        `    <a class="btn btn--primary" href="/curso.html?id=${c.id}">Ver detalhes</a>`,
        '  </div>',
        '</div>'
      ].join('\n');

      cont.appendChild(el);
    });
  } catch (e) {
    console.error('Falha ao carregar /api/cursos:', e);
    cont.innerHTML = '<div class="badge">Falha ao carregar cursos.</div>';
  }
}
carregarCursos();
