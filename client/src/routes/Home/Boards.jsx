import { useEffect, useState } from 'react';

import { BACKEND } from 'support/Constants';

import { Section, SectionHeader } from 'components/Section';
import { PopularBoardsContainer, PopularBoardsItem } from 'components/Slider';

const Boards = () => {
  const [init, setInit] = useState(true)
  const [boards, setBoards] = useState([])
  const limit = 6

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/boards?limit=${limit}&sort=popular`)
        const response = await data.json()

        if (!response.error) {
          setInit(false)
          setBoards(response.docs)
        } else throw Error(response.error.message)
      } catch(err) {
        console.error(err)
      }
    }

    init && fetchBoards()
  }, [init])

  return (
    boards.length ? (
      <Section>
        <SectionHeader title="Popular boards" link={{ title: 'All', url: '/boards' }} />

        <PopularBoardsContainer>
          {boards.map(item => (
            <PopularBoardsItem key={item._id} data={item} />
          ))}
        </PopularBoardsContainer>
      </Section>
    ) : null
  )
}

export default Boards;
