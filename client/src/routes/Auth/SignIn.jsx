import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

const SignIn = ({ history }) => {
  document.title = 'Forum | Sign In'
  const context = useContext(StoreContext)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const loginUserCallback = () => {
    loginUser()
  }

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  const loginUser = () => {
    if (loading) return

    setErrors({})

    if (!values.username) {
      return setErrors({ username: 'Enter your name' })
    }
    if (!values.password) {
      return setErrors({ password: 'Enter password' })
    }

    setLoading(true)

    fetch('http://localhost:8000' + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then(response => {
        setLoading(false)
        return response.json()
      })
      .then(data => {
        if (data.accessToken) {
          context.login(data)
          history.push('/user/' + data.user.id)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message })
      })
  }

  return (
    <Section>
      <Breadcrumbs current="Sign In" links={[
        { title: 'Home', link: '/' }
      ]} />

      <SectionHeader title="Log in account" />

      <form className="sign_form form_inner" onSubmit={onSubmit}>
        <FormCardItem title="Username" error={errors.username}>
          <div className={errors.username ? 'form_block error' : 'form_block' }>
            <Input
              name="username"
              value={values.username}
              maxLength="21"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title="Password" error={errors.password}>
          <div className={errors.password ? 'form_block error' : 'form_block' }>
            <Input
              type="password"
              name="password"
              value={values.password}
              maxLength="50"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item center">
          {loading
            ? <Loader className="btn" />
            : <InputButton text="Sign In" />}
        </div>

        <div className="card_item center text_reference">
          Or <Link className="flex_margin" to="/signup">Sign Up</Link> if you don't have an account.
        </div>
      </form>
    </Section>
  )
}

export default SignIn;
