import { useState, useEffect } from 'react';

export default function Perritos() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then(data => {
        setImage(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dog image:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-80">
      <h2 className="text-xl font-bold mb-4">Perrito Aleatorio</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : image ? (
        <img src={image} alt="Perrito aleatorio" className="w-full h-64 object-cover rounded-xl" />
      ) : (
        <p>Error al cargar la imagen.</p>
      )}
    </div>
  );
}
