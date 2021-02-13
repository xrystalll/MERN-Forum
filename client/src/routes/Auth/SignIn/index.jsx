import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

import { LOGIN_USER } from 'support/Mutations';

const SignIn = ({ history }) => {
  document.title = 'Forum | Sign In'
  const context = useContext(StoreContext)
  const [errors, setErrors] = useState({})

  const loginUserCallback = () => {
    loginUser()
  }

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData)
      history.push('/user/' + userData.id)
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

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
              required
              maxlength="21"
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
              required
              maxlength="56"
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
