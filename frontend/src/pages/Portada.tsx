import { useState } from 'react';

const Portada = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl sm:tracking-tight lg:text-6xl">
            Bienvenido a la Tarea 10
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-base-content/70">
            Explorando React Router, Embla Carousel / Swiper y DaisyUI.
          </p>
        </div>

        <div className="mt-12 bg-base-100 rounded-xl shadow-lg overflow-hidden border border-base-300">
          <div role="tablist" className="tabs tabs-lifted tabs-lg bg-base-200 pt-2 px-2">
            <button 
              role="tab" 
              className={`tab ${activeTab === 1 ? 'tab-active [--tab-bg:var(--color-base-100)]' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              Objetivos
            </button>
            <button 
              role="tab" 
              className={`tab ${activeTab === 2 ? 'tab-active [--tab-bg:var(--color-base-100)]' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              Tecnologías
            </button>
            <button 
              role="tab" 
              className={`tab ${activeTab === 3 ? 'tab-active [--tab-bg:var(--color-base-100)]' : ''}`}
              onClick={() => setActiveTab(3)}
            >
              Resultados
            </button>
          </div>

          <div className="p-8 text-left bg-base-100 min-h-[200px]">
            {activeTab === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold mb-4">Objetivos de la Práctica</h3>
                <ul className="list-disc pl-5 space-y-2 text-lg text-base-content/80">
                  <li>Implementar enrutamiento en una Single Page Application con React Router.</li>
                  <li>Crear un layout principal con barra de navegación persistente.</li>
                  <li>Utilizar una librería de componentes basada en clases de utilidad (DaisyUI).</li>
                  <li>Integrar un carrusel avanzado para presentar imágenes con Swiper.</li>
                </ul>
              </div>
            )}
            
            {activeTab === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold mb-4">Stack Tecnológico</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="badge badge-primary badge-lg">React 19</span>
                  <span className="badge badge-secondary badge-lg">Vite</span>
                  <span className="badge badge-accent badge-lg">Tailwind CSS v4</span>
                  <span className="badge badge-neutral badge-lg">DaisyUI v5</span>
                  <span className="badge badge-info badge-lg">React Router v7</span>
                  <span className="badge badge-success badge-lg">Swiper</span>
                  <span className="badge badge-warning badge-lg">SWR</span>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-bold mb-4">Resultados Esperados</h3>
                <p className="text-lg text-base-content/80">
                  Una aplicación web rápida, con transiciones fluidas entre páginas, un diseño moderno
                  y consistente gracias a Tailwind y DaisyUI, además de un componente de carrusel interactivo
                  perfectamente integrado en el ecosistema React.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portada;
