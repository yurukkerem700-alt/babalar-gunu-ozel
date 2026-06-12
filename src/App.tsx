import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FatherPage from './pages/FatherPage';
import EditPage from './pages/EditPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/baba/:slug" element={<FatherPage />} />
        <Route path="/baba/:slug/edit" element={<EditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
