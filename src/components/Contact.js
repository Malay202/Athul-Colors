import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderinfo: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/;
    return emailPattern.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.orderinfo) {
      errors.orderinfo = 'Order details are required';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setIsSubmitted(true);
      // Optionally, you can handle form submission here (e.g., send data to a server)
    } else {
      setFormErrors(errors);
      setIsSubmitted(false);
    }
  };

  return (
    <form method="post" action="http://localhost:8080/" onSubmit={handleSubmit}>
      <div className="container contact">
        <h2 className="main-title text-center">CONTACT</h2>

        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4 mb-1">
              <input
                name="name"
                id="name"
                placeholder="Name"
                className="contact-input"
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && <span style={{ color: 'red'}}>{formErrors.name}</span>}
            </div>

            <div className="col-md-4 mb-1">
              <input
                name="email"
                id="email"
                placeholder="Email"
                className="contact-input"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <span style={{ color: 'red'}}>{formErrors.email}</span>}
            </div>
          </div>
        </div>
        <br />
        <div className="col-md-8">
          <textarea
            name="orderinfo"
            id="orderinfo"
            placeholder="Add your order details"
            className="contact-textarea"
            value={formData.orderinfo}
            onChange={handleChange}
          />
          {formErrors.orderinfo && <span style={{ color: 'red' }}>{formErrors.orderinfo}</span>}
        </div>

        <br></br>
        <div className="row">
          <div className="col-md-8">
            <input className="form-btn" type="submit" value="Submit" />
          </div>
        </div>

        {isSubmitted && <p style={{ color: 'green', fontSize: 30}}>Order placed.</p>}
      </div>
    </form>
  );
}

export default Contact;
