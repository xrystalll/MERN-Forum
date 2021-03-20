import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const addValue = (data) => {
    setValues({ ...values, [data.name]: data.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    callback()
  }

  return {
    onChange,
    addValue,
    onSubmit,
    values,
    reset: () => setValues(initialState)
  }
};
