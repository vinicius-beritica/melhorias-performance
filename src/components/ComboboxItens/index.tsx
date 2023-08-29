/* eslint-disable no-extra-semi */
import React from 'react'
import { Pessoa } from '../../types/Pessoa'
import { Carregando } from '../Carregando'
import { ListaPessoas } from '../ListaPessoas'
import { ResultadosNaoEncontrados } from '../ResultadosNaoEncontrados'
import { memo } from 'react'

type ComboboxItensProps = {
  query: string
  loading: boolean
  pessoas: Pessoa[]
}
// eslint-disable-next-line react-refresh/only-export-components
const ComboboxItens: React.FC<ComboboxItensProps> = React.memo(
  ({ query, loading, pessoas }) => {
    if (loading) {
      return <Carregando />
    }
    if (query && pessoas.length === 0) {
      <ResultadosNaoEncontrados />
    }

    return <ListaPessoas pessoas={pessoas} />
  }
)

// eslint-disable-next-line react-refresh/only-export-components
export default memo(ComboboxItens)
