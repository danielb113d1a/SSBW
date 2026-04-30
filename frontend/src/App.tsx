import Perritos from './components/Perritos';
import Cuadros from './components/Cuadros';

function App() {
  return (
    <div className="flex gap-2 items-center justify-center h-screen font-montserrat">
      <Perritos />
      <Cuadros />
    </div>
  );
}

export default App;
