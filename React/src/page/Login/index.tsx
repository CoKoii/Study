// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  return (
    <div>
      我是登录页
      {/* <Link to="/article">跳转到文章页</Link> */}
      <button onClick={() => navigate("/article")}>点我跳转到active</button>
    </div>
  );
};
export default Login;
