import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthenticationContextProvider } from "./features/authentication/AuthenticationContextProvider";


export default function App() {
  return (
    <AuthenticationContextProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthenticationContextProvider>
  );
}