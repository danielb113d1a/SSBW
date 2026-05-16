import Perritos from '../components/Perritos';
import Cuadros from '../components/Cuadros';

const Tarea9 = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center py-10">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-base-content mb-2">Tarea 9</h1>
        <p className="text-base-content/70">Componentes de la tarea anterior consumiendo APIs con SWR.</p>
      </div>
      
      <div className="flex flex-wrap gap-8 items-start justify-center w-full">
        <div className="w-full max-w-md bg-base-100 p-6 rounded-box shadow-lg border border-base-200">
          <Perritos />
        </div>
        
        <div className="w-full max-w-md bg-base-100 p-6 rounded-box shadow-lg border border-base-200">
          <Cuadros />
        </div>
      </div>
    </div>
  );
};

export default Tarea9;
