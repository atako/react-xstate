import { Machine, assign } from 'xstate'

interface FetchStates {
  states: {
    idle: {}
    pending: {}
    successful: {
      states: {
        unknown: {}
        withData: {}
        withoutData: {}
      }
    }
    failed: {}
  }
}

type FetchMachineEvents =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; results: any[] }
  | { type: 'REJECT'; message: string }

interface FetchContext {
  results: any[]
  errorMessage: string
}

export const fetchMachine = Machine<
  FetchContext,
  FetchStates,
  FetchMachineEvents
>(
  {
    id: 'fetch',
    initial: 'idle',
    context: {
      results: [],
      errorMessage: '',
    },
    states: {
      idle: {
        on: {
          FETCH: 'pending',
        },
      },
      pending: {
        invoke: {
          src: 'fetchData',
          onDone: { target: 'successful' },
          onError: { target: 'failed' },
        },
      },
      failed: {
        entry: ['setMessage'],
        on: {
          FETCH: 'pending',
        },
      },
      successful: {
        entry: ['setResults'],
        initial: 'unknown',
        on: { FETCH: 'pending' },
        states: {
          unknown: {
            on: {
              '': [
                {
                  target: 'withData',
                  cond: 'hasData',
                },
                {
                  target: 'withoutData',
                },
              ],
            },
          },
          withData: {},
          withoutData: {},
        },
      },
    },
  },
  {
    actions: {
      setResults: assign((ctx, event: any) => ({
        results: event.data,
      })),
      setMessage: assign((ctx, event: any) => ({
        errorMessage: event.data,
      })),
    },
    guards: {
      hasData: (ctx, event: any) => {
        return ctx.results && ctx.results.length > 0
      },
    },
  }
)
