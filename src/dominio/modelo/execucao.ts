export type TipoItemExecucao = 'preparacao' | 'etapa' | 'descanso' | 'exercicioLivre';

export type EstadoItem = 'pendente' | 'emExecucao' | 'concluido' | 'pulado';

export type EstadoSessao =
  | 'aguardandoDisparo'
  | 'emPreparacao'
  | 'emExecucao'
  | 'pausada'
  | 'concluida'
  | 'abandonada';

export interface OrigemItem {
  serieId?: string;
  repeticaoDaSerie?: number;
  exercicioId: string;
  repeticaoDoExercicio?: number;
  etapaId?: string;
}

export interface ItemExecucao {
  indice: number;
  tipo: TipoItemExecucao;
  /** Ausente em `exercicioLivre`, que não tem duração previsível. */
  duracaoPlanejadaSegundos?: number;
  estado: EstadoItem;
  iniciadoEm?: number;
  resolvidoEm?: number;
  exigeDisparoManual: boolean;
  origem: OrigemItem;
  rotulo: string;
}

export interface Sessao {
  id: string;
  treinoId: string;
  /** Dia local no formato AAAA-MM-DD; base da regra de retomada. */
  dataLocal: string;
  iniciadaEm: number;
  finalizadaEm?: number;
  estado: EstadoSessao;
  indiceAtual: number;
  itens: ItemExecucao[];
}

export const ESTADOS_TERMINAIS: readonly EstadoSessao[] = ['concluida', 'abandonada'];

export function sessaoEstaTerminada(sessao: Sessao): boolean {
  return ESTADOS_TERMINAIS.includes(sessao.estado);
}

export function itemFoiResolvido(item: ItemExecucao): boolean {
  return item.estado === 'concluido' || item.estado === 'pulado';
}

export function dataLocalDe(instante: number): string {
  const d = new Date(instante);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
