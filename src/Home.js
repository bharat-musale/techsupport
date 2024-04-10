import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // Fixed typo
  const [customerlist, listupdate] = useState(null);

  useEffect(() => {
    let userrole = sessionStorage.getItem("userrole");
    console.log(userrole);
    if (userrole === "admin") {
      navigate("/Admin");
    } else if (userrole === "user") {
      navigate("/Customer");
    } else if (userrole === "techSupport") {
      navigate("/user");
    } else {
      navigate("/nouser");
    }
  }, [navigate]);

 

  return (
    <div>
      <h1 className="text-center">Welcome</h1>
      {/* Render your customer data table here if needed */}
    </div>
  );
};

export default Home;
