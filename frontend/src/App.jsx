import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VendorDashboard from './pages/VendorDashboard';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import theme from './theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProductProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/category/:id" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<VendorDashboard />} />
              </Routes>
            </MainLayout>
          </Router>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
