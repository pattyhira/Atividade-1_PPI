
function real(v){ return 'R$ ' + v.toFixed(2).replace('.', ','); }

async function carregarDetalhes(){
  const qs = new URLSearchParams(location.search);
  const id = Number(qs.get('id') || 0);
  const alvo = document.getElementById('conteudo');

  if (!id) {
    alvo.innerHTML = '<div class="badge">Curso inválido.</div>';
    return;
  }

  try {
    const resp = await fetch('/api/cursos/' + id);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const c = await resp.json();

    alvo.innerHTML = [
      '<section class="hero">',
      '  <article class="panel">',
      '    <div class="panel__media">',
      `      <img class="card__img" src="${c.imagem}" alt="Capa do curso ${c.nome}">`,
      '    </div>',
      `    <h2 class="panel__title">${c.nome}</h2>`,
      `    <p><strong>Instrutor:</strong> ${c.instrutor}</p>`,
      `    <p><strong>Nível:</strong> ${c.nivel}</p>`,
      `    <p>${c.descricao}</p>`,
      '  </article>',
      '  <aside class="panel">',
      `    <p><span class="badge">Início</span> ${c.inicio}</p>`,
      `    <p><span class="badge">Duração</span> ${c.duracao}</p>`,
      `    <p><span class="badge">Carga horária</span> ${c.cargaHoraria}h</p>`,
      `    <p><span class="badge">Vagas</span> ${c.vagas}</p>`,
      `    <p class="card__price"><strong>Preço unitário:</strong> ${real(c.preco)}</p>`,
      '    <label for="qtd">Quantidade de vagas</label>',
      '    <input id="qtd" type="number" min="1" value="1" style="width:140px;padding:8px;border:1px solid #e5e7eb;border-radius:10px" />',
      '    <div class="total">Total: <span id="total"></span></div>',
      '    <p class="mt-3"><a class="btn" href="/index.html">← Voltar</a></p>',
      '  </aside>',
      '</section>'
    ].join('\n');

    const qtdInput = document.getElementById('qtd');
    const totalEl  = document.getElementById('total');

    function atualizarTotal(){
      let q = parseInt(qtdInput.value || '1', 10);
      if (q < 1) q = 1;
      if (q > c.vagas) q = c.vagas;
      qtdInput.value = q;
      totalEl.textContent = real(c.preco * q);
    }

    qtdInput.addEventListener('input', atualizarTotal);
    atualizarTotal();
  } catch (e) {
    console.error(e);
    alvo.innerHTML = '<div class="badge">Não foi possível carregar os detalhes.</div>';
  }
}

carregarDetalhes();
