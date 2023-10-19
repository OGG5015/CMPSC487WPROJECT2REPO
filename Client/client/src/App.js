import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios";



function App() {
  const [listOfItems, setListOfItems] = useState([]);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [itemColor, setItemColor] = useState("")
  const [itemCondition, setItemCondition] = useState("")
  const [imageURL, setImage] = useState("")
  const [searchInput, setSearchInput] = useState("");






  useEffect(() => {
    Axios.get("http://localhost:3007/getItems").then((response) => {
      setListOfItems(response.data)

    });
  }, []);

  const createItem = () => {
    Axios.post("http://localhost:3007/createItem", {
      name,
      description,
      imageURL,
      itemColor,
      itemCondition
    }).then((response) => {
      setListOfItems([...listOfItems,
      {
        name,
        description,
        imageURL,
        itemColor,
        itemCondition
      }])
    })

      .catch(err => {
        console.log(err)
      });
    document.querySelector(".bg-modal-create").style.display = "none";
  };



  //declaring values to update item information
  const [updateItemId, setUpdateItemId] = useState("");

  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateItemColor, setUpdateItemColor] = useState("");
  const [updateItemCondition, setUpdateItemCondition] = useState("");
  const [updateImageURL, setUpdateImageURL] = useState("");




  const updateItem = (id) => {
    const updatedItem = {
      _id: id,
      name: updateName,
      description: updateDescription,
      itemColor: updateItemColor,
      itemCondition: updateItemCondition,
      imageURL: updateImageURL,
    };

    Axios.put("http://localhost:3007/update", updatedItem)
      .then(() => {
        setListOfItems((prevItems) => {
          return prevItems.map((item) => {
            if (item._id === id) {
              return { ...item, ...updatedItem };
            }
            return item;
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });

    // Close the modal
    document.querySelector(".bg-modal").style.display = "none";
  };


  const deleteItem = (_id) => {
    Axios.delete(`http://localhost:3007/deleteItem/${_id}`)
      .then(() => {
        setListOfItems((prevList) => prevList.filter((item) => item._id !== _id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleColorChange = (event) => {
    // Handle the color selection change
    setItemColor(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value)
  }


  const filteredItems = listOfItems.filter((item) => {
    const nameMatch = item.name && item.name.toLowerCase().includes(searchInput.toLowerCase());
    const descriptionMatch = item.description && item.description.toLowerCase().includes(searchInput.toLowerCase());
    const conditionMatch = item.itemCondition && item.itemCondition.toLowerCase().includes(searchInput.toLowerCase());
    const colorMatch = item.itemColor && item.itemColor.toLowerCase().includes(searchInput.toLowerCase());
    const idMatch = item._id && item._id.toLowerCase().includes(searchInput.toLowerCase());

    return (
      nameMatch || descriptionMatch || conditionMatch || colorMatch || idMatch || !searchInput
    );
  })

  const [sortBy, setSortBy] = useState(null);

  const handleSort = (key) => {
    setSortBy(key);
  };

  const sortedItems = [...filteredItems];
if (sortBy === "id") {
  sortedItems.sort((a, b) => {
    if (a._id && b._id) {
      return a._id.localeCompare(b._id);
    }
    return 0; 
  });
} else if (sortBy === "name") {
  sortedItems.sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }
    return 0; 
  });
}







  const resetCreateItemForm = () => {
    setName("");
    setDescription("");
    setItemColor("");
    setItemCondition("");
    setImage("");
  };

  const resetUpdateItemForm = () => {
    setUpdateName("");
    setUpdateDescription("");
    setUpdateItemColor("");
    setUpdateItemCondition("");
    setUpdateImageURL("");
  };



  return (

    <div className="App">
      <div className="itemsDisplay">
        <h1>Item Catalogue</h1>



        <div /*className='sort-by'*/>
          <p>Sort By:</p>
          <button onClick={() => handleSort("id")}>ID</button>
          <button onClick={() => handleSort("name")}>Name</button>
        </div>

        <div /*className = 'search-by'*/>
        <p>Search By Keyword</p>
          <input
            id="searchByKeyword"
            type="text"
            placeholder="Search by item id, name, color, condition, or description"
            value={searchInput}
            onChange={handleSearchChange}

          ></input>
        </div>
      </div>








      <div /*className = "table-display"*/ style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <table border="1"
        >
          <thead>
            <tr >
              <th width="200">ID</th>
              <th width="200">Name</th>
              <th width="200">Description</th>
              <th width="200">Image</th>
              <th width="200">Edit</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>Type: {item.description}
                  <p>Color: {item.itemColor}</p>
                  <p>Condition: {item.itemCondition}</p>
                </td>
                <td>
                  <img src={item.imageURL} alt={item.imageURL}
                    width="200" />
                </td>
                <td>

                  <button
                    id="updateButton"
                    onClick={() => {
                      resetUpdateItemForm();
                      setUpdateItemId(item._id);
                      document.querySelector('.bg-modal').style.display = 'flex'
                    }}> Update </button>
                  <button onClick={() => deleteItem(item._id)}> Delete </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      <button
        id="openCreateItemModal"
        className="create-button"
        onClick={() => {
          resetCreateItemForm();
          document.querySelector('.bg-modal-create').style.display = 'flex'
        }}>Create Item</button>



      <div class="bg-modal-create">
        <div class="modal-content">
          <h1>Create an Item</h1>
          <div>
            <label>Item Name: </label>
            <input
              type="text"
              placeholder="Name..."
              onChange={(event) => {
                setName(event.target.value)
              }} />
          </div>
          <div>
            <label>Description (category): </label>
            <input
              type="text"
              placeholder="Description..."
              onChange={(event) => {
                setDescription(event.target.value)
              }}
            />
          </div>
          <div>
            <label>Image URL: </label>
            <input
              type="text"
              id="imageURLField"
              placeholder="Image URL..."
              onChange={(event) => {
                setImage(event.target.value)
              }}
            />
          </div>

          <label>Condition</label>
          <div>
            <input
              type="radio"
              id="newitem"
              name="condition"
              value="newItem"
              onChange={() => setItemCondition("New")}
            />
            <label for="newItem">New</label>
          </div>
          <div>
            <input
              type="radio"
              id="usedLikeNewItem"
              name="condition"
              value="usedLikeNewItem"
              onChange={() => setItemCondition("Used-Like New")}
            />
            <label for="usedLikeNewItem">Used-Like New</label>
          </div>
          <div>
            <input
              type="radio"
              id="usedItem"
              name="condition"
              value="usedItem"
              onChange={() => setItemCondition("Used")}
            />
            <label for="usedItem">Used</label>
            <input
              type="radio"
              id="N/A"
              name="condition"
              value="N/A"
              onChange={() => setItemCondition("N/A")}
            />
            <label for="N/A">N/A</label>

          </div>

          <div>
            <label htmlFor="colorList">Item Color: </label>
            <select id="colorList" onChange={handleColorChange} value={itemColor}>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="Black">Black</option>
              <option value="Gray">Gray</option>
              <option value="Pink">Prink</option>
              <option value="Brown">Brown</option>
              <option value="Purple">Purple</option>
              <option value="Orange">Orange</option>
              <option value="White">White</option>
              <option value="Multicolored">Multicolored</option>
              <option value="N/A">N/A</option>
            </select>
          </div>


          <button class="format-submit-button" id="submitCreateItem" onClick={createItem}> Create Item </button>

          <div class="close" onClick={() => document.querySelector(".bg-modal-create").style.display = "none"}>+</div>
        </div>

      </div>






      <div class="bg-modal">
        <div class="modal-content">
          <h1>Update Item Information</h1>
          <p>Item ID:</p>
          <div>
            <label for="updateNameField">Name: </label>
            <input
              type="text"
              id='updateNameField'
              placeholder='New Item Name'
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}></input>
          </div>
          <div>
            <label for="updateTypeField">Type: </label>
            <input type="text" id="updateTypeField" placeholder='New Item Type' value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)}></input>
          </div>
          <div>
            <label>Image URL: </label>
            <input type="text" id="updateImageURLField" placeholder='New Item URL' value={updateImageURL} onChange={(e) => setUpdateImageURL(e.target.value)}></input>
          </div>
          <div>
            <label>Condition</label>
            <div>
              <input
                type="radio"
                id="newitem"
                name="condition"
                value="New"
                checked={updateItemCondition === "New"}
                onChange={() => setUpdateItemCondition("New")}
              />
              <label for="newItem">New</label>
            </div>
            <div>
              <input
                type="radio"
                id="usedLikeNewItem"
                name="condition"
                value="Used-Like New"
                checked={updateItemCondition === "Used-Like New"}
                onChange={() => setUpdateItemCondition("Used-Like New")}
              />
              <label for="usedLikeNewItem">Used-Like New</label>
            </div>
            <div>
              <input
                type="radio"
                id="usedItem"
                name="condition"
                value="Used"
                checked={updateItemCondition === "Used"}
                onChange={() => setUpdateItemCondition("Used")}
              />
              <label for="usedItem">Used</label>
              <input
                type="radio"
                id="N/A"
                name="condition"
                value="N/A"
                checked={updateItemCondition === "N/A"}
                onChange={() => setUpdateItemCondition("N/A")}
              />
              <label for="N/A">N/A</label>

            </div>
          </div>
          <div>
            <label htmlFor="colorList">Item Color: </label>
            <select id="colorList" onChange={(e) => setUpdateItemColor(e.target.value)} value={updateItemColor}>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="Black">Black</option>
              <option value="Gray">Gray</option>
              <option value="Pink">Prink</option>
              <option value="Brown">Brown</option>
              <option value="Purple">Purple</option>
              <option value="Orange">Orange</option>
              <option value="White">White</option>
              <option value="Multicolored">Multicolored</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
          <div>
            <button onClick={() => updateItem(updateItemId)}>Update Item</button>
            <div class="close" onClick={() => document.querySelector(".bg-modal").style.display = "none"}>+</div>
          </div>
        </div>
      </div>

    </div>);


}





export default App;
