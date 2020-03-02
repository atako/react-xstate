/* eslint-disable operator-linebreak */
import React from 'react'
import './App.css'
import { PageHeader, Button } from 'antd'
import { useMachine } from '@xstate/react'
import { fetchPeople, fetchPlanets } from './api'
import { fetchMachine } from './machines/fetch'

const App = () => {
  const [fetchPeopleState, sendToPeopleMachine] = useMachine(fetchMachine, {
    services: {
      fetchData: async (ctx, event) => {
        const r = await fetchPeople()
        return r.results
      },
    },
  })
  const [fetchPlanetState, sendToPlanetMachine] = useMachine(fetchMachine, {
    services: {
      fetchData: async (ctx, event) => {
        const r = await fetchPlanets()
        console.log('R:', r)
        return r.results
      },
    },
  })
  return (
    <div>
      <div>
        <PageHeader
          title="Planets"
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => sendToPlanetMachine({ type: 'FETCH' })}
            >
              Fetch planets
            </Button>,
          ]}
        />
        {fetchPlanetState.matches('pending') ? <p>Loading</p> : null}
        {fetchPlanetState.matches('successful.withData') ? (
          <ul>
            {fetchPlanetState.context.results &&
              fetchPlanetState.context.results.map((person, index) => (
                <li key={index}>{person.name}</li>
              ))}
          </ul>
        ) : null}
        {fetchPlanetState.matches('successful.withoutData') ? (
          <p>No results</p>
        ) : null}
        {fetchPlanetState.matches('failed')
          ? fetchPlanetState.context.errorMessage
          : null}
      </div>
      <div>
        <PageHeader
          title="Get peoples"
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => sendToPeopleMachine({ type: 'FETCH' })}
            >
              Fetch peoples
            </Button>,
          ]}
        />
        {fetchPeopleState.matches('pending') ? <p>Loading</p> : null}
        {fetchPeopleState.matches('successful') ? (
          <ul>
            {fetchPeopleState.context.results &&
              fetchPeopleState.context.results.map((person, index) => (
                <li key={index}>{person.name}</li>
              ))}
          </ul>
        ) : null}
        {fetchPeopleState.matches('failed')
          ? fetchPeopleState.context.errorMessage
          : null}
      </div>
    </div>
  )
}

export default App
