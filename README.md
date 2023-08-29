# Otimizações - Semana 7

A prosposta para essa atividade é realizar no mínimo 3 melhorias de performance para os componentes/containers. Abaixo seguem a melhorias realizadas nos componentes:

### ContatorComErros

Ambos os botões estavam renderizando sempre que pressionados. Desta forma, foi removido o estado `contador` como dependência das funções `incrementa` e `decrementa`. Ambas as funções foram envolvidas no hook `useCallback` para não serem instanciadas novamente entre as renderizações, simultaneamente.

```ts
const incrementa = useCallback(() => {
  setContador((prevContador) => prevContador + 1)
}, [])
const decrementa = useCallback(() => {
  setContador((prevContador) => prevContador - 1)
}, [])
```

E no componente `Button` foi utilizado o `memo` para evitar as renderizações desnecessárias.

```ts
export const Button: React.FC<InputHTMLAttributes<HTMLButtonElement>> =
  React.memo((props) => (
    <button
      onClick={props.onClick}
      className='my-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
    >
      {props.children}
    </button>
  ))
```

O componente `Error` de mensagem de erro era sempre renderizado assim que um dos botões era pressionado. Dessa forma, na função do componente foi inserido o `memo` para não re-renderizar sempre que os botões são pressionados.

```ts
const Error: React.FC = memo(({ children }) => {
  console.log('===== renderiza erro', children)
  return (
    <h1 className='text-center text-red-500 text-base font-medium'>
      {children}
    </h1>
  )
})
```

Também foi removido da função setErros o spread operator do estado `erros` para não ficar sempre renderizando uma nova mensagem de erro no array. E inserida uma condicional para que a mensagem de erro não fique imprimindo quando já tiver valor.

```ts
useEffect(() => {
  if (contador < 0) {
    if (erros.length === 0) {
      setErros([
        {
          id: faker.datatype.uuid(),
          erro: 'Contador não pode ser menor que zero',
        },
      ])
    }
  } else if (contador > 10) {
    if (erros.length === 0) {
      setErros([
        {
          id: faker.datatype.uuid(),
          erro: 'Contador não pode ser maior que dez',
        },
      ])
    }
  } else {
    setErros([])
  }
}, [contador])
```

### ColorResponsive:

Estava renderizando duas vezes ao iniciar o componente `ColorResponsive` ou a cada redimensionamento de tela.

Para evitar a re-renderização do componente ao inicializar a aplicação, o estado `color` foi inicializado diretamente com o valor calculado pela função `alteraCor`, em vez de atualizá-lo posteriormente com a função `setColor`.

```ts
export const ColorResponsive = () => {
  const widthInitial = window.innerWidth
  const indexInitial = breakpoints.findIndex(
    (breakpoint) => widthInitial < breakpoint
  )
  const breakInitial = indexInitial === -1 ? 0 : indexInitial
  const [color, setColor] = useState(colors[breakInitial])
```

As re-renderizações extras eram por conta das atualizações desnecessárias do estado `color`. Cada vez que chama a função `setColor`, realizava a re-renderização do componente. Agora é verificado se o novo valor do estado `color` é diferente do valor anterior antes de chamar a função `setColor`.

```ts
useEffect(() => {
  const alteraCor = () => {
    const width = window.innerWidth
    const index = breakpoints.findIndex((breakpoint) => width < breakpoint)
    const breakpointIndex = index === -1 ? 0 : index
    const newColor = colors[breakpointIndex]
    if (newColor !== color) {
      setColor(newColor)
    }
  }
  alteraCor()
  window.addEventListener('resize', alteraCor)
  return () => {
    window.removeEventListener('resize', alteraCor)
  }
}, [color])
```

### ListKeys

A cada inserção de campo input, o componente `ListKeys` era atualizado e um novo array era adicionado com o novo input.

Foi criado o objeto para guardar a chave de cada input, assim podendo identificar quais são os novos inputs, sem alterar os anteriores.

```ts
const iniciaInputs = (quantidade: number = 1) =>
  Array.from(Array(quantidade).keys()).map(() => ({
    id: faker.datatype.uuid(),
    value: faker.name.firstName(),
  }))
```

```ts

  const addInput = () => {
    setInputs((inputs) => [
      {
        id: faker.datatype.uuid(),
        value: faker.name.firstName(),
      },
      ...inputs,
    ])

```

Também foi adicionado o `memo` no componente `Input` para não re-renderizar a lista de input.

```ts
export const Input: React.FC<InputProps> = memo(({ label, name }) => (
  <div>
    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <div className='mt-1'>
      <input
        name={name}
        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      />
    </div>
  </div>
))
```

### CampoDeBusca

O campo de busca sempre renderizava ao clique do campo e os itens da lista a cada digitação.
Implementado o hook personalizado `useDebounce`.

```ts
export const useDebounce = (delay: number) => {
{ ... }
  return debouncedFn
}
```
Os useEffect's de `buscaPessoas`, filtro de pessoas e no onChange do componente `Combobox.Input` foram envolvidos com o `debouncedChange`

Utilizado o hook `useCallback` em `buscaPessoas` para memorizar a função e evitar renderizações desnecessárias dos componentes filhos.

```ts 

const buscaPessoas = useCallback(async () => {...

```

Implementada uma nova função para memorizar o resultado do filtro de pessoas.

```ts 
  const filtroPessoas = useMemo(() => {
    if (!query) {
      return allPessoas
    } else {
      return allPessoas.filter((pessoa) => pessoa.name.first.includes(query))
    }
  }, [query, pessoas])

```
Usado também o `memo` para evitar renderizações desnecessárias do componente `ComboboxItens`.

```ts
const ComboboxItens = React.memo(({ query, pessoas, loading }) => {
  {...}
})

```

### Button e Input

EM ambos os componentes, que contemplam em outros containers, foi implementado o `memo` para evitar renderizações desnecessárias e que refletiram nos outros componentes (citados acima).
```ts
export const Button: React.FC<InputHTMLAttributes<HTMLButtonElement>> =
  React.memo((props) => (
  { ... }
  ))
```
```ts

export const Input: React.FC<InputProps> = memo(({ label, name }) => (
  { ... }
))
```
