import type { CodigoErro } from '../dominio/modelo/validacoes';

export const TEXTOS = {
  app: {
    nome: 'Meu Treino de Fisioterapia',
  },
  listaDeTreinos: {
    titulo: 'Meus treinos',
    vazio: 'Nenhum treino cadastrado ainda.',
    criar: 'Criar treino',
    editar: 'Editar',
    excluir: 'Excluir',
    confirmarExclusao: 'Excluir este treino? Esta ação não pode ser desfeita.',
  },
  execucao: {
    iniciarExercicio: 'Iniciar exercício',
    iniciarAgora: 'Iniciar agora',
    adiar: 'Adiar',
    pausar: 'Pausar',
    retomar: 'Retomar',
    pular: 'Pular',
    concluir: 'Concluir',
    preparacao: 'Preparação',
    descanso: 'Descanso entre séries',
    aguardandoDisparo: 'Toque para iniciar quando estiver pronta',
    semTempoPrevisto: 'Sem tempo previsto',
    tempoRestante: 'Tempo restante',
    tempoRestanteEstimado: 'Tempo restante (estimado)',
    concluido: 'Concluído',
    pulado: 'Pulado',
    pendente: 'Pendente',
    emExecucao: 'Em execução',
  },
  retomada: {
    pergunta: 'Você tem um treino em andamento de hoje.',
    retomar: 'Retomar de onde parei',
    recomecar: 'Recomeçar do zero',
  },
  encerramento: {
    titulo: 'Treino concluído',
    itensPulados: (n: number) =>
      n === 0
        ? 'Nenhum item foi pulado.'
        : n === 1
          ? '1 item foi pulado.'
          : `${n} itens foram pulados.`,
  },
  lembretes: {
    permissaoNegada:
      'Sem permissão para notificações. Os lembretes não serão enviados, mas o treino continua funcionando normalmente.',
    falhaAoAgendar:
      'Não foi possível agendar os lembretes. O treino continua funcionando normalmente.',
  },
  configuracoes: {
    titulo: 'Configurações',
    exportar: 'Exportar meus dados',
    apagar: 'Apagar todos os dados',
    confirmarApagar: 'Apagar todos os treinos e sessões? Esta ação não pode ser desfeita.',
  },
} as const;

export const MENSAGENS_DE_ERRO: Record<CodigoErro, string> = {
  nomeObrigatorio: 'Informe um nome.',
  nomeForaDoLimite: 'O nome deve ter no máximo 80 caracteres.',
  descricaoObrigatoria: 'Informe a descrição da etapa.',
  descricaoForaDoLimite: 'A descrição deve ter no máximo 120 caracteres.',
  quantidadeDeSeriesInvalida: 'A quantidade de séries deve ser 1 ou mais.',
  descansoEntreSeriesInvalido: 'O descanso entre séries não pode ser negativo.',
  descansoEntreSeriesObrigatorio:
    'Informe o descanso entre séries quando houver mais de uma série.',
  repeticoesInvalidas: 'A quantidade de repetições deve ser 1 ou mais.',
  tempoExecucaoInvalido: 'O tempo da etapa deve ser maior que zero.',
  etapasObrigatorias: 'Adicione ao menos uma etapa.',
  tempoPreparacaoObrigatorio:
    'Informe um tempo de preparação maior que zero para o disparo automático.',
  tempoPreparacaoNaoSeAplica: 'O tempo de preparação só se aplica ao disparo automático.',
  exerciciosObrigatorios: 'Adicione ao menos um exercício à série.',
  diaDaSemanaObrigatorio: 'Escolha ao menos um dia da semana para os horários informados.',
  horarioDuplicado: 'Há horários repetidos.',
};
