import { useEffect, useContext, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND } from 'support/Constants';

export const useMoreFetch = ({ method, params, limit = 10, sort, auth = false }) => {
  const { token } = useContext(StoreContext)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [moreTrigger, setMoreTrigger] = useState(true)
  const [reFetch, setReFetch] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    setItems([])
    setPage(1)
    setNextPage(1)
    setHasNextPage(true)
    setMoreTrigger(true)
    setRun(reFetch)
  }, [reFetch])

  useEffect(() => {
    const fetchData = async () => {
      if (!hasNextPage) return
      setMoreLoading(true)

      const urlParams = { limit, page }

      if (sort) {
        urlParams.sort = sort
      }

      let methodParams = ''
      if (params) {
        methodParams = '?' + Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&')
      }

      const sign = params ? '&' : '?'
      const navParams = sign + Object.keys(urlParams).map(key => key + '=' + encodeURIComponent(urlParams[key])).join('&')

      const headers = auth ? {
        headers: {
          Authorization: 'Bearer ' + token
        }
      } : null

      try {
        const data = await fetch(`${BACKEND}/api/${method + methodParams + navParams}`, headers)
        const response = await data.json()

        if (!response.error) {
          setItems(prev => [...prev, ...response.docs])
          setNextPage(response.nextPage)
          setHasNextPage(response.hasNextPage)
          setLoading(false)
          setMoreLoading(false)
          setNoData(false)
          setMoreTrigger(true)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        setLoading(false)
        setNoData(true)
        setMoreLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line
  }, [page, run])

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  })

  const handleScroll = () => {
    if (!moreTrigger) return

    const scrollTop = window.innerHeight + document.documentElement.scrollTop
    const scrollHeight = document.scrollingElement.scrollHeight
    if (scrollTop >= scrollHeight - 150) {
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

  return {
    loading,
    moreLoading,
    noData,
    items,
    setItems,
    setNoData,
    refetch: setReFetch
  }
};
