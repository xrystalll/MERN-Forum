import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/ja';

export const counter = (count = 0) => {
  if (count < 1e3) return count
  if (count >= 1e3 && count < 1e6) return `${(count / 1e3).toFixed(1)}K`
  if (count >= 1e6 && count < 1e9) return `${(count / 1e6).toFixed(1)}M`
  if (count >= 1e9 && count < 1e12) return `${(count / 1e9).toFixed(1)}B`
}

export const declOfNum = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}

export const language = () => {
  const langs = ['ru', 'en', 'jp']
  const langFromLS = langs.find(i => i === localStorage.getItem('lang'))
  const langFromNL = langs.find(i => i === window.navigator.language)

  return langFromLS ? langFromLS : langFromNL ? langFromNL : 'en'
}

export const dateFormat = (date, type) => {
  const lang = language()
  const timeFormat = lang === 'en' ? 'hh:mm A' : 'HH:mm'
  const DMT = `DD MMM, ${timeFormat}`

  let formatObj

  if (type === 'short') {
    formatObj = {
      sameDay: timeFormat,
      lastDay: DMT,
      nextDay: DMT,
      nextWeek: DMT,
      lastWeek: DMT,
      sameElse: () => {
        if (new Date(date).getFullYear() === new Date().getFullYear()) {
          return DMT
        } else {
          return `DD MMM YY, ${timeFormat}`
        }
      }
    }
  } else if (type === 'mini') {
    formatObj = {
      sameDay: timeFormat,
      lastDay: 'DD MMM',
      nextDay: 'DD MMM',
      nextWeek: 'DD MMM',
      lastWeek: 'DD MMM',
      sameElse: () => {
        if (new Date(date).getFullYear() === new Date().getFullYear()) {
          return 'DD MMM'
        } else {
          return 'DD MMM YY'
        }
      }
    }
  } else if (type === 'onlyDate') {
    formatObj = {
      sameDay: 'DD MMM',
      lastDay: 'DD MMM',
      nextDay: 'DD MMM',
      nextWeek: 'DD MMM',
      lastWeek: 'DD MMM',
      sameElse: () => {
        if (new Date(date).getFullYear() === new Date().getFullYear()) {
          return 'DD MMM'
        } else {
          return 'DD MMM YYYY'
        }
      }
    }
  } else if (type === 'onlyTime') {
    formatObj = {
      sameDay: timeFormat,
      lastDay: timeFormat,
      nextDay: timeFormat,
      nextWeek: timeFormat,
      lastWeek: timeFormat,
      sameElse: timeFormat
    }
  } else {
    formatObj = {
      nextWeek: DMT,
      lastWeek: DMT,
      sameElse: () => {
        if (new Date(date).getFullYear() === new Date().getFullYear()) {
          return DMT
        } else {
          return `DD MMM YY, ${timeFormat}`
        }
      }
    }
  }

  return moment(date)
    .locale(lang)
    .calendar(null, formatObj)
}

export const formatBytes = (bytes, decimals) => {
  if (bytes === 0) return '0 bytes'

  const k = 1024
  const dm = decimals <= 0 ? 0 : decimals || 2
  const sizes = ['bytes', 'Kb', 'Mb', 'Gb']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const deletedUser = {
  _id: (Math.random() * 1000).toFixed(),
  name: 'deleted',
  displayName: 'DELETED',
  onlineAt: '1970-01-01T00:00:00.000Z',
  role: 1
}
