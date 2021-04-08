import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { StoreContext } from 'store/Store';

import { useForm } from 'hooks/useForm';

import { BACKEND, Strings } from 'support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';
import { dateFormat } from 'support/Utils';

import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import FileUploadForm from 'components/Form/FileUploadForm';
// import Dropdown from 'components/Card/Dropdown';
import UserRole from 'components/UserRole';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';
import CustomScrollbar from 'components/CustomScrollbar';

import MessageItem from './MessageItem';
import './style.css';

const Dialogue = ({ match }) => {
  const { user, token, lang } = useContext(StoreContext)
  const { userName } = match.params
  const [toUser, setToUser] = useState({})
  const [errors, setErrors] = useState({})
  const [init, setInit] = useState(true)
  const [dialogueId, setDialogueId] = useState(null)
  const [items, setItems] = useState([])
  const limit = 15
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [moreTrigger, setMoreTrigger] = useState(true)
  const [toBottom, setToBottom] = useState(true)
  const [fetchMessagesInit, setFetchMessagesInit] = useState(true)
  const [firstMsg, setFirstMsg] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (dialogueId) joinToRoom('pm:' + dialogueId, { token, userId: user.id })
    return () => {
      if (dialogueId) leaveFromRoom('pm:' + dialogueId)
    }
    // eslint-disable-next-line
  }, [dialogueId])

  useEffect(() => {
    document.querySelector('html').scrollTo(0, 0)
    document.body.classList.add('noscroll')
    document.querySelector('.main_section').classList.add('with_hested_scroll')
    return () => {
      document.body.classList.remove('noscroll')
      document.querySelector('.main_section').classList.remove('with_hested_scroll')
    }
  }, [])

  useEffect(() => {
    const userTitle = toUser.displayName || userName
    document.title = `Forum | ${Strings.dialogueWith[lang]} ${userTitle}`

    const fetchUser = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/user?userName=${userName}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setToUser(response)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        console.error(err)
      }
    }

    const fetchDialogue = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/dialogue?userName=${userName}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response) setLoading(false)

        if (!response.error) {
          setInit(false)
          setDialogueId(response._id)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setInit(false)
      }
    }

    if (init) {
      fetchUser()
      fetchDialogue()
    }
  }, [init, toUser, userName, token, lang])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!hasNextPage || !dialogueId) return
      setMoreLoading(true)

      try {
        const data = await fetch(`${BACKEND}/api/messages?dialogueId=${dialogueId}&limit=${limit}&page=${page}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          const array = [...response.docs.reverse(), ...items]
          setItems([...new Map(array.map(i => [i._id, i])).values()])
          setNextPage(response.nextPage)
          setHasNextPage(response.hasNextPage)
          setLoading(false)
          setMoreLoading(false)
          setNoData(false)
          setMoreTrigger(true)
          if (fetchMessagesInit) {
            setFetchMessagesInit(false)
            setToBottom((Math.random() * 100).toFixed())
          }
          if (firstMsg) {
            document.querySelector(`#${firstMsg}`).scrollIntoView()
          }
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setLoading(false)
        setNoData(true)
        setMoreLoading(false)
      }
    }

    fetchMessages()
    // eslint-disable-next-line
  }, [page, dialogueId])

  const handleScroll = ({ target }) => {
    if (!moreTrigger) return

    if (target.scrollTop <= 70) {
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

  useEffect(() => {
    items.length && setFirstMsg('msg_' + items[0]._id)
  }, [items])

  useEffect(() => {
    if (dialogueId && toUser) Socket.emit('readMessages', { token, dialogueId, from: toUser._id })
    // eslint-disable-next-line
  }, [dialogueId, toUser])

  useEffect(() => {
    Socket.on('joinToDialogue', (data) => {
      setDialogueId(data._id)
    })
    Socket.on('newMessage', (data) => {
      setItems(prev => [...prev, data])
      setNoData(false)
      setToBottom((Math.random() * 100).toFixed())
    })
    Socket.on('messageDeleted', (data) => {
      setItems(prev => prev.filter(item => item._id !== data.id))
    })
    Socket.on('messagesRead', () => {
      setItems(prev => {
        return (
          prev.map(item => {
            if (item.from._id === user.id) {
              return { ...item, read: true }
            }
            return item
          })
        )
      })
    })
    Socket.on('startTyping', (data) => {
      setTyping(true)
    })
    Socket.on('stopTyping', (data) => {
      setTyping(false)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Socket.on('newMessage', (data) => {
      if (data.from._id !== user.id) {
        Socket.emit('readMessages', { token, dialogueId, from: toUser._id })
      }
    })
    // eslint-disable-next-line
  }, [dialogueId])

  const [files, setFiles] = useState([])
  const [clearFiles, setClearFiles] = useState(false)

  const getFile = (files) => {
    setClearFiles(false)
    setFiles(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
    }
  }, [clearFiles])

  const sendMessageWithFiles = () => {
    const formData = new FormData()
    files.map(item => formData.append('file', item))
    formData.append('postData', JSON.stringify({
      dialogueId,
      body: values.body.substring(0, 1000),
      to: toUser._id
    }))

    fetch(BACKEND + '/api/message/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setClearFiles(true)
        } else throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        toast.error(err.message)
      })
  }

  const sendMessageCallback = () => {
    if (!files.length && !values.body.trim()) {
      return setErrors({ body: Strings.enterContent[lang] })
    }

    setErrors({})
    reset()
    if (!files.length) {
      Socket.emit('createMessage', { token, dialogueId, body: values.body, to: toUser._id })
    } else {
      sendMessageWithFiles()
    }
    Socket.emit('stopType', { token, dialogueId })
  }

  const { onChange, onSubmit, values, reset } = useForm(sendMessageCallback, {
    body: ''
  })

  useEffect(() => {
    if (values.body.length > 0) {
      Socket.emit('startType', { token, dialogueId })
    } else {
      Socket.emit('stopType', { token, dialogueId })
    }
    // eslint-disable-next-line
  }, [values.body])

  const onBlur = () => {
    Socket.emit('stopType', { token, dialogueId })
  }

  const [chatHeight, setChatHeight] = useState(window.innerHeight)

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const handleResize = () => {
    setChatHeight(window.innerHeight)
  }

  return (
    <Fragment>
      <div className="messages_wrapper" style={{ height: `calc(${chatHeight}px - 180px)` }}>
        {toUser.name && (
          <div className="card_head user_head">
            <div className="card_head_inner">
              <div className="card_title user_title">
                <Link to={'/messages'} className="card_back">
                  <i className="bx bx-left-arrow-alt" />
                </Link>
                {toUser.picture ? (
                  <div className="head_profile" style={{ backgroundImage: `url(${BACKEND + toUser.picture})` }} />
                ) : (
                  <div className="head_profile">
                    {toUser.displayName.charAt(0)}
                  </div>
                )}
                <div className="user_info">
                  <Link to={'/user/' + toUser.name} className="user_info_top">
                    {toUser.displayName}
                    <UserRole role={toUser.role} />
                  </Link>
                  <div className="head_text">
                    {typing ? (
                      <Fragment>
                        {Strings.isTyping[lang]}
                        <span className="dot_loader"></span>
                      </Fragment>
                    ) : (
                      new Date() - new Date(toUser.onlineAt) < 5 * 60000
                        ? 'online'
                        : Strings.lastSeen[lang] + ' ' + dateFormat(toUser.onlineAt, 'short')
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <CustomScrollbar className="view" onScroll={handleScroll} toBottom={toBottom}>
          {!noData ? (
            !loading ? (
              items.length ? (
                <Fragment>
                  {moreLoading && <Loader className="more_loader" color="#64707d" />}

                  <div className="messages_list">
                    {items.map(item => (
                      <MessageItem key={item._id} data={item} dialogueId={dialogueId} user={user} token={token} />
                    ))}
                  </div>
                </Fragment>
              ) : <Errorer message={Strings.noMessagesYet[lang]} />
            ) : <Loader color="#64707d" />
          ) : (
            <Errorer message={Strings.unableToDisplayMessages[lang]} />
          )}
        </CustomScrollbar>

        <form className="form_inner comments_form" onSubmit={onSubmit}>
          <FormCardItem row>
            <FileUploadForm
              mini
              sendFiles={getFile}
              clearFiles={clearFiles}
            />

            <div className={errors.body ? 'form_block error' : 'form_block' }>
              <Input
                name="body"
                value={values.body}
                maxLength="1000"
                onChange={onChange}
                onBlur={onBlur}
                placeholder={Strings.enterYourMessage[lang]}
              />
            </div>

            <button className="btn send_btn">
              <i className="bx bxs-send" />
            </button>
          </FormCardItem>
        </form>
      </div>
    </Fragment>
  )
}

export default Dialogue;
