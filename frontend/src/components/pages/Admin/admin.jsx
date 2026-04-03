import React from "react";
import { useNavigate } from "react-router-dom";

function admin() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        { withCredentials: true },
      );
      if (response.data.user) {
        navigate("/admin/posts");
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
    }
  };

  return (
    <div>
      <form>
        <div>
          <label htmlFor="username">아이디</label>
          <input id="username" name="username" />
        </div>
      </form>
    </div>
  );
}

export default admin;
