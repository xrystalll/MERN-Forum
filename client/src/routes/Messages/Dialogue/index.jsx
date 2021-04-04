import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { StoreContext } from 'store/Store';

import { useForm } from 'hooks/useForm';

import { BACKEND, Strings } from 'support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';
import { dateFormat } from 'support/Utils';

import FormCardItem from 'components/Card/FormCardItem';
import Input from 'components/Form/Input';
import Dropdown from 'components/Card/Dropdown';
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
  const limit = 10
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

  useEffect(() => {
    if (dialogueId) joinToRoom('pm:' + dialogueId, { token, userId: user.id })
    return () => {
      if (dialogueId) leaveFromRoom('pm:' + dialogueId)
    }
  }, [dialogueId])

  useEffect(() => {
    document.querySelector('.general_footer').style.display = 'none'
    return () => {
      document.querySelector('.general_footer').style.display = ''
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
  }, [init, toUser])

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
  }, [dialogueId, toUser])

  useEffect(() => {
    Socket.on('joinToDialogue', (data) => {
      setDialogueId(data._id)
    })

    if (!dialogueId) return

    Socket.on('newMessage', (data) => {
      setItems(prev => [...prev, data])
      setNoData(false)
      setToBottom((Math.random() * 100).toFixed())

      if (data.from._id !== user.id) {
        Socket.emit('readMessages', { token, dialogueId, from: toUser._id })
      }
    })
    Socket.on('messageDeleted', (data) => {
      setItems(prev => prev.filter(item => item._id !== data._id))
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
  }, [dialogueId])

  const sendMessageCallback = () => {
    if (!values.body.trim()) {
      return setErrors({ body: Strings.enterContent[lang] })
    }

    setErrors({})
    reset()
    Socket.emit('createMessage', { token, dialogueId, body: values.body, to: toUser._id })
  }

  const { onChange, onSubmit, values, reset } = useForm(sendMessageCallback, {
    body: ''
  })

  return (
    <Fragment>
      <div className="messages_wrapper">
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
                  <div className="head_text">{dateFormat(toUser.onlineAt)}</div>
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

                  <div className="items_list">
                    {items.map(item => (
                      <MessageItem key={item._id} data={item} user={user} />
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
            <div className={errors.body ? 'form_block error' : 'form_block' }>
              <Input
                name="body"
                value={values.body}
                maxLength="300"
                onChange={onChange}
                placeholder={Strings.enterYourComment[lang]}
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
