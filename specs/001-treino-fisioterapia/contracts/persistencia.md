# Contrato — Persistência

**Feature**: 001 | **Fase**: Phase 1

Fronteira entre as regras de domínio e o armazenamento local. Existe para que SQLite seja um
detalhe substituível e para que os testes de integração rodem contra um banco em memória.

## Interfaces

```ts
interface RepositorioDeTreinos {
  listar(): Promise<ResumoTreino[]>;
  obter(id: string): Promise<Treino | undefined>;
  salvar(treino: Treino): Promise<Treino>;   // cria ou atualiza, com itens aninhados
  remover(id: string): Promise<void>;
  doDiaDaSemana(dia: DiaDaSemana): Promise<ResumoTreino[]>;
}

interface RepositorioDeSessoes {
  emAndamento(treinoId: string): Promise<Sessao | undefined>;
  criar(treinoId: string, itens: ItemExecucao[], instante: number): Promise<Sessao>;
  atualizar(sessao: Sessao): Promise<void>;   // chamado a cada transição de item
  abandonar(sessaoId: string, instante: number): Promise<void>;
}

interface RepositorioDeLembretes {
  doTreino(treinoId: string): Promise<Lembrete[]>;
  substituirDoTreino(treinoId: string, lembretes: Lembrete[]): Promise<void>;
}

interface ExportacaoDeDados {
  exportarTudo(): Promise<string>;   // documento legível com toda a base
  apagarTudo(): Promise<void>;
}
```

## Garantias exigidas

- **Atomicidade da prescrição**: `salvar` grava treino, séries, exercícios e etapas em uma única
  transação. Um salvamento parcial que deixe uma série sem exercícios MUST NOT ser possível.
- **Ordenação estável**: a leitura devolve séries, exercícios e etapas na mesma ordem em que
  foram gravados, com posições contíguas.
- **Imutabilidade da sessão**: editar um treino MUST NOT alterar sessões já criadas.
- **Custo da atualização**: `atualizar` é chamado a cada transição de item durante o treino e
  MUST NOT reescrever a prescrição, apenas o estado da sessão.
- **Migrações versionadas**: toda mudança de esquema tem migração numerada e idempotente.
- **Sem rede**: nenhuma operação depende de conectividade (FR-034, FR-035).

## Requisitos atendidos

FR-001, FR-006, FR-025, FR-025a, FR-025b, FR-034, FR-035, FR-036.
