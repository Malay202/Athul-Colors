import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/adminpage.css";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [data, setData] = useState([]);
  const  navigate = useNavigate();

  const handleGoBack = ()=>{
    navigate("/company-website-reactjs");
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin");
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDelete = async (id, id1) => {
    try {
      await axios.delete(`http://localhost:8080/api/order/${id}`);
      await axios.delete(`http://localhost:8080/api/user/${id1}`);
      toast.success("Deleted the order successfully!");
      setData(data.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete the order.");
    }
  };

  return (
    <>
      <div className="table-container">
        <h2 className="table-heading">Order Information</h2>
        {data.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Order Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{item.userName}</td>
                  <td>{item.email}</td>
                  <td>
                    {Array.isArray(item.orders) ? (
                      <ul>
                        {item.orders.map((order, idx) => (
                          <li key={idx}>
                            {order.productName}: {order.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>{JSON.stringify(item.orders)}</span> // Handle other cases
                    )}
                  </td>
                  <td className="action-cell">
                    <button className="delete-button" onClick={() => handleDelete(item._id, item.userId)}>
                      Mark Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-orders">No orders available</p>
        )}
      </div>

      <button onClick={handleGoBack} className="go-back-button">Logout</button>
    </>
  );
}