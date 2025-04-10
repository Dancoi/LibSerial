import './styles/App.css'
import NavBar from './components/Navbar'
import AppRouter from './components/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
