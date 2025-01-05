import img1 from "../img/img1.png"

function About() {
  return (
    <>
      <div
        style={{ marginTop: "15rem", width: "100%", height: "10px" }}
        className="about-scroll"
      ></div>

      <div className="container about">
        <div className="row">
          <div className="col-md-6 text-center">
<<<<<<< HEAD
            <img
              alt="about"
              src=""
              className="img-fluid"
            />
=======
            <img alt="about" src={img1} className="img-fluid" />
>>>>>>> 2e0daae8528f96cc4f5105d13bd4ed108e592408
          </div>
          <div className="col-md-6">
            <h2 className="main-title about-h2">ABOUT</h2>
            <p className="main-p">
              Athul Colours is a company which vision of producing quality paint
              product which comply with all existing standards prevails in the
              market today. The company was set up on 2008 in Alappuzha
              district. Now the company is set up new factory with most modern
              machinaries. Our Quality policy reads – We are committed to
              manufacture and supply Colour Tek Paints products effectively in a
              professional and environment friendly manner, on time and at the
              right cost, with utmost customer satisfaction, while driving to
              become a world class organisation, through continual improvement.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default About;
