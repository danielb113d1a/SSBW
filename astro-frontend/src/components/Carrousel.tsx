import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const images = [
  {
    id: 1,
    url: 'https://picsum.photos/seed/astro1/1200/800',
    title: 'Paisaje Estelar'
  },
  {
    id: 2,
    url: 'https://picsum.photos/seed/astro2/1200/800',
    title: 'Viaje Intergaláctico'
  },
  {
    id: 3,
    url: 'https://picsum.photos/seed/astro3/1200/800',
    title: 'Planeta Desconocido'
  },
  {
    id: 4,
    url: 'https://picsum.photos/seed/astro4/1200/800',
    title: 'Nebulosa Brillante'
  },
  {
    id: 5,
    url: 'https://picsum.photos/seed/astro5/1200/800',
    title: 'Exploración Espacial'
  }
];

const Carrousel = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-base-content mb-2">Carrusel de Imágenes</h1>
        <p className="text-base-content/70">
          Implementado usando <code>Swiper React</code> y DaisyUI. Hidratado con <code>client:load</code>.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-base-300">
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          effect="fade"
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          className="w-full h-[400px] sm:h-[500px] md:h-[600px]"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id}>
              <div className="relative w-full h-full group">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-8 text-white w-full">
                    <h2 className="text-3xl font-bold mb-2 shadow-sm">{img.title}</h2>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carrousel;
