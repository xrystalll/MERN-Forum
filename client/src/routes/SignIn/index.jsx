import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { StoreContext } from 'store/Store';
import { useForm } from 'hooks/useForm';

import { Section, SectionHeader } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';

const LOGIN_USER = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      createdAt
      token
      picture
      role
    }
  }
`;

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
      history.push('/')
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
        <div className="card_item">
          <div className="card_body">
            <div className="card_outside_title">Username or Email</div>

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
          <input className="btn" type="submit" value="Sign In" disabled={loading} />
        </div>

        <div className="card_item center text_reference">
          Or <Link className="flex_margin" to="/signup">Sign Up</Link> if you don't have an account.
        </div>
      </form>
    </Section>
  )
}

export default SignIn;
