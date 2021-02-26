import { Card } from 'components/Card';

const Answers = ({ answers, thread }) => {
  return (
    answers.map(item => (
      <Card key={item.id} data={item} threadData={thread} full type="answer" />
    ))
  )
}

export default Answers;
