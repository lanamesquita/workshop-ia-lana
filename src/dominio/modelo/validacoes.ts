import {
  Etapa,
  Exercicio,
  LIMITES,
  Serie,
  Treino,
} from './prescricao';

export type CodigoErro =
  | 'nomeObrigatorio'
  | 'nomeForaDoLimite'
  | 'descricaoObrigatoria'
  | 'descricaoForaDoLimite'
  | 'quantidadeDeSeriesInvalida'
  | 'descansoEntreSeriesInvalido'
  | 'descansoEntreSeriesObrigatorio'
  | 'repeticoesInvalidas'
  | 'tempoExecucaoInvalido'
  | 'etapasObrigatorias'
  | 'tempoPreparacaoObrigatorio'
  | 'tempoPreparacaoNaoSeAplica'
  | 'exerciciosObrigatorios'
  | 'diaDaSemanaObrigatorio'
  | 'horarioDuplicado';

export interface ErroDeValidacao {
  campo: string;
  codigo: CodigoErro;
}

const ehInteiro = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);

function validarNome(nome: string, campo: string): ErroDeValidacao[] {
  const limpo = nome?.trim() ?? '';
  if (limpo.length === 0) return [{ campo, codigo: 'nomeObrigatorio' }];
  if (limpo.length > LIMITES.nomeMaximo) return [{ campo, codigo: 'nomeForaDoLimite' }];
  return [];
}

export function validarEtapa(etapa: Etapa, exercicioLivre: boolean): ErroDeValidacao[] {
  const erros: ErroDeValidacao[] = [];
  const descricao = etapa.descricao?.trim() ?? '';

  if (descricao.length === 0) {
    erros.push({ campo: 'descricao', codigo: 'descricaoObrigatoria' });
  } else if (descricao.length > LIMITES.descricaoMaxima) {
    erros.push({ campo: 'descricao', codigo: 'descricaoForaDoLimite' });
  }

  if (!exercicioLivre && (!ehInteiro(etapa.tempoExecucaoSegundos) || etapa.tempoExecucaoSegundos <= 0)) {
    erros.push({ campo: 'tempoExecucaoSegundos', codigo: 'tempoExecucaoInvalido' });
  }

  return erros;
}

export function validarExercicio(exercicio: Exercicio): ErroDeValidacao[] {
  const erros: ErroDeValidacao[] = [...validarNome(exercicio.nome, 'nome')];

  if (exercicio.livre) {
    if (exercicio.tempoPreparacaoSegundos !== undefined && exercicio.modoDisparo === 'manual') {
      erros.push({ campo: 'tempoPreparacaoSegundos', codigo: 'tempoPreparacaoNaoSeAplica' });
    }
  } else {
    if (!ehInteiro(exercicio.repeticoes) || (exercicio.repeticoes ?? 0) < 1) {
      erros.push({ campo: 'repeticoes', codigo: 'repeticoesInvalidas' });
    }
    if (exercicio.etapas.length === 0) {
      erros.push({ campo: 'etapas', codigo: 'etapasObrigatorias' });
    }
  }

  if (exercicio.modoDisparo === 'automatico') {
    if (!ehInteiro(exercicio.tempoPreparacaoSegundos) || (exercicio.tempoPreparacaoSegundos ?? 0) <= 0) {
      erros.push({ campo: 'tempoPreparacaoSegundos', codigo: 'tempoPreparacaoObrigatorio' });
    }
  } else if (exercicio.tempoPreparacaoSegundos !== undefined) {
    erros.push({ campo: 'tempoPreparacaoSegundos', codigo: 'tempoPreparacaoNaoSeAplica' });
  }

  exercicio.etapas.forEach((etapa) => erros.push(...validarEtapa(etapa, exercicio.livre)));

  return erros;
}

export function validarSerie(serie: Serie): ErroDeValidacao[] {
  const erros: ErroDeValidacao[] = [];

  if (!ehInteiro(serie.quantidadeDeSeries) || serie.quantidadeDeSeries < 1) {
    erros.push({ campo: 'quantidadeDeSeries', codigo: 'quantidadeDeSeriesInvalida' });
  }

  if (!ehInteiro(serie.descansoEntreSeriesSegundos) || serie.descansoEntreSeriesSegundos < 0) {
    erros.push({ campo: 'descansoEntreSeriesSegundos', codigo: 'descansoEntreSeriesInvalido' });
  } else if (serie.quantidadeDeSeries > 1 && serie.descansoEntreSeriesSegundos === 0) {
    erros.push({ campo: 'descansoEntreSeriesSegundos', codigo: 'descansoEntreSeriesObrigatorio' });
  }

  if (serie.exercicios.length === 0) {
    erros.push({ campo: 'exercicios', codigo: 'exerciciosObrigatorios' });
  }

  serie.exercicios.forEach((exercicio) => erros.push(...validarExercicio(exercicio)));

  return erros;
}

export function validarTreino(treino: Treino): ErroDeValidacao[] {
  const erros: ErroDeValidacao[] = [...validarNome(treino.nome, 'nome')];

  if (treino.horarios.length > 0 && treino.diasDaSemana.length === 0) {
    erros.push({ campo: 'diasDaSemana', codigo: 'diaDaSemanaObrigatorio' });
  }

  const chaves = treino.horarios.map((h) => `${h.hora}:${h.minuto}`);
  if (new Set(chaves).size !== chaves.length) {
    erros.push({ campo: 'horarios', codigo: 'horarioDuplicado' });
  }

  treino.itens.forEach((item) => {
    if (item.tipo === 'serie') erros.push(...validarSerie(item.serie));
    else erros.push(...validarExercicio(item.exercicio));
  });

  return erros;
}

/** Um treino sem itens pode ser salvo como rascunho, mas não pode ser iniciado. */
export function podeSerIniciado(treino: Treino): boolean {
  return treino.itens.length > 0 && validarTreino(treino).length === 0;
}
