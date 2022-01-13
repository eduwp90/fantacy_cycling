import './list.scss';
import Item from '../item/item';

function List ({mine, riderList, addToRoster, removeFromRoster}) {
  const class_name = mine? 'myList' : 'fullList';
  const items = (riderList && riderList.length > 0) ? riderList.map(rider => <Item 
    mine={mine}
    key={rider.id}         
    rider={rider}
    addToRoster={addToRoster}
    removeFromRoster={removeFromRoster}
    />) : <p>no riders</p>
  return (
    <div className={class_name}>
      {items}
    </div>
  )
}

export default List;