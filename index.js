import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import cursos from './dados/cursos.js';
import { verificarAutenticacao } from './seguranca/autenticar.js';

const app  = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'segredo-super-simples',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } 
}));

app.get('/api/cursos', (_req, res) => {
  const lista = cursos.map(({ id, nome, inicio, duracao, preco, imagem, nivel }) => ({
    id, nome, inicio, duracao, preco, imagem, nivel
  }));
  res.json(lista);
});

app.get('/api/cursos/:id', verificarAutenticacao, (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find(c => c.id === id);
  if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
  res.json(curso);
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === 'admin') {
    req.session.autenticado = true;
    return res.redirect('/index.html');
  }
  return res.redirect('/login.html?erro=1');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.html?logout=1'));
});

app.use(express.static(path.join(__dirname, 'publico')));
app.use(verificarAutenticacao, express.static(path.join(__dirname, 'privado')));

app.use((_req, res) => res.status(404).send('404 - Rota não encontrada'));

app.listen(PORT, HOST, () => {
  console.log(`Servidor em execução em http://${HOST}:${PORT}`);
});
