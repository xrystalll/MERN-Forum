import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';

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
      history.push('/')
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
            <div className="card_outside_title">Username</div>

            <div className={!!errors.username ? 'form_block error' : 'form_block' }>
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
            <div className="card_outside_title">Email address</div>

            <div className={!!errors.email ? 'form_block error' : 'form_block' }>
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
            <div className="card_outside_title">Password</div>

            <div className={!!errors.password ? 'form_block error' : 'form_block' }>
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
            <div className="card_outside_title">Password</div>

            <div className={!!errors.confirmPassword ? 'form_block error' : 'form_block' }>
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

        {Object.keys(errors).length > 0 && (
          <div className="card_item">
            <ul>
              {Object.values(errors).map((value, index) => (
                <li key={index} className="errors_list">{value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="card_item center">
          <input className="btn" type="submit" value="Create account" disabled={loading} />
        </div>

        <div className="card_item center text_reference">
          Or <Link className="flex_margin" to="/signin">Sign In</Link> if you already have an account.
        </div>
      </form>
    </Section>
  )
}

export default SignUp;
