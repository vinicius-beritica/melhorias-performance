import faker from '@faker-js/faker'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'

const iniciaInputs = (quantidade: number = 1) =>
  Array.from(Array(quantidade).keys()).map(() => ({
    id: faker.datatype.uuid(),
    value: faker.name.firstName(),
  }))

export const ListKeys = () => {
  const [inputs, setInputs] = useState(iniciaInputs())

  const addInput = () => {
    setInputs((inputs) => [
      {
        id: faker.datatype.uuid(),
        value: faker.name.firstName(),
      },
      ...inputs,
    ])
  }

  return (
    <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10'>
          <Button onClick={addInput}>adiciona input</Button>
          {inputs.map((input) => (
            <Input key={input.id} label={input.value} name={input.value} />
          ))}
        </div>
      </div>
    </div>
  )
}
