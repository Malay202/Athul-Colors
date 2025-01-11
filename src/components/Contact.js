function Contact() {
  return (
    <form method="post" action="http://localhost:5000/">
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
              />
            </div>

            <div className="col-md-4 mb-1">
              <input
                name="email"
                id="email"
                placeholder="Email"
                className="contact-input"
              />
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
          />
        </div>

        <br></br>
        <div className="row">
          <div className="col-md-8">
            <input className="form-btn" type="submit" value="Submit" />
          </div>
        </div>
      </div>
    </form>
  );
}
export default Contact;
