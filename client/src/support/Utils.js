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

export const dateFormat = (date) => {
  return moment(date).locale(localStorage.getItem('lang') || 'en').calendar(null, { lastWeek: 'DD MMM, hh:mm', sameElse: 'DD MMM YYYY, hh:mm' })
}

export const formatBytes = (bytes, decimals) => {
  if (bytes === 0) return '0 bytes'

  const k = 1024
  const dm = decimals <= 0 ? 0 : decimals || 2
  const sizes = ['bytes', 'Kb', 'Mb', 'Gb']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
