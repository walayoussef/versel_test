import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Produits from './pages/Produits';
import Commande from './pages/Commande';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/commande" element={<Commande />} />
      </Routes>
    </Router>
  );
}

export default App;
