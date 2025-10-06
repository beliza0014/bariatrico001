import { useMemo } from 'react';

// HOOK ESTÁVEL: Previne re-renders desnecessários dos testimonials
export const useStableTestimonials = () => {
  return useMemo(() => [{
    name: 'Amanda',
    message: '15kg em 29 dias! Até minha sogra pediu a dica! 😍',
    mediaSrc: '/lovable-uploads/fc166cd7-abce-4b6d-ba41-59d0e07e2546.png',
    time: '15:20'
  }, {
    name: 'Roberta',
    message: '12kg em 25 dias! Achei que estava "velha demais". Hoje me sinto PODEROSA! 💼🔥',
    mediaSrc: '/lovable-uploads/0f0b3e5e-9991-4f75-a127-6d03019104b3.png',
    time: '17:45'
  }, {
    name: 'Juliana',
    message: '14kg em 28 dias! Dormia mal e o casamento esfriou. Agora tudo RENASCEU! ❤️',
    mediaSrc: '/lovable-uploads/86c2973f-151d-4f3c-83d2-88a5385330a2.png',
    time: '16:42'
  }, {
    name: 'Beatriz',
    message: '16kg em 30 dias! Minhas amigas gastaram fortunas. Eu paguei quase nada e tive o melhor resultado! 💰✨',
    mediaSrc: '/lovable-uploads/dc9cdcec-8795-45ee-b8e7-056499336614.png',
    time: '13:57'
  }, {
    name: 'Marina',
    message: '11kg em 24 dias! Nada servia mais. Hoje voltei ao meu tamanho! 😍',
    mediaSrc: '/lovable-uploads/c980fb3d-da8b-4b95-9002-15f028d30295.png',
    time: '14:23'
  }, {
    name: 'Fernanda',
    message: '9kg em 21 dias! Voltei a usar minhas roupas antigas. Pura economia! 💸',
    mediaSrc: '/lovable-uploads/c5f57ed6-f3a1-42d2-bffa-ac8264c5b613.png',
    time: '10:08'
  }, {
    name: 'Patrícia',
    message: '10kg em 22 dias! Meu marido voltou a me notar. Nossa conexão reacendeu! 💑',
    mediaSrc: '/lovable-uploads/ada15dba-52ca-49ab-94d3-35c97f62b1ef.png',
    time: '11:30'
  }, {
    name: 'Carla',
    message: '16kg em 30 dias! Achei que a menopausa impediria. Estava errada — consegui! 🎉',
    mediaSrc: '/lovable-uploads/54b3c3f2-87cc-4d91-8d31-780f4504436e.png',
    time: '09:15'
  }], []);
};