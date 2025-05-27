import './styles/App.css'
import NavBar from './components/Navbar'
import AppRouter from './components/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <AppRouter />
        <ScrollToTopButton/>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
