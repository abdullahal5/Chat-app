import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const CheckIsLogin = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/chat" />;
  } else {
    return children;
  }
};

CheckIsLogin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CheckIsLogin;


