// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }
  static getDerivedStateFromError(error) {
    return {hasError: true}
  }

  render() {
    const {hasError} = this.state
    console.log(hasError)
    if (hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  //   const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) return

    setState(prevState => ({...prevState, status: 'pending'}))
    const fetchData = async () => {
      try {
        const response = await fetchPokemon(pokemonName)
        setState(prevState => ({
          ...prevState,
          status: 'resolved',
          pokemon: response,
        }))
      } catch (err) {
        setState(prevState => ({
          ...prevState,
          status: 'rejected',
          error: err.message,
        }))
      }
    }
    fetchData()
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
      </div>
    )
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={null} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
