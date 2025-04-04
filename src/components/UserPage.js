import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/userpage.css"; // Make sure this file is in the correct path

export default function UserPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    productName: "",
    quantity: 1,
  });
  const [userData, setUserData] = useState([]);

  // Fetch orders when component mounts or when id changes
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/user/${id}`)
      .then((response) => {
        // Assuming response.data.orderinfo holds the orders array
        setOrders(response.data.orderinfo || []);
        console.log(response);
        setUserData({name:response.data.name, email: response.data.email});
      })
      .catch((err) => console.log("Error fetching orders:", err));
  }, [id]);

  // Toggle the create order form
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Handle changes in the create order form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  console.log(userData);

  // Handle form submission to create a new order
  const handleCreateOrder = (e) => {
    e.preventDefault();
    // Prepare the payload with the user's id and the new order info
    const payload = {
      userId: id,
      userName: userData.name,
      email: userData.email,
      orderinfo: [{ productName: newOrder.productName, quantity: Number(newOrder.quantity) }],
    };

    axios
      .post(`http://localhost:8080/api/user/${id}`, payload)
      .then((response) => {
        // Update orders state:
        // If the product already exists, update its quantity; otherwise, add the new order.
        setOrders((prevOrders) => {
          const index = prevOrders.findIndex(
            (order) => order.productName === newOrder.productName
          );
          if (index > -1) {
            const updatedOrders = [...prevOrders];
            updatedOrders[index].quantity += Number(newOrder.quantity);
            return updatedOrders;
          }
          return [...prevOrders, { productName: newOrder.productName, quantity: Number(newOrder.quantity) }];
        });
        setNewOrder({ productName: "", quantity: 1 });
        setShowForm(false);
      })
      .catch((err) => console.log("Error creating order:", err));
  };

  return (
    <div className="userpage-container">
      <h2>User Orders</h2>
      {orders.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
      {JSON.stringify(userData)}
      {/* Floating Create Order Button */}
      <button className="create-order-btn" onClick={toggleForm}>
        {showForm ? "Cancel" : "Create Order"}
      </button>

      {/* Create Order Form */}
      {showForm && (
        <div className="create-order-form">
          <h3>Create Order</h3>
          <form onSubmit={handleCreateOrder}>
            <div>
              <label htmlFor="productName">Product Name:</label>
              <input
                type="text"
                name="productName"
                id="productName"
                value={newOrder.productName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="1"
                value={newOrder.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Add Order</button>
          </form>
        </div>
      )}
    </div>
  );
}
