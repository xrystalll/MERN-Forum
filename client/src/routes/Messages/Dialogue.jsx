import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { useForm } from 'hooks/useForm';

import { BACKEND, Strings } from 'support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from 'support/Socket';

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
  const [errors, setErrors] = useState({})
  const [init, setInit] = useState(true)
  const [dialogueId, setDialogueId] = useState(null)
  const [toId, setToId] = useState(null)
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

  useEffect(() => {
    if (dialogueId) joinToRoom('pm:' + dialogueId, { token, userId: user.id })
    return () => {
      if (dialogueId) leaveFromRoom('pm:' + dialogueId)
    }
  }, [dialogueId])

  useEffect(() => {
    document.title = 'Forum | ' + Strings.messages[lang]

    const fetchDialogue = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/dialogue?userName=${userName}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setDialogueId(response._id)
          if (response.to !== user.id) {
            setToId(response.to)
          } else {
            setToId(response.from)
          }
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setInit(false)
      }
    }

    init && fetchDialogue()
  }, [init])

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
          setItems(prev => [...response.docs.reverse(), ...prev])
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
      console.log('scroll')
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

  useEffect(() => {
    Socket.on('newMessage', (data) => {
      setItems(prev => [...prev, data])
      setNoData(false)
      setToBottom((Math.random() * 100).toFixed())
    })
    Socket.on('messageDeleted', (data) => {
      setItems(prev => prev.filter(item => item._id !== data._id))
    })
  }, [])

  const sendMessageCallback = () => {
    if (!values.body.trim()) {
      return setErrors({ body: Strings.enterContent[lang] })
    }

    setErrors({})
    reset()
    Socket.emit('createMessage', { token, dialogueId, body: values.body, to: toId })
  }

  const { onChange, onSubmit, values, reset } = useForm(sendMessageCallback, {
    body: ''
  })

  return (
    <Fragment>
      <div className="messages_wrapper">
        <CustomScrollbar className="view" onScroll={handleScroll} toBottom={toBottom}>
          {!noData ? (
            !loading ? (
              items.length ? (
                <Fragment>
                  <div className="items_list">
                    {items.map(item => (
                      <MessageItem key={item._id} data={item} user={user} />
                    ))}
                  </div>

                  {moreLoading && <Loader className="more_loader" color="#64707d" />}
                </Fragment>
              ) : <Errorer message={Strings.noMessagesYet[lang]} />
            ) : <Loader color="#64707d" />
          ) : (
            <Errorer message={Strings.unableToDisplayMessages[lang]} />
          )}
        </CustomScrollbar>

        <form className="form_inner comments_form float" onSubmit={onSubmit}>
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
