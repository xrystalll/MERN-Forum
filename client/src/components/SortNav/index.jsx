const SortNav = ({ links }) => {
  return (
    <div className="sort_nav">
      {links.map((item, index) => (
        <div key={index} className={item.active ? 'sort_item active' : 'sort_item'}>{item.title}</div>
      ))}
    </div>
  )
}

export default SortNav;
