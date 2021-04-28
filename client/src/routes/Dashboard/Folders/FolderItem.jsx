import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Strings } from 'support/Constants';
import { counter, declOfNum } from 'support/Utils';

import { useForm } from 'hooks/useForm';

import { CardBody } from 'components/Card';
import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import { Button, InputButton } from 'components/Button';

const FolderItem = ({ lang, data, editFolder, deleteFolder, fetchErrors, setFetchErros }) => {
  const [edit, setEdit] = useState(false)
  const [errors, setErrors] = useState({})

  const formCallback = () => {
    setErrors({})
    setFetchErros({})

    if (!values.name.trim()) {
      return setErrors({ name: Strings.enterShortName[lang] })
    }
    if (!values.title.trim()) {
      return setErrors({ title: Strings.enterTitle[lang] })
    }
    if (!values.position || values.position <= 0) {
      return setErrors({ position: Strings.enterPosition[lang] })
    }

    setEdit(false)

    editFolder({
      folderId: data._id,
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
    const conf = window.confirm(`${Strings.delete[lang]}?`)

    if (!conf) return

    setEdit(false) 

    deleteFolder(data._id)
  }

  const close = () => {
    setEdit(false)
    setFetchErros({})
  }

  return (
    <CardBody>
      <header className="card_head">
        <div className="card_head_inner">
          <Link to={'/uploads/' + data.name} className="card_title">{data.title}</Link>
        </div>

        {!edit ? (
          <div className="edit_action_menu">
            <div className="action edit" onClick={() => setEdit(true)}>
              <i className="bx bx-pencil" />
            </div>
            <div className="action delete" onClick={deleteClick}>
              <i className="bx bx-trash-alt" />
            </div>
          </div>
        ) : (
          <div className="edit_action_menu">
            <div className="action cancel" onClick={close}>
              <i className="bx bx-x" />
            </div>
          </div>
        )}
      </header>

      <footer className="card_foot">
        {!edit ? (
          <>
            <div className="act_btn foot_btn disable">
              <i className="bx bx-file-blank" />
              <span className="card_count">{counter(data.filesCount)}</span>
              <span className="count_title">
                {declOfNum(data.filesCount, [Strings.file1[lang], Strings.file2[lang], Strings.file3[lang]])}
              </span>
            </div>
          </>
        ) : (
          <form className="form_inner edit_form" onSubmit={onSubmit}>
            <FormCardItem title={Strings.folderShortName[lang] + '*'} error={errors.name}>
              <div className={errors.name ? 'form_block error' : 'form_block' }>
                <Input
                  name="name"
                  value={values.name}
                  placeholder={Strings.enterShortName[lang]}
                  maxLength="21"
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            <FormCardItem title={Strings.folderTitle[lang] + '*'} error={errors.title}>
              <div className={errors.title ? 'form_block error' : 'form_block' }>
                <Input
                  name="title"
                  value={values.title}
                  placeholder={Strings.enterTitle[lang]}
                  maxLength="50"
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            <FormCardItem title={Strings.folderDescription[lang]} error={errors.body}>
              <div className={errors.body ? 'form_block error' : 'form_block' }>
                <Input
                  name="body"
                  value={values.body}
                  placeholder={Strings.enterDescription[lang]}
                  maxLength="100"
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            <FormCardItem title={Strings.folderPosition[lang] + '*'} error={errors.position}>
              <div className={errors.position ? 'form_block error' : 'form_block' }>
                <Input
                  type="number"
                  name="position"
                  value={values.position}
                  placeholder={Strings.enterPosition[lang]}
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            {fetchErrors[data._id] && (
              <div className="card_item">
                <span className="form_error">{fetchErrors[data._id]}</span>
              </div>
            )}

            <InputButton text={Strings.save[lang]} />
          </form>
        )}
      </footer>
    </CardBody>
  )
}

const NewFolderItem = ({ lang, createFolder, setCreate, fetchErrors, setFetchErros }) => {
  const [errors, setErrors] = useState({})

  const formCallback = () => {
    setErrors({})
    setFetchErros({})

    if (!values.name.trim()) {
      return setErrors({ name: Strings.enterShortName[lang] })
    }
    if (!values.title.trim()) {
      return setErrors({ title: Strings.enterTitle[lang] })
    }
    if (!values.position || values.position <= 0) {
      return setErrors({ position: Strings.enterPosition[lang] })
    }

    createFolder({
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
              <FormCardItem title={Strings.folderShortName[lang] + '*'} error={errors.name}>
                <div className={errors.name ? 'form_block error' : 'form_block' }>
                  <Input
                    name="name"
                    value={values.name}
                    placeholder={Strings.enterShortName[lang]}
                    maxLength="21"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              <FormCardItem title={Strings.folderTitle[lang] + '*'} error={errors.title}>
                <div className={errors.title ? 'form_block error' : 'form_block' }>
                  <Input
                    name="title"
                    value={values.title}
                    placeholder={Strings.enterTitle[lang]}
                    maxLength="50"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              <FormCardItem title={Strings.folderDescription[lang]} error={errors.body}>
                <div className={errors.body ? 'form_block error' : 'form_block' }>
                  <Input
                    name="body"
                    value={values.body}
                    placeholder={Strings.enterDescription[lang]}
                    maxLength="100"
                    onChange={onChange}
                  />
                </div>
              </FormCardItem>

              <FormCardItem title={Strings.folderPosition[lang] + '*'} error={errors.position}>
                <div className={errors.position ? 'form_block error' : 'form_block' }>
                  <Input
                    type="number"
                    name="position"
                    value={values.position}
                    placeholder={Strings.enterPosition[lang]}
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
                <InputButton text={Strings.create[lang]} />
                <Button className="secondary" text={Strings.cancel[lang]} onClick={close} />
              </div>
            </form>
          </footer>
        </div>
      </div>
    </div>
  )
}

export { FolderItem, NewFolderItem };
