
const Modal = () => {
  return (
    <section className="modal">
      <div className="modal_body">
        <div className="modal_head">
          <div className="section_header with_link">
            <h2>New thread</h2>
            <div className="modal_close more_link">
              <i className="bx bx-x"></i>
            </div>
          </div>
        </div>
        <form className="form_inner">
          <div className="card_item">
            <div className="card_body">
              <div className="card_outside_title">Thread title</div>

              <div className="form_block">
                <input className="input_area" type="text" placeholder="Enter title" required />
              </div>
            </div>
          </div>

          <div className="card_item">
            <div className="card_body">
              <div className="card_outside_title">Content</div>

              <div className="form_block">
                <div className="form_foot">
                  <div className="act_group">
                    <div className="bb_btn" role="button">
                      <i className="bx bx-italic"></i>
                    </div>
                    <div className="bb_btn" role="button">
                      <i className="bx bx-bold"></i>
                    </div>
                    <div className="bb_btn" role="button">
                      <i className="bx bx-link"></i>
                    </div>
                    <div className="bb_btn" role="button">
                      <i className="bx bx-hide"></i>
                    </div>
                    <div className="bb_btn" role="button">
                      <i className="bx bx-image-alt"></i>
                    </div>
                    <div className="bb_btn" role="button">
                      <i className="bx bx-code-alt"></i>
                    </div>
                  </div>
                </div>

                <div className="text_area">
                  <textarea placeholder="Enter your message" required></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="card_item">
            <div id="attached" className="attached_file card_left empty">
              <span className="remove_file">
                <i className="bx bx-x"></i>
              </span>
            </div>

            <div className="card_body file_input_body">
              <div className="card_outside_title with_hint">
                Attach file
                <div className="title_hint">
                  <i className="bx bx-help-circle"></i>
                  <div className="hint_popover">Allowed: png, jpg, jpeg, gif, zip, rar, txt. Max size: 10Mb</div>
                </div>
              </div>

              <div className="form_block">
                <div className="file_area">
                  <input id="fileInput" type="file" />
                  <label htmlFor="fileInput" className="file_input" title="Choose file">
                    <div className="secondary_btn">Choose</div>
                    <span>File not selected</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card_item">
            <div className="card_body">
              <div className="card_outside_title">Choose board</div>

              <div className="form_block select">

                <select className="input_area select_area" placeholder="test" required>
                  <option defaultValue disabled hidden>Board not selected</option>
                  <option>JS</option>
                  <option>PHP</option>
                  <option>CSS</option>
                  <option>API</option>
                  <option>HTML</option>
                  <option>XML</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card_item">
            <input className="btn" type="submit" value="Create thread" />
          </div>
        </form>
      </div>
    </section>
  )
}

export default Modal;