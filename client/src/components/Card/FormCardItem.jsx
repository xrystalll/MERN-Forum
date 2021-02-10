const FormCardItem = ({ children, title, error }) => {
  return (
    <div className="card_item">
      <div className="card_body">
        <div className="card_outside_title">
          {title}
          {error && <span className="form_error">{error}</span>}
        </div>

        {children}
      </div>
    </div>
  )
}

export default FormCardItem;
