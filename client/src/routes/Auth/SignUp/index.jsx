import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Input from 'components/Form/Input';
import FormCardItem from 'components/Card/FormCardItem';
import { InputButton } from 'components/Button';
import Loader from 'components/Loader';

import { REGISTER_USER } from 'support/Mutations';

const SignUp = ({ history }) => {
  document.title = 'Forum | Sign Up'
  const context = useContext(StoreContext)
  const [errors, setErrors] = useState({})

  const registerUser = () => {
    addUser()
  }

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
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
              required
              maxlength="21"
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
              required
              maxlength="56"
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

        <FormCardItem title="Confirm password" error={errors.confirmPassword}>
          <div className={errors.confirmPassword ? 'form_block error' : 'form_block' }>
            <Input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
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
