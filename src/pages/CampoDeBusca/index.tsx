import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { GetUserResponse, Pessoa } from '../../types/Pessoa'
import ComboboxItens from '../../components/ComboboxItens'
import { useDebounce } from '../../hooks/useDebounce'

export function CampoDeBusca() {
  const queryRef = useRef<string>()
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [allPessoas, setAllPessoas] = useState<Pessoa[]>([])

  const debouncedChange = useDebounce(1000)

  const buscaPessoas = useCallback(async () => {
    setLoading(true)
    const response = await fetch(
      `https://randomuser.me/api/?results=100&nat=br`
    )
    const lista: GetUserResponse = await response.json()
    setAllPessoas(lista.results)
    setPessoas(lista.results)
    setLoading(false)
  }, [])

  // Carrega os dados da api sempre que inicializada a tela
  useEffect(() => {
    debouncedChange(buscaPessoas)
  }, [])

  console.log('queryRef.current', queryRef.current)

  // toda vez que query alterar, guarda o valor antigo
  useEffect(() => {
    queryRef.current = query
  }, [query])

  //Estava gerando sempre uma renderização quando é digitado
  useEffect(() => {
    if (!query) {
      setPessoas(allPessoas)
    } else if (query && query !== queryRef.current) {
      debouncedChange(() =>
        setPessoas((pessoas) =>
          pessoas.filter((pessoa) => pessoa.name.first.includes(query))
        )
      )
    }
  }, [])
  // Memoriza o resultado da filtragem de pessoas por nome
  const filtroPessoas = useMemo(() => {
    if (!query) {
      return allPessoas
    } else {
      return allPessoas.filter((pessoa) => pessoa.name.first.includes(query))
    }
  }, [query, pessoas])

  return (
    <div className='py-12 sm:px-6 lg:px-8'>
      <h1 className='text-center text-2xl mb-2 text-color text-purple-600'>{`${filtroPessoas.length} registros encontrados`}</h1>
      <Combobox
        as='div'
        className='mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'
        value={query}
        onBlur={() => !query && buscaPessoas()}
      >
        <Combobox.Input
          className='w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm'
          placeholder=''
          onChange={(event) =>
            debouncedChange(() => setQuery(event.target.value))
          }
        />
        <ComboboxItens
          query={query}
          pessoas={filtroPessoas}
          loading={loading}
        />
      </Combobox>
    </div>
  )
}
