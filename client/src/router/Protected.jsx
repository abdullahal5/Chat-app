import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const Protected = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/" replace={true} />;
  }

  return children;
};

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protected;
