import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Cuadros() {
  const { data, error, isLoading, mutate } = useSWR('http://localhost:3000/api/random-image', fetcher);

  const Recarga = () => {
    mutate();
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-80">
      <h2 className="text-xl font-bold mb-4">Cuadro Aleatorio</h2>
      {isLoading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error al cargar el cuadro.</p>
      ) : data?.url ? (
        <img src={data.url} alt="Cuadro aleatorio" className="w-full h-64 object-cover rounded-xl mb-4" />
      ) : (
        <p>No se encontró la imagen.</p>
      )}
      <button onClick={Recarga} className="font-bold cursor-pointer bg-olive-300 p-4 rounded-xl hover:bg-olive-400 transition-colors mt-2">
        Recargar
      </button>
    </div>
  );
}
