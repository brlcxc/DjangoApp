import React, { useState } from 'react';

const ToggleList = () => {
  // Sample items to display
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  
  // State to manage the toggled status of items
  const [toggledItems, setToggledItems] = useState(
    items.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  // Toggle item function
  const toggleItem = (item) => {
    setToggledItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-black">Groups</h1>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span style={{ cursor: 'pointer', color: toggledItems[item] ? 'green' : 'black' }} onClick={() => toggleItem(item)}>
              {item} {toggledItems[item] ? '✓' : '✗'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToggleList;
