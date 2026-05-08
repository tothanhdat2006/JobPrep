// ProtectedRoute is no longer needed since authentication has been removed
// Routes are now freely accessible
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;
