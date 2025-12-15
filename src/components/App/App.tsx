import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginProvider from '../../contexts/LoginContext';
import ListeCapture from '../ListeCapture';
import Login from '../Login';
import './App.css';
import PagePrincipale from '../PagePrincipale';
import AjouterCapture from '../AjouterCapture';
import ModifierCapture from '../ModifierCapture';

export default function App() {
  return (
    <>
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PagePrincipale />} />
            <Route path="/liste" element={<ListeCapture />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ajouter" element={<AjouterCapture />} />
            <Route path="/modifier/:id" element={<ModifierCapture />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </>
  );
}
