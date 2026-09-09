export type DiaDaSemana =
  | 'domingo'
  | 'segunda'
  | 'terca'
  | 'quarta'
  | 'quinta'
  | 'sexta'
  | 'sabado';

export const DIAS_DA_SEMANA: readonly DiaDaSemana[] = [
  'domingo',
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
];

export type ModoDisparo = 'manual' | 'automatico';

export interface HoraDoDia {
  hora: number;
  minuto: number;
}

export interface Etapa {
  id: string;
  ordem: number;
  descricao: string;
  tempoExecucaoSegundos: number;
}

export interface Exercicio {
  id: string;
  ordem: number;
  nome: string;
  livre: boolean;
  repeticoes?: number;
  modoDisparo: ModoDisparo;
  tempoPreparacaoSegundos?: number;
  etapas: Etapa[];
}

export interface Serie {
  id: string;
  ordem: number;
  nome?: string;
  quantidadeDeSeries: number;
  descansoEntreSeriesSegundos: number;
  exercicios: Exercicio[];
}

export type ItemDeTreino =
  | { tipo: 'serie'; serie: Serie }
  | { tipo: 'exercicio'; exercicio: Exercicio };

export interface Treino {
  id: string;
  nome: string;
  diasDaSemana: DiaDaSemana[];
  horarios: HoraDoDia[];
  itens: ItemDeTreino[];
  criadoEm: number;
  atualizadoEm: number;
}

export interface ResumoTreino {
  id: string;
  nome: string;
  diasDaSemana: DiaDaSemana[];
  horarios: HoraDoDia[];
  totalDeExercicios: number;
}

export const LIMITES = {
  nomeMinimo: 1,
  nomeMaximo: 80,
  descricaoMinima: 1,
  descricaoMaxima: 120,
} as const;

export function exercicioTemDuracaoPrevisivel(exercicio: Exercicio): boolean {
  return !exercicio.livre;
}

export function listarExerciciosDoTreino(treino: Treino): Exercicio[] {
  return treino.itens.flatMap((item) =>
    item.tipo === 'serie' ? item.serie.exercicios : [item.exercicio],
  );
}
