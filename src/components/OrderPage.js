import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../assets/orderpage.css"; // Make sure this file is in the correct path
import {useNavigate} from "react-router-dom"

export default function OrderPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    productName: "",
    quantity: 1,
  });
  const [products, setProducts] = useState([]);

  const  navigate = useNavigate();

  function handleGoBack(){
    navigate("/company-website-reactjs");
  }

  // Fetch orders when component mounts or when id changes
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/order/${id}`)
      .then((response) => {
        // Assuming response.data.orderinfo holds the orders array
        setOrders(response.data.orders || []);
      })
      .catch((err) => console.log("Error fetching orders:", err));
    }, [id]);
    
    // Properly handle the user data axios call


    //call the api to get products list.
    useEffect(()=>{
      axios.get("http://localhost:8080/api/products").then(res=>setProducts(res.data));
    }, []);

  // Toggle the create order form
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Handle changes in the create order form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/order/${id}/${itemId}`);
      setOrders((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Deleted the order successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete the order.");
    }
  };
  

  // Handle form submission to create a new order
  const handleCreateOrder = (e) => {
    // Prepare the payload with the user's id and the new order info
    e.preventDefault();
    const payload = {
      userId: id,
      orders: [{ productName: newOrder.productName, quantity: Number(newOrder.quantity) }],
    };


    axios
      .post(`http://localhost:8080/api/order/${id}`, payload)
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
      <button onClick={handleGoBack} className="go-back-button">Logout</button>
      <h2>User Orders</h2>
      {orders.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td className="action-cell">
                  <button className="delete-button" onClick={()=>handleDelete(order._id)}>
                    Mark Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
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
              <select
                name="productName"                   // add a name so your generic handler can catch it
                value={newOrder.productName}
                onChange={handleInputChange}         // re-use your existing handler
                required
              >
                <option value="" disabled>Select a product…</option>
                {products.map(p => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>
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
