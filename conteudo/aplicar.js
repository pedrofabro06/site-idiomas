// ============================================================
//  Junta o aprofundamento às unidades e põe as unidades novas na trilha.
//  Palavras e frases novas entram no FIM da lista: o progresso de quem
//  já estudava (que guarda a posição de cada palavra) continua valendo.
// ============================================================
TEMAS.forEach(t => {
  const c = COMPLEMENTOS[t.id];
  if (!c) return;
  if (c.palavras) t.palavras.push(...c.palavras);
  if (c.frases) t.frases.push(...c.frases);
  if (c.dialogo) t.dialogo = c.dialogo;
  if (c.notas) t.notas = c.notas;
});
NOVAS_UNIDADES.forEach(([posicao, referencia, tema]) => {
  if (TEMAS.some(t => t.id === referencia)) inserirTema(posicao, referencia, tema);
  else TEMAS.push(tema);
});
TEMAS.forEach((t, i) => { t.nivel = t.nivel || "A1"; t._ordem = i; });
TEMAS.sort((a, b) => ORDEM_NIVEIS.indexOf(a.nivel) - ORDEM_NIVEIS.indexOf(b.nivel) || a._ordem - b._ordem);
