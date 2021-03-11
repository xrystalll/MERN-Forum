const ModalBody = ({ children, title, onClick }) => {
  return (
    <div className="modal_body">
      <div className="modal_head">
        <div className="section_header with_link">
          <h2>{title}</h2>
          <div className="modal_close more_link" onClick={onClick}>
            <i className="bx bx-x" />
          </div>
        </div>
      </div>
      
      {children}
    </div>
  )
}

export default ModalBody;
