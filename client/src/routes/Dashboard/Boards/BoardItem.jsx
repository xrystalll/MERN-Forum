import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import { counter, declOfNum } from 'support/Utils';
import { useForm } from 'hooks/useForm';

import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { InputButton } from 'components/Button';

const BoardItem = ({ data, editBoard, deleteBoard }) => {
  const [edit, setEdit] = useState(false)

  const formCallback = () => {
    setEdit(false)

    editBoard({
      boardId: data._id,
      title: values.title,
      body: values.body,
      position: values.position * 1
    })
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    title: data.title || '',
    body: data.body || '',
    position: data.position || 0
  })

  const deleteClick = () => {
    setEdit(false) 

    deleteBoard(data._id)
  }

  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_block">
          <header className="card_head">
            <div className="card_head_inner">
              <Link to={'/boards/' + data.id} className="card_title">{data.title}</Link>
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
                <div className="action cancel" onClick={() => setEdit(false)}>
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
                <FormCardItem title="Board title*">
                  <div className="form_block">
                    <Input
                      name="title"
                      value={values.title}
                      placeholder="Enter title"
                      required
                      maxLength="100"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                <FormCardItem title="Board body">
                  <div className="form_block">
                    <Input
                      name="body"
                      value={values.body}
                      placeholder="Enter body"
                      maxLength="100"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                <FormCardItem title="Board position*">
                  <div className="form_block">
                    <Input
                      type="number"
                      name="position"
                      value={values.position}
                      placeholder="Enter position"
                      required
                      maxLength="100"
                      onChange={onChange}
                    />
                  </div>
                </FormCardItem>

                <InputButton text="Save" />
              </form>
            )}
          </footer>
        </div>
      </div>
    </div>
  )
}

export { BoardItem };
