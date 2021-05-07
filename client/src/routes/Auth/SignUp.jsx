import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { useForm } from 'hooks/useForm';

import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

const SignUp = ({ history }) => {
  const { login, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.signUp[lang]
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const registerUserCallback = () => {
    if (loading) return

    setErrors({})

    if (!values.username.trim()) {
      return setErrors({ username: Strings.enterYourName[lang] })
    }
    if (!values.email.trim()) {
      return setErrors({ email: Strings.enterEmail[lang] })
    }
    if (!values.password.trim()) {
      return setErrors({ password: Strings.enterPassword[lang] })
    }
    if (values.password.trim() !== values.confirmPassword) {
      return setErrors({ confirmPassword: Strings.passwordsNotMatch[lang] })
    }

    setLoading(true)

    registerUser()
  }

  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const registerUser = () => {
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
          login(data)
          history.push('/user/' + data.user.name)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message })
      })
  }

  return (
    <Section>
      <Breadcrumbs current={Strings.signUp[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <SectionHeader title={Strings.createYourAccount[lang]} />

      <form className="sign_form form_inner" onSubmit={onSubmit}>
        <FormCardItem title={Strings.username[lang]} error={errors.username}>
          <div className={errors.username ? 'form_block error' : 'form_block' }>
            <Input
              name="username"
              value={values.username}
              maxLength="21"
              onChange={onChange}
            />
          </div>
        </FormCardItem>

        <FormCardItem title={Strings.emailAddress[lang]} error={errors.email}>
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

        <FormCardItem title={Strings.password[lang]} error={errors.password}>
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

        <FormCardItem title={Strings.confirmPassword[lang]} error={errors.confirmPassword}>
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
            : <InputButton text={Strings.createAccount[lang]} />
          }
        </div>

        <div className="card_item center text_reference">
          {Strings.or[lang]} <Link className="flex_margin" to="/signin">{Strings.signIn[lang]}</Link> {Strings.ifYouAlreadyHaveAnAccount[lang]}.
        </div>
      </form>
    </Section>
  )
}

export default SignUp;
