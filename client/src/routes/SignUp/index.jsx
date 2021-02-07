import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import Loader from 'components/Loader';

const REGISTER_USER = gql`
  mutation($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(
      registerInput: { username: $username, email: $email, password: $password, confirmPassword: $confirmPassword }
    ) {
      id
      username
      createdAt
      token
      picture
      role
    }
  }
`;

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
        <div className="card_item">
          <div className="card_body">
            <div className="card_outside_title">
              Username
              {errors.username && <span className="form_error">{errors.username}</span>}
            </div>

            <div className={errors.username ? 'form_block error' : 'form_block' }>
              <input
                className="input_area"
                type="text"
                name="username"
                value={values.username}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div className="card_item">
          <div className="card_body">
            <div className="card_outside_title">
              Email address
              {errors.email && <span className="form_error">{errors.email}</span>}
            </div>

            <div className={errors.email ? 'form_block error' : 'form_block' }>
              <input
                className="input_area"
                type="email"
                name="email"
                value={values.email}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div className="card_item">
          <div className="card_body">
            <div className="card_outside_title">
              Password
              {errors.password && <span className="form_error">{errors.password}</span>}
            </div>

            <div className={errors.password ? 'form_block error' : 'form_block' }>
              <input
                className="input_area"
                type="password"
                name="password"
                value={values.password}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div className="card_item">
          <div className="card_body">
            <div className="card_outside_title">
              Confirm password
              {errors.confirmPassword && <span className="form_error">{errors.confirmPassword}</span>}
            </div>

            <div className={errors.confirmPassword ? 'form_block error' : 'form_block' }>
              <input
                className="input_area"
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item center">
          {loading
            ? <Loader className="btn" />
            : <input className="btn" type="submit" value="Create account" />}
        </div>

        <div className="card_item center text_reference">
          Or <Link className="flex_margin" to="/signin">Sign In</Link> if you already have an account.
        </div>
      </form>
    </Section>
  )
}

export default SignUp;
