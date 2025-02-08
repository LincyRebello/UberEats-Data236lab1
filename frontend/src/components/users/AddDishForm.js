// AddDishForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../services/api-services';

const AddDishForm = ({ restaurantId, onDishAdded }) => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const handleAddDish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); // Retrieve the token for authentication

    try {
      await axios.post(
        `${baseUrl}/api/restaurants/${restaurantId}/dishes/`,
        {
          name: dishName,
          description,
          price,
          category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDishName('');
      setDescription('');
      setPrice('');
      setCategory('');
      onDishAdded(); // Callback to refresh the list of dishes after adding a new one
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  return (
    <form onSubmit={handleAddDish}>
      <input
        type="text"
        placeholder="Dish Name"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <button type="submit">Add Dish</button>
    </form>
  );
};

export default AddDishForm;
