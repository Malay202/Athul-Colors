import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast} from "react-toastify";
import "../assets/adminpage.css";

export default function AdminPage() {
  const [data, setData] = useState([]);

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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/order/${id}`);
      
      // Since axios throws an error for non-2xx responses, we don't need an extra check
      toast.success("Deleted the order successfully!");
  
      // Update state to remove deleted order
      setData(data.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete the order.");
    }
  };
  

  return (
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
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.orderinfo}</td>
                <td className="action-cell">
                  <button className="delete-button" onClick={() => handleDelete(item._id)}>
                    Delete
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
  );
}
