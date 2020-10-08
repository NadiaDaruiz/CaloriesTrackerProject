// =======================================
// Storage controller
// ========================================
const storageCtrl = (() => {

  // Public methods
  return {
    storeItem: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        // push new items
        items.push(item);
        // set local storage
        localStorage.setItem("items", JSON.stringify(items));

      } else {
        // get what already is in LS
        items = JSON.parse(localStorage.getItem("items"));
        // push the new item
        items.push(item);
        // re set local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    }
  }
})();

// =========================================
// Item controller
// ========================================
const itemCtrl = (() => {

  // item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data structure
  const dataState = {
    // items: [
    //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   { id: 1, name: "Fish Lunch", calories: 800 },
    //   { id: 2, name: "Cookie", calories: 700 }
    // ],
    items: storageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  // Public methods
  return {
    getItems: function () {
      return dataState.items;
    },
    addItem: function (name, calories) {
      // console.log(name, calories); To check if is login the parameters

      // we need to auto-generate the ids.
      let id;
      if (dataState.items.length > 0) {
        id = dataState.items[dataState.items.length - 1].id + 1;
      } else {
        id = 0
      }
      // calories into numbers
      calories = parseInt(calories);
      // console.log(calories);

      // create new item
      newItem = new Item(id, name, calories);
      // console.log(newItem);

      // add to items array
      dataState.items.push(newItem);

      // console.log(dataState);
      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      dataState.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      dataState.items.forEach(function (item) {
        if (item.id === dataState.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      //get the ids
      const ids = dataState.items.map(function (item) {
        return item.id;
      })
      // get the index
      const index = ids.indexOf(id);
      // remove item
      dataState.items.splice(index, 1);
    },
    clearAllItems: function () {
      dataState.items = [];
    },
    setCurrentItem: function (item) {
      dataState.currentItem = item;
    },
    getCurrentItem: function () {
      return dataState.currentItem;
    },

    getTotalCalories: function () {
      let total = 0;

      // Loop through items and add calories
      dataState.items.forEach(function (item) {
        total += item.calories;
      });

      // Set total calories in data
      dataState.totalCalories = total;

      // Return total calories
      return dataState.totalCalories
    },
    logData: function () {
      return dataState;
    }
  }
})();

// ======================================
// UI controller
// ======================================
const uiCtrl = (() => {

  const uiSelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  }
  // Public methods
  return {
    populateItemsList: function (items) {
      let html = "";

      items.forEach(item => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });

      // Insert list items
      document.querySelector(uiSelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(uiSelectors.itemNameInput).value,
        calories: document.querySelector(uiSelectors.itemCaloriesInput).value,
      }
    },
    addListItem: function (item) {
      // Show list
      document.querySelector(uiSelectors.itemList).style.display = "block";

      // create li element
      const li = document.createElement("li");
      // we need to add the class
      li.className = "collection-item";
      // Add the id which will be dynamic
      li.id = `item-${item.id}`;

      // We need to add html
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
      `;
      // Insert item
      document.querySelector(uiSelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {

      let listItems = document.querySelectorAll(uiSelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      })
    },
    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(uiSelectors.itemNameInput).value = "";
      document.querySelector(uiSelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(uiSelectors.itemNameInput).value = itemCtrl.getCurrentItem().name;
      document.querySelector(uiSelectors.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories;
      uiCtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(uiSelectors.listItems);
      // turn nodeList into array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();

      })
    },
    hideList: function () {
      document.querySelector(uiSelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(uiSelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      uiCtrl.clearInput();

      // hiding the btn
      document.querySelector(uiSelectors.updateBtn).style.display = "none";
      document.querySelector(uiSelectors.deleteBtn).style.display = "none";
      document.querySelector(uiSelectors.backBtn).style.display = "none";
      document.querySelector(uiSelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {

      document.querySelector(uiSelectors.updateBtn).style.display = "inline";
      document.querySelector(uiSelectors.deleteBtn).style.display = "inline";
      document.querySelector(uiSelectors.backBtn).style.display = "inline";
      document.querySelector(uiSelectors.addBtn).style.display = "none";
    },

    getSelectors: function () {
      return uiSelectors;
    }
  }

})();


//=============================================
// App controller
//============================================
const app = ((itemCtrl, storageCtrl, uiCtrl) => {

  //All the event listeners
  const loadEventListeners = function () {
    const uiSelectors = uiCtrl.getSelectors();

    // add event for item
    document.querySelector(uiSelectors.addBtn).addEventListener("click", itemAddSubmit);

    // disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    // edit icon click event
    document.querySelector(uiSelectors.itemList).addEventListener("click", itemEditClick);

    // update item submit
    document.querySelector(uiSelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    // Delete btn event
    document.querySelector(uiSelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

    // Back btn event
    document.querySelector(uiSelectors.backBtn).addEventListener("click", uiCtrl.clearEditState);

    // Clear btn event
    document.querySelector(uiSelectors.clearBtn).addEventListener("click", clearAllItemsClick);

  }

  const itemAddSubmit = (e) => {
    e.preventDefault();

    // get form input from uiCtrl
    const input = uiCtrl.getItemInput();
    // console.log(input);

    // check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = itemCtrl.addItem(input.name, input.calories);
      // console.log(newItem);

      // Add item to UI list
      uiCtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      // Add total calories to ui
      uiCtrl.showTotalCalories(totalCalories);

      // store in local storage

      storageCtrl.storeItem(newItem)

      // Clear fields
      uiCtrl.clearInput();
    }
  }
  // Edit item click
  const itemEditClick = (e) => {
    e.preventDefault();

    if (e.target.classList.contains("edit-item")) {
      // Get list item id (item-1)
      const listId = e.target.parentNode.parentNode.id;
      // Break the item
      const listIdArr = listId.split("-");
      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = itemCtrl.getItemById(id);
      // console.log(itemToEdit);

      // Set current item
      itemCtrl.setCurrentItem(itemToEdit)

      // Add item to form
      uiCtrl.addItemToForm();
    }
  }
  // Update item Submit
  const itemUpdateSubmit = function (e) {

    const input = uiCtrl.getItemInput();
    const updatedItem = itemCtrl.updateItem(input.name, input.calories);
    uiCtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = itemCtrl.getTotalCalories();
    // Add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    // Update LS
    storageCtrl.updateItemStorage(updatedItem);

    uiCtrl.clearEditState();
    e.preventDefault();
  }

  // Delete item  Submit

  const itemDeleteSubmit = function (e) {
    // get current item
    const currentItem = itemCtrl.getCurrentItem();
    // delete from data structure
    itemCtrl.deleteItem(currentItem.id);
    // delete from ui
    uiCtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = itemCtrl.getTotalCalories();
    // Add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    // Delete from LS
    storageCtrl.deleteItemFromStorage(currentItem.id);

    uiCtrl.clearEditState();
    e.preventDefault();
  }

  // Clear All items
  const clearAllItemsClick = function (e) {
    // delete all items from data structure
    itemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = itemCtrl.getTotalCalories();
    // Add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    // remove items from ui
    uiCtrl.removeItems();
    // clear from LS
    storageCtrl.clearItemsFromStorage();
    // hide the ul
    uiCtrl.hideList();

    e.preventDefault();
  }
  // console.log(itemCtrl.logData()); --> To check I can access the items

  // Public methods
  return {
    init: function () {

      console.log("started");   // To check app is running

      // clear edit state/set initial state
      uiCtrl.clearEditState();

      // Fetch items from data structure
      const items = itemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        uiCtrl.hideList();
      } else {
        // Populating list with items
        uiCtrl.populateItemsList(items);
      }

      // Get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      // Add total calories to ui
      uiCtrl.showTotalCalories(totalCalories);

      //  Load event listener
      loadEventListeners();
    }
  }

})(itemCtrl, storageCtrl, uiCtrl);

app.init();