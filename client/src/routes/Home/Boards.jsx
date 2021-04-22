import { useEffect, useState } from 'react';

import { BACKEND, Strings } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import { ControlledSlider, PopularBoardsItem } from 'components/Slider';

const Boards = ({ lang }) => {
  const [init, setInit] = useState(true)
  const [boards, setBoards] = useState([])
  const limit = 7

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/boards?limit=${limit}&sort=popular`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setBoards(response.docs)
        } else throw Error(response.error?.message || 'Error')
      } catch(err) {
        console.error(err)
      }
    }

    init && fetchBoards()
  }, [init])

  return (
    boards.length ? (
      <Section>
        <SectionHeader
          title={Strings.popularBoards[lang]}
          link={{ title: Strings.all[lang], url: '/boards' }}
        />

        <ControlledSlider
          items={boards}
          card={(props) => <PopularBoardsItem {...props} lang={lang} />}
        />
      </Section>
    ) : null
  )
}

export default Boards;
