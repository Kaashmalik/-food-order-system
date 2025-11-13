import React from 'react';
import { FaUtensils, FaCoffee, FaIceCream, FaWineBottle, FaPizzaSlice } from 'react-icons/fa';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const categoryIcons = {
    'all': <FaUtensils />,
    'appetizer': <FaUtensils />,
    'main-course': <FaPizzaSlice />,
    'dessert': <FaIceCream />,
    'beverage': <FaCoffee />,
    'special': <FaWineBottle />
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
            activeCategory === category.id
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[#2D1B0E] text-amber-100 hover:bg-amber-600/30'
          }`}
        >
          <span className="mr-2 text-amber-500">
            {categoryIcons[category.id] || <FaUtensils />}
          </span>
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;