/* eslint-disable operator-linebreak */
import React from 'react'
import './App.css'
import { PageHeader, Button } from 'antd'
import { useMachine } from '@xstate/react'
import { fetchPeople } from './api'
import { fetchMachine } from './machines/fetch'

const App = () => {
  const [fetchState, sendToFetchMacnine] = useMachine(fetchMachine, {
    actions: {
      fetchData: async (ctx, event) => {
        try {
          const r = await fetchPeople()
          sendToFetchMacnine({ type: 'RESOLVE', results: r.results })
        } catch (message) {
          sendToFetchMacnine({ type: 'REJECT', message })
        }
      },
    },
  })
  return (
    <div>
      <PageHeader
        title="Get data"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => sendToFetchMacnine({ type: 'FETCH' })}
          >
            Fetch
          </Button>,
        ]}
      />
      {fetchState.matches('pending') ? <p>Loading</p> : null}
      {fetchState.matches('successful') ? (
        <ul>
          {fetchState.context.results &&
            fetchState.context.results.map((person, index) => (
              <li key={index}>{person.name}</li>
            ))}
        </ul>
      ) : null}
      {fetchState.matches('failed') ? fetchState.context.errorMessage : null}
    </div>
  )
}

export default App
