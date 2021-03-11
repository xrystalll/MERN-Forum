import './style.css';

const SortNav = ({ links, setSort, state }) => {
  return (
    <div className="sort_nav">
      {links.map((item, index) => (
        <div
          key={index}
          onClick={() => setSort(item.sort)}
          className={state === item.sort ? 'sort_item active' : 'sort_item'}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}

export default SortNav;
