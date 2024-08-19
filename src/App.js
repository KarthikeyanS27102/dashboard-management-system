import React, { useState, useEffect } from "react";
import { FaEllipsisV, FaSync, FaClock, FaChevronDown } from 'react-icons/fa';

const initialDashboardData = {
  categories: [
    { name: "CSPM", widgets: [] },
    { name: "CWPP", widgets: [] },
  ],
};

function App() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [newWidget, setNewWidget] = useState({ title: "", data: "" });
  const [selectedCategory, setSelectedCategory] = useState("CSPM");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("CSPM");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [pendingRemovalWidgets, setPendingRemovalWidgets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedCategory(activeTab);
  }, [activeTab]);

  // Adds a new widget to the selected category
  const addWidget = () => {
    if (!newWidget.title.trim() || !newWidget.data.trim()) {
      alert("Please fill in both widget title and data.");
      return;
    }
    if (selectedCategory !== null && newWidget.title && newWidget.data) {
      const newWidgetObject = {
        id: Date.now(), // or use any unique ID generator
        title: newWidget.title,
        data: newWidget.data,
      };
  
      const updatedCategories = dashboardData.categories.map((category) => {
        if (category.name === selectedCategory) {
          const updatedWidgets = [...category.widgets];
          const slotIndex =
            selectedSlotIndex !== null
              ? selectedSlotIndex
              : updatedWidgets.findIndex((widget) => !widget);
  
          if (slotIndex === -1) {
            updatedWidgets.push(newWidgetObject);
          } else {
            updatedWidgets[slotIndex] = newWidgetObject;
          }
  
          return { ...category, widgets: updatedWidgets };
        }
        return category;
      });
  
      setDashboardData({ categories: updatedCategories });
      setSelectedWidgets((prevSelected) => [
        ...prevSelected,
        newWidgetObject.id,
      ]);
  
      setNewWidget({ title: "", data: "" });
      setIsPanelOpen(false);
    }
  };    

  // Handles the click event to add a widget, setting the category and slot index
  const handleAddWidgetClick = (categoryName, slotIndex = null) => {
    setSelectedCategory(categoryName);
    setSelectedSlotIndex(slotIndex);
    setIsPanelOpen(true);
    setIsAddingCategory(false); 
    
    setSelectedWidgets((prevSelected) => [
      ...prevSelected,
      ...pendingRemovalWidgets,
    ]);
    setPendingRemovalWidgets([]); 
  };
  
  // Removes a widget from a specific category
  const removeWidget = (categoryName, widgetId) => {
    const updatedCategories = dashboardData.categories.map((category) => {
      if (category.name === categoryName) {
        return {
          ...category,
          widgets: category.widgets.filter((widget) => widget?.id !== widgetId),
        };
      }
      return category;
    });
    setDashboardData({ categories: updatedCategories });
    setSelectedWidgets(selectedWidgets.filter((id) => id !== widgetId));
  };

  // Renders placeholders for empty widget slots in a category
  const renderEmptyWidgets = (categoryName) => {
    const category = dashboardData.categories.find(
      (category) => category.name === categoryName
    );
  
    const totalSlots = Math.max(
      3,
      category.widgets.length + ((3 - (category.widgets.length % 3)) % 3)
    );
  
    return Array.from({ length: totalSlots }).map((_, idx) => {
      const widget = category.widgets[idx];
  
      return (
        <div
          key={idx}
          className="relative p-4 bg-card rounded-lg shadow-lg transition-transform transform hover:scale-105 h-60 flex items-center justify-center mb-6"
        >
          {widget ? (
            <div className="w-full h-full">
              <h3 className="absolute top-0 left-5 m-2 text-xl font-bold">
                {widget.title}
              </h3>
              <div className="border border-dashed border-border rounded-lg p-6 h-40 w-full text-center text-base mt-8 whitespace-pre-wrap">
                <button
                  onClick={() => removeWidget(categoryName, widget.id)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 bg-gray-700 hover:bg-gray-600"
                >
                  X
                </button>
                <div>
                  {typeof widget.data === "string"
                    ? widget.data
                    : JSON.stringify(widget.data, null, 2)}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleAddWidgetClick(categoryName, idx)}
              className="text-primary border border-primary hover:bg-primary/10 px-4 py-2 rounded-lg"
            >
              + Add Widget
            </button>
          )}
        </div>
      );
    });
  };  

  // Renders the dashboard with categories and their widgets
  const renderDashboard = (data) => {
    return data.categories.map((category, index) => {
      return (
        <div key={index}>
          <h2 className="text-xl font-semibold mb-6">{category.name} Dashboard</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {renderEmptyWidgets(category.name)}
          </div>
        </div>
      );
    });
  };

  // Handles changes to the category name input field
  const handleCategoryNameChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  // Adds a new category to the dashboard
  const addCategory = () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
  if (!newCategoryName.trim()) return;

  setDashboardData({
    categories: [
      ...dashboardData.categories,
      { name: newCategoryName.trim(), widgets: [] },
    ],
  });

  setNewCategoryName("");
  setIsAddingCategory(false); 
  setActiveTab(newCategoryName.trim());
  };

  // Opens the category input panel
  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
    setIsPanelOpen(true); 
  };

  // Changes the active tab to the selected category
  const handleTabChange = (categoryName) => {
    setActiveTab(categoryName);
    setIsAddingCategory(false); 
  };

  // Removes a category from the dashboard
  const removeCategory = (categoryName) => {
    const updatedCategories = dashboardData.categories.filter(
      (category) => category.name !== categoryName
    );
    setDashboardData({ categories: updatedCategories });

    if (activeTab === categoryName && updatedCategories.length > 0) {
      setActiveTab(updatedCategories[0].name);
    } else if (updatedCategories.length === 0) {
      setActiveTab(""); 
      setIsPanelOpen(false); 
    }
  };

  // Renders checkboxes for widgets and filter widgets based on the search query
  const renderWidgetCheckboxes = () => {
    const category = dashboardData.categories.find(
      (category) => category.name === activeTab
    );
    if (!category) return null;
    const filteredWidgets = category.widgets.filter((widget) =>
      widget.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return filteredWidgets.map((widget) => (
      <label key={widget.id} className="flex items-center">
        <input
          type="checkbox"
          checked={selectedWidgets.includes(widget.id)}
          onChange={() => handleCheckboxChange(widget.id)}
          className="mr-2"
        />
        {widget.title}
      </label>
    ));
  };  

  // Handles changes to the checkbox selection for widgets
  const handleCheckboxChange = (widgetId) => {
    if (selectedWidgets.includes(widgetId)) {
      setPendingRemovalWidgets((prevPending) => [...prevPending, widgetId]);
      setSelectedWidgets((prevSelected) =>
        prevSelected.filter((id) => id !== widgetId)
      );
    } else {
      setSelectedWidgets((prevSelected) => [...prevSelected, widgetId]);
      setPendingRemovalWidgets((prevPending) =>
        prevPending.filter((id) => id !== widgetId)
      );
    }
  };    
  
  // Confirms the removal of selected widgets
  const confirmRemoveWidget = () => {
    if (pendingRemovalWidgets.length > 0) {
      pendingRemovalWidgets.forEach((widgetId) => {
        removeWidget(activeTab, widgetId);
      });
      setPendingRemovalWidgets([]); 
    }
  };
  
  // Cancels the removal of selected widgets
  const cancelRemoveWidget = () => {
    setSelectedWidgets((prevSelected) => [
      ...prevSelected,
      ...pendingRemovalWidgets,
    ]);
    setPendingRemovalWidgets([]);
  };
  
  return (
    <div className="p-6 bg-[#f0f0f5] relative min-h-screen">
      <div className="w-screen bg-white py-1 fixed top-0 left-0 right-0 z-50">
        <div className="relative flex items-center px-6">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <input
            type="text"
            placeholder="Search anything..."
            className="absolute left-1/2 transform -translate-x-1/2 w-[300px] h-6 bg-[#f0f0f5] p-1 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 mt-12">
        <h1 className="text-3xl font-bold">CNAPP Dashboard</h1>
        <div className="flex items-center">
          <button
            onClick={() => handleAddWidgetClick(activeTab)} 
            className="bg-[white] text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg border border-secondary"
          >
            Add Widget +
          </button>
          <button
            className="bg-[white] text-secondary-foreground hover:bg-secondary/80 px-2 py-2 rounded-lg border border-secondary ms-3"
          >
            <FaSync />
          </button>
          <button
            className="bg-[white] text-secondary-foreground hover:bg-secondary/80 px-2 py-2 rounded-lg border border-secondary ms-3"
          >
            <FaEllipsisV  />
          </button>
          <button
            className="flex items-center border-2 border-darkblue2 text-darkblue2 bg-white px-4 py-1 rounded-lg hover:bg-darkblue2 hover:text-white transition duration-200 ms-3 w-41"
            aria-label="Last 2 days"
          >
            <FaClock className="mr-1" />
            <span className="mx-1">|</span>
            <span>Last 2 days</span>
            <FaChevronDown className="ml-1" />
          </button>
        </div>
      </div>
      {renderDashboard(dashboardData)}
      <div
        className={`fixed inset-y-0 right-0 w-1/2 bg-white shadow-lg z-50 transform transition-transform ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      > 
        <div className="bg-darkblue text-white p-2 rounded-t-lg w-full mb-5">
          <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold ms-3">Add Widgets</h3>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-5">
            Personalize your dashboard by adding or removing widgets.
          </div>
            <div className="flex mb-4 border-b border-gray-300">
              {dashboardData.categories.map((category) => (
                <div key={category.name} className="flex items-center">
                  <button
                    onClick={() => handleTabChange(category.name)}
                    className={`px-4 py-2 font-semibold ${
                    activeTab === category.name ? "border-b-2 border-primary" : ""
                    }`}
                  >
                    {category.name}
                  </button>
                  <button
                    onClick={() => removeCategory(category.name)}
                    className="w-5 h-5 flex items-center justify-center rounded-full text-gray-300 bg-gray-700 hover:bg-gray-600 relative"
                  >
                    <span className="absolute top-1/2 transform -translate-y-1/2">X</span>
                  </button>
                </div>
              ))}
              {!isAddingCategory && (
                <button
                  onClick={handleAddCategoryClick}
                  className="ml-auto border-2 border-darkblue2 text-darkblue2 bg-white px-2 py-1 rounded-lg hover:bg-darkblue2 hover:text-white transition duration-200 mb-2"
                >
                  + Add Category
                </button>
              )}
            </div>
            {isAddingCategory && (
              <div className="mb-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={handleCategoryNameChange}
                  placeholder="New Category Name"
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <button
                  onClick={addCategory}
                  className="w-full bg-primary text-white rounded-lg p-2"
                >
                  Add Category
                </button>
              </div>
            )}
            {!isAddingCategory && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Widgets..."
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  />
                </div>
                <div className="mb-5 mt-2">
                  <label className="font-semibold">List of Widgets:</label>
                    <div className="flex flex-col mt-2">
                      {renderWidgetCheckboxes()}
                    </div>
                </div>
                <input
                  type="text"
                  value={newWidget.title}
                  onChange={(e) =>
                    setNewWidget({ ...newWidget, title: e.target.value })
                  }
                  placeholder="Widget Title"
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <textarea
                  value={newWidget.data}
                  onChange={(e) => setNewWidget({ ...newWidget, data: e.target.value })}
                  placeholder="Widget Data"
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <button
                  onClick={addWidget}
                  className="absolute bottom-20 right-4 w-150px border-2 border-darkblue2 text-darkblue2 bg-white px-4 py-1 rounded-lg hover:bg-darkblue2 hover:text-white transition duration-200"
                >
                  Add Widget
                </button>
              </>
            )}
            {pendingRemovalWidgets.length > 0 && (
              <div className="fixed bottom-4 right-4 flex justify-end space-x-4">
                <button
                  onClick={confirmRemoveWidget}
                  className="border-2 border-darkblue2 text-darkblue2 bg-white px-4 py-1 rounded-lg hover:bg-darkblue2 hover:text-white transition duration-200"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelRemoveWidget}
                  className="border-2 border-darkblue2 text-darkblue2 bg-white px-4 py-1 rounded-lg hover:bg-darkblue2 hover:text-white transition duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

export default App;
