// Versão do cache - atualize este número quando modificar os dados
const CACHE_VERSION = "1.0.0";

// Texto de atualização - modifique aqui
const UPDATE_TEXT = "31 de dezembro de 2024, 23:59<br><br> O Big Day RS é um evento independente inspirado no eBird (Big Day), com objetivo de observar aves gaúchas, fortalecer a ciência cidadã e a conexão com a natureza.";

// Dados centralizados - apenas aqui!
const RANKING_DATA = {
  // Observadores - Espécies
  observadores_species: [
  //  { nome: "João Silva", quantidade: 162 },
  //  { nome: "Maria Costa", quantidade: 158 }
  ],
  
  // Observadores - Listas
  observadores_lists: [
  //  { nome: "João Silva", quantidade: 48 },
  //  { nome: "Maria Costa", quantidade: 45 }
  ],
  
  // Municípios - Espécies
  municipios_species: [
  //  { nome: "Porto Alegre", quantidade: 285 },
  //  { nome: "Viamão", quantidade: 267 }
  ],
  
  // Municípios - Listas
  municipios_lists: [
  //  { nome: "Porto Alegre", quantidade: 85 },
  //  { nome: "Viamão", quantidade: 78 }
  ]
};

// Log para verificar se o script carregou a versão correta
console.log(`Ranking Big Day - Versão ${CACHE_VERSION}`);

// Util: formata número (inteiro)
function fmt(n){ return Number(n)||0; }

// Orderna por quantidade decrescente e retorna com colocação
function prepareRanking(rows){
  const list = rows.map(item => ({
    nome: item.nome || item.Nome || "",
    quantidade: fmt(item.quantidade || item.Quantidade || 0)
  }));
  
  list.sort((a,b) => b.quantidade - a.quantidade);
  
  let rank = 0, lastQty = null;
  return list.map((item, i) => {
    if (item.quantidade !== lastQty) {
      rank = i + 1;
      lastQty = item.quantidade;
    }
    return { colocacao: rank, nome: item.nome, quantidade: item.quantidade };
  });
}

// Renderiza top N em tabela SEM thead
function renderTop(tableId, data, topN=10){
  const table = document.getElementById(tableId);
  if (!table) return;
  
  // Remove thead se existir
  const thead = table.querySelector('thead');
  if (thead) thead.remove();
  
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = "";
  const shown = data.slice(0, topN);
  for (const row of shown) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.colocacao}</td><td>${escapeHtml(row.nome)}</td><td>${row.quantidade}</td>`;
    tbody.appendChild(tr);
  }
}

// adiciona botão "Mais dados" se total > 10
function setupMoreButton(containerId, type, total){
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = "";
  if (total > 10) {
    const link = document.createElement('a');
    link.href = `full.html?type=${type}&v=${CACHE_VERSION}`;
    link.textContent = "Mais dados";
    container.appendChild(link);
  }
}

// Adiciona texto de atualização no rodapé
function setupUpdateFooter() {
  const footer = document.createElement('div');
  footer.className = 'update-footer';
  footer.innerHTML = `<p>Dados atualizados até: <strong>${UPDATE_TEXT}</strong></p>`;
  document.body.appendChild(footer);
}

// escape básico para inserir nomes
function escapeHtml(s){
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// Função global para acessar dados do full.html
function getRankingData(type) {
  return RANKING_DATA[type] || [];
}

// Função global para acessar texto de atualização
function getUpdateText() {
  return UPDATE_TEXT;
}

// Main: processar dados e renderizar
function init(){
  console.log('Iniciando carregamento...');
  
  // species
  const obsSpeciesRank = prepareRanking(RANKING_DATA.observadores_species);
  renderTop("observadores-species-table", obsSpeciesRank, 10);
  setupMoreButton("observadores-species-more", "observadores_species", obsSpeciesRank.length);

  // lists
  const obsListsRank = prepareRanking(RANKING_DATA.observadores_lists);
  renderTop("observadores-lists-table", obsListsRank, 10);
  setupMoreButton("observadores-lists-more", "observadores_lists", obsListsRank.length);

  // Municípios - Espécies
  const munSpeciesRank = prepareRanking(RANKING_DATA.municipios_species);
  renderTop("municipios-species-table", munSpeciesRank, 10);
  setupMoreButton("municipios-species-more", "municipios_species", munSpeciesRank.length);

  // Municípios - Listas
  const munListsRank = prepareRanking(RANKING_DATA.municipios_lists);
  renderTop("municipios-lists-table", munListsRank, 10);
  setupMoreButton("municipios-lists-more", "municipios_lists", munListsRank.length);
  
  // Adiciona rodapé com data de atualização
  setupUpdateFooter();
  
  console.log('Carregamento completo');
}

// Run
document.addEventListener("DOMContentLoaded", init);
