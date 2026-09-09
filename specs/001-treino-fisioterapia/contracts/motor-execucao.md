# Contrato — Motor de Execução

**Feature**: 001 | **Fase**: Phase 1

Contrato da camada que concentra os Princípios II e III da constitution. É a fronteira mais
importante do sistema: tudo o que depende de tempo vive aqui e **nada aqui importa React,
React Native ou banco de dados**.

## Forma

```ts
type Relogio = { agora(): number };  // milissegundos absolutos, injetável

type Evento =
  | { tipo: 'iniciarSessao'; treino: Treino; instante: number }
  | { tipo: 'dispararExercicio' }        // botão de início em tela
  | { tipo: 'iniciarAgora' }             // durante a preparação
  | { tipo: 'adiar' }                    // durante a preparação
  | { tipo: 'pausar' }
  | { tipo: 'retomar' }
  | { tipo: 'pularItemAtual' }
  | { tipo: 'marcarItem'; indice: number; concluido: boolean }
  | { tipo: 'concluirExercicioLivre' }
  | { tipo: 'sincronizar' };             // recalcula pelo relógio

reduzir(estado: EstadoSessao, evento: Evento, relogio: Relogio):
  { estado: EstadoSessao; efeitos: Efeito[] }
```

`Efeito` descreve o que o mundo externo deve fazer — `emitirSinal`, `persistirSessao`,
`manterTelaAcesa`, `liberarTela` — sem que o motor execute nada disso. É o que mantém a função
pura e testável.

## Consultas derivadas

```ts
porcentagemConcluida(estado): number          // 0 a 1
tempoRestanteSegundos(estado): { valor: number; estimado: boolean }
itemAtual(estado): ItemExecucao | undefined
itensParaTimeline(estado): ItemExecucao[]
```

`estimado` é verdadeiro quando há exercício livre pendente, já que a duração é desconhecida.

## Invariantes

Estas propriedades MUST valer após qualquer sequência de eventos e são o alvo direto dos testes:

1. **Tempo absoluto**: o estado resultante de `sincronizar` depende apenas de `relogio.agora()` e
   dos instantes registrados — nunca da quantidade de chamadas. Chamar `sincronizar` mil vezes ou
   uma vez, para o mesmo instante, produz estados idênticos.
2. **Salto múltiplo**: um `sincronizar` após longo intervalo resolve todos os itens vencidos de
   uma vez e para no primeiro item que exija disparo manual.
3. **Disparo manual soberano**: nenhum evento, exceto `dispararExercicio`, tira a sessão de
   `AguardandoDisparo`.
4. **Relógio parado na espera**: em `AguardandoDisparo` e `Pausada`, o tempo decorrido não é
   contabilizado no tempo restante nem consome duração de item.
5. **Monotonia do índice**: `indiceAtual` nunca retrocede.
6. **Pulado fora do total**: `porcentagemConcluida` ignora itens `pulado` no numerador e no
   denominador.
7. **Terminalidade**: `Concluida` e `Abandonada` não respondem a nenhum evento além de iniciar
   nova sessão.
8. **Precisão**: para qualquer item de duração `d`, o instante de resolução não difere de
   `iniciadoEm + d` em mais do que o maior valor entre 1% de `d` e 200 ms (SC-002).

## Fora do contrato

O motor não conhece som, vibração, tela, navegação nem persistência. Ele apenas declara efeitos.
