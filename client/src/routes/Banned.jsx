import { Section, SectionHeader } from 'components/Section';

const Banned = () => {
  document.title = 'Forum | Banned'

  return (
    <Section>
      <SectionHeader title="Banned" />

      <div className="card_item">
        <div className="card_body">
          <div className="card_block">
            <div className="card_head user_head">
              <div className="card_head_inner">
                <div className="card_title user_title">
                  <div className="user_info">
                    You are banned
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Banned;
