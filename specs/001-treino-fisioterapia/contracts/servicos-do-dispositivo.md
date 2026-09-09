# Contrato — Serviços do Dispositivo

**Feature**: 001 | **Fase**: Phase 1

Adaptadores que traduzem os `Efeito` declarados pelo motor em ações no aparelho. Isolá-los atrás
de interfaces é o que permite testar a execução do treino sem dispositivo físico.

## Interfaces

```ts
interface SinalizadorDeTransicao {
  emitir(tipo: 'etapa' | 'repeticao' | 'descanso' | 'preparacao' | 'fim'): Promise<void>;
}

interface ControleDeTela {
  manterAcesa(): Promise<void>;
  liberar(): Promise<void>;
}

interface AgendadorDeLembretes {
  agendar(treino: Treino): Promise<ResultadoAgendamento>;
  cancelarDoTreino(treinoId: string): Promise<void>;
  permissaoConcedida(): Promise<boolean>;
}

type ResultadoAgendamento =
  | { sucesso: true; identificadores: string[] }
  | { sucesso: false; motivo: 'permissaoNegada' | 'falhaDoSistema' };

interface ObservadorDeCicloDeVida {
  aoVoltarParaPrimeiroPlano(callback: () => void): () => void;
}
```

## Garantias exigidas

- **Sinal redundante**: `emitir` dispara vibração e som em paralelo. Se um dos dois falhar ou
  estiver indisponível, o outro MUST ainda ocorrer, e a falha não interrompe o treino (FR-021).
- **Escopo da tela acesa**: `manterAcesa` vale apenas durante a execução; `liberar` MUST ser
  chamado ao concluir, pausar ou sair, inclusive em desmontagem abrupta da tela (FR-022a).
- **Lembrete não bloqueia**: `agendar` retornando `sucesso: false` gera aviso ao usuário e MUST
  NOT impedir criar, salvar ou executar o treino (FR-033).
- **Reagendamento**: salvar um treino cancela os lembretes anteriores antes de agendar os novos,
  para não acumular duplicatas.
- **Retorno ao primeiro plano**: o observador dispara `sincronizar` no motor, que é o gatilho do
  recálculo por tempo absoluto (FR-022).

## Requisitos atendidos

FR-021, FR-022, FR-022a, FR-033.
