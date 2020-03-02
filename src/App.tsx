/* eslint-disable operator-linebreak */
import React from 'react'
import './App.css'
import { PageHeader, Button } from 'antd'
import { useMachine } from '@xstate/react'
import { fetchPeople, fetchPlanets } from './api'
import { fetchMachine } from './machines/fetch'
import { matchingMachine } from './machines/matching'

const App = () => {
  const [matchingState, sendToMatchMachine] = useMachine(matchingMachine, {
    guards: {
      isCorrect: ctx => {
        return ctx.topSelectedItem.homeworld === ctx.bottomSelectedItem.url
      },
    },
  })
  console.log(matchingState.value)
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
              fetchPlanetState.context.results.map((planet, index) => (
                <li key={index}>
                  <button
                    style={{
                      backgroundColor:
                        matchingState.context.topSelectedItem === planet
                          ? 'lightblue'
                          : '',
                    }}
                    onClick={() =>
                      sendToMatchMachine({
                        type: 'SELECT_TOP',
                        selectedItem: planet,
                      })
                    }
                  >
                    {planet.name}
                  </button>
                </li>
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
                <li key={index}>
                  <button
                    style={{
                      backgroundColor:
                        matchingState.context.bottomSelectedItem === person
                          ? 'red'
                          : '',
                    }}
                    onClick={() =>
                      sendToMatchMachine({
                        type: 'SELECT_BOTTOM',
                        selectedItem: person,
                      })
                    }
                  >
                    {person.name}
                  </button>
                </li>
              ))}
          </ul>
        ) : null}
        {fetchPeopleState.matches('failed')
          ? fetchPeopleState.context.errorMessage
          : null}
      </div>
      {matchingState.matches('submitted.correct') ? <p>Correct</p> : null}
      {matchingState.matches('submitted.incorrect') ? <p>Incorrect</p> : null}
    </div>
  )
}

export default App
