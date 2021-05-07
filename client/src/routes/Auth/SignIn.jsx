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

const SignIn = ({ history }) => {
  const { login, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.signIn[lang]
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const loginUserCallback = () => {
    if (loading) return

    setErrors({})

    if (!values.username.trim()) {
      return setErrors({ username: Strings.enterYourName[lang] })
    }
    if (!values.password.trim()) {
      return setErrors({ password: Strings.enterPassword[lang] })
    }

    setLoading(true)

    loginUser()
  }

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  const loginUser = () => {
    fetch(BACKEND + '/auth/login', {
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
        if (data.ban) {
          localStorage.setItem('ban', data.ban.userId)
          history.push('/banned')
          return
        }
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
      <Breadcrumbs current={Strings.signIn[lang]} links={[
        { title: Strings.home[lang], link: '/' }
      ]} />

      <SectionHeader title={Strings.logInAccount[lang]} />

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

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item center">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.signIn[lang]} />
          }
        </div>

        <div className="card_item center text_reference">
          {Strings.or[lang]} <Link className="flex_margin" to="/signup">{Strings.signUp[lang]}</Link> {Strings.ifYouDontHaveAnAccount[lang]}.
        </div>
      </form>
    </Section>
  )
}

export default SignIn;
