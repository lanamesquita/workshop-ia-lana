import type { Treino } from '../../dominio/modelo/prescricao';

/**
 * Treino do material de origem. Existe para que a execução (US1) seja testável
 * sem depender das telas de cadastro (US2).
 *
 * Expansão esperada: 36 itens e 128 segundos planejados.
 */
export function criarTreinoExemplo(agora: number = Date.now()): Treino {
  return {
    id: 'treino-exemplo',
    nome: 'Treino de fisio Lana',
    diasDaSemana: ['segunda', 'quarta', 'sexta'],
    horarios: [
      { hora: 8, minuto: 0 },
      { hora: 13, minuto: 0 },
      { hora: 18, minuto: 0 },
    ],
    criadoEm: agora,
    atualizadoEm: agora,
    itens: [
      {
        tipo: 'serie',
        serie: {
          id: 'serie-unica',
          ordem: 0,
          nome: 'Série única',
          quantidadeDeSeries: 1,
          descansoEntreSeriesSegundos: 0,
          exercicios: [
            {
              id: 'ex-contrair',
              ordem: 0,
              nome: 'Contrair',
              livre: false,
              repeticoes: 8,
              modoDisparo: 'manual',
              etapas: [
                {
                  id: 'ex-contrair-e1',
                  ordem: 0,
                  descricao: 'Contrai e segura',
                  tempoExecucaoSegundos: 7,
                },
                {
                  id: 'ex-contrair-e2',
                  ordem: 1,
                  descricao: 'Descansa',
                  tempoExecucaoSegundos: 4,
                },
              ],
            },
            {
              id: 'ex-contrai-relaxa',
              ordem: 1,
              nome: 'Contrai/Relaxa',
              livre: false,
              repeticoes: 10,
              modoDisparo: 'manual',
              etapas: [
                {
                  id: 'ex-contrai-relaxa-e1',
                  ordem: 0,
                  descricao: 'Contrai',
                  tempoExecucaoSegundos: 2,
                },
                {
                  id: 'ex-contrai-relaxa-e2',
                  ordem: 1,
                  descricao: 'Relaxa',
                  tempoExecucaoSegundos: 2,
                },
              ],
            },
          ],
        },
      },
    ],
  };
}
