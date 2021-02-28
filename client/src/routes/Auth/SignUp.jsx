import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { BACKEND } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

const SignUp = ({ history }) => {
  document.title = 'Forum | Sign Up'
  const context = useContext(StoreContext)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const registerUserCallback = () => {
    registerUser()
  }

  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const registerUser = () => {
    if (loading) return

    setErrors({})

    if (!values.username) {
      return setErrors({ username: 'Enter your name' })
    }
    if (!values.email) {
      return setErrors({ email: 'Enter email' })
    }
    if (!values.password) {
      return setErrors({ password: 'Enter password' })
    }
    if (values.password !== values.confirmPassword) {
      return setErrors({ confirmPassword: 'Passwords not match' })
    }

    setLoading(true)

    const { confirmPassword, ...body } = values

    fetch(BACKEND + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
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
      <Breadcrumbs current="Sign Up" links={[
        { title: 'Home', link: '/' }
      ]} />

      <SectionHeader title="Create your account" />

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

        <FormCardItem title="Email address" error={errors.email}>
          <div className={errors.email ? 'form_block error' : 'form_block' }>
            <Input
              type="email"
              name="email"
              value={values.email}
              maxLength="50"
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

        <FormCardItem title="Confirm password" error={errors.confirmPassword}>
          <div className={errors.confirmPassword ? 'form_block error' : 'form_block' }>
            <Input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
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
            : <InputButton text="Create account" />}
        </div>

        <div className="card_item center text_reference">
          Or <Link className="flex_margin" to="/signin">Sign In</Link> if you already have an account.
        </div>
      </form>
    </Section>
  )
}

export default SignUp;
