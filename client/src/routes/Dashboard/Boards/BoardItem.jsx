import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import { counter, declOfNum } from 'support/Utils';
import { useForm } from 'hooks/useForm';

import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { Button, InputButton } from 'components/Button';

const BoardItem = ({ data, editBoard, deleteBoard, fetchErrors, setFetchErros }) => {
  const [edit, setEdit] = useState(false)
  const [errors, setErrors] = useState({})

  const formCallback = () => {
    setErrors({})
    setFetchErros({})

    if (!values.name) {
      return setErrors({ name: 'Enter short name' })
    }
    if (!values.title) {
      return setErrors({ title: 'Enter title' })
    }
    if (!values.position || values.position <= 0) {
      return setErrors({ position: 'Enter position' })
    }

    setEdit(false)

    editBoard({
      boardId: data._id,
      name: values.name,
      title: values.title,
      body: values.body,
      position: values.position * 1
    })
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    name: data.name || '',
    title: data.title || '',
    body: data.body || '',
    position: data.position || 1
  })

  const deleteClick = () => {
    setEdit(false) 

    deleteBoard(data._id)
  }

  const close = () => {
    setEdit(false)
    setFetchErros({})
  }

  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <header className="card_head">
            <div className="card_head_inner">
              <Link to={'/boards/' + data.name} className="card_title">{data.title}</Link>
            </div>

            {!edit ? (
              <div className="edit_action_menu">
                <div className="action edit" onClick={() => setEdit(true)}>
                  <i className="bx bx-pencil"></i>
                </div>
                <div className="action delete" onClick={deleteClick}>
                  <i className="bx bx-trash-alt"></i>
                </div>
              </div>
            ) : (
              <div className="edit_action_menu">
                <div className="action cancel" onClick={close}>
                  <i className="bx bx-x"></i>
                </div>
              </div>
            )}
          </header>

          <footer className="card_foot">
            {!edit ? (
              <Fragment>
                <div className="act_btn foot_btn disable">
                  <i className="bx bx-news"></i>
                  <span className="card_count">{counter(data.threadsCount)}</span>
                  <span className="hidden">{declOfNum(data.threadsCount, ['thread', 'threads', 'threads'])}</span>
                </div>

                <div className="act_btn foot_btn disable">
                  <i className="bx bx-message-square-detail"></i>
                  <span className="card_count">{counter(data.answersCount)}</span>
                  <span className="hidden">{declOfNum(data.answersCount, ['answer', 'answers', 'answers'])}</span>
                </div>
              </Fragment>
            ) : (
              <form className="form_inner edit_form" onSubmit={onSubmit}>
                <FormCardItem title="Board short name*" error={errors.name}>
                  <div className={errors.name ? 'form_block error' : 'form_block' }>
                    <Input
                      name="name"
                      value={values.name}
                      placeholder="Enter short name"
                      maxLength="21"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                <FormCardItem title="Board title*" error={errors.title}>
                  <div className={errors.title ? 'form_block error' : 'form_block' }>
                    <Input
                      name="title"
                      value={values.title}
                      placeholder="Enter title"
                      maxLength="50"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                <FormCardItem title="Board description" error={errors.body}>
                  <div className={errors.body ? 'form_block error' : 'form_block' }>
                    <Input
                      name="body"
                      value={values.body}
                      placeholder="Enter description"
                      maxLength="100"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                <FormCardItem title="Board position*" error={errors.position}>
                  <div className={errors.position ? 'form_block error' : 'form_block' }>
                    <Input
                      type="number"
                      name="position"
                      value={values.position}
                      placeholder="Enter position"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                {fetchErrors[data._id] && (
                  <div className="card_item">
                    <span className="form_error">{fetchErrors[data._id]}</span>
                  </div>
                )}

                <InputButton text="Save" />
              </form>
            )}
          </footer>
        </div>
      </div>
    </div>
  )
}

const NewBoardItem = ({ createBoard, setCreate, fetchErrors, setFetchErros }) => {
  const [errors, setErrors] = useState({})

  const formCallback = () => {
    setErrors({})
    setFetchErros({})

    if (!values.name) {
      return setErrors({ name: 'Enter short name' })
    }
    if (!values.title) {
      return setErrors({ title: 'Enter title' })
    }
    if (!values.position || values.position <= 0) {
      return setErrors({ position: 'Enter position' })
    }

    createBoard({
      name: values.name,
      title: values.title,
      body: values.body,
      position: values.position * 1
    })
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    name: '',
    title: '',
    body: '',
    position: 1
  })

  const close = () => {
    setCreate(false)
    setFetchErros({})
  }

  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <footer className="card_foot">
            <form className="form_inner edit_form" onSubmit={onSubmit}>
              <FormCardItem title="Board short name*" error={errors.name}>
                <div className={errors.name ? 'form_block error' : 'form_block' }>
                  <Input
                    name="name"
                    value={values.name}
                    placeholder="Enter short name"
                    maxLength="21"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              <FormCardItem title="Board title*" error={errors.title}>
                <div className={errors.title ? 'form_block error' : 'form_block' }>
                  <Input
                    name="title"
                    value={values.title}
                    placeholder="Enter title"
                    maxLength="50"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              <FormCardItem title="Board description" error={errors.body}>
                <div className={errors.body ? 'form_block error' : 'form_block' }>
                  <Input
                    name="body"
                    value={values.body}
                    placeholder="Enter description"
                    maxLength="100"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              <FormCardItem title="Board position*" error={errors.position}>
                <div className={errors.position ? 'form_block error' : 'form_block' }>
                  <Input
                    type="number"
                    name="position"
                    value={values.position}
                    placeholder="Enter position"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              {fetchErrors.generalCreate && (
                <div className="card_item">
                  <span className="form_error">{fetchErrors.generalCreate}</span>
                </div>
              )}

              <div className="buttons_group">
                <InputButton text="Create" />
                <Button className="secondary" text="Cancel" onClick={close} />
              </div>
            </form>
          </footer>
        </div>
      </div>
    </div>
  )
}

export { BoardItem, NewBoardItem };
