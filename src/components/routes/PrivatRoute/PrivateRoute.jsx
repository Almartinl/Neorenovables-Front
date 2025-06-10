import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import Layout from "../../Layout";

export default function PrivateRoute({ allowedRoles }) {
  const { dataToken } = useAuthContext();

  return allowedRoles?.includes(dataToken.role) ? (
    <Layout />
  ) : dataToken?.email ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login" />
  );
}
