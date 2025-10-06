// HELPER PARA RESOLVER URLs DE ASSETS ESTÁTICOS
// Resolve o conflito entre imports estáticos e URLs dinâmicas para o sistema de preload

// Importações das frutas (resolve para URLs com hash)
import abacaxiImage from '@/assets/fruit-abacaxi-realistic.png';
import laranjaImage from '@/assets/fruit-laranja-realistic.png';
import limaoImage from '@/assets/fruit-limao-realistic.png';
import macaImage from '@/assets/fruit-maca-realistic.png';
import morangoImage from '@/assets/fruit-morango-realistic.png';
import tangerinaImage from '@/assets/fruit-tangerina-realistic.png';
import maracujaImage from '@/assets/fruit-maracuja-realistic.png';
import uvaImage from '@/assets/fruit-uva-realistic.png';
import cocoImage from '@/assets/fruit-coco-realistic.png';
import mangaImage from '@/assets/fruit-manga-realistic.png';
import melanciaImage from '@/assets/fruit-melancia-realistic.png';
import melaoImage from '@/assets/fruit-melao-realistic.png';
import hortelaImage from '@/assets/fruit-hortela-realistic.png';

// MAPEAMENTO: Resolve as URLs reais usadas pelo sistema
export const FRUIT_ASSET_URLS = [
  abacaxiImage,
  laranjaImage,
  limaoImage,
  macaImage,
  morangoImage,
  tangerinaImage,
  maracujaImage,
  uvaImage,
  cocoImage,
  mangaImage,
  melanciaImage,
  melaoImage,
  hortelaImage
] as const;

// UTILITÁRIO: Obter todas as URLs reais das frutas
export const getFruitAssetUrls = (): string[] => {
  return [...FRUIT_ASSET_URLS]; // Spread para criar array mutável
};