import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Portada from './pages/Portada';
import Tarea9 from './pages/Tarea9';
import ImageCarousel from './pages/ImageCarousel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Portada />} />
          <Route path="tarea9" element={<Tarea9 />} />
          <Route path="carousel" element={<ImageCarousel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
