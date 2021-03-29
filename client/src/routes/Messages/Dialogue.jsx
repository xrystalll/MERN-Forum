const Dialogue = ({ match }) => {
  const { userName } = match.params

  return (
    <div>Dialogue with {userName}</div>
  )
}

export default Dialogue;
