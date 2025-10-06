// SISTEMA DE AUDITORIA DE IMAGENS COMPLETO E ATUALIZADO
// Mapeamento baseado na auditoria real das páginas (1-27)

import { getFruitAssetUrls } from './assetUrlHelper';

// MAPEAMENTO COMPLETO BASEADO NOS COMPONENTES REAIS
export const AUDITED_IMAGE_MAP = {
  // ====== PÁGINA 1 - LANDING ======
  1: [
    "/lovable-uploads/7b7d27ab-f22a-4116-8992-141c880e5f42.png", // Landing hero (CORRETO)
    // WhatsApp Social Proof carousel images (CRÍTICAS)
    "/lovable-uploads/c980fb3d-da8b-4b95-9002-15f028d30295.png", // Marina
    "/lovable-uploads/54b3c3f2-87cc-4d91-8d31-780f4504436e.png", // Carla
    "/lovable-uploads/86c2973f-151d-4f3c-83d2-88a5385330a2.png", // Juliana
    "/lovable-uploads/ada15dba-52ca-49ab-94d3-35c97f62b1ef.png", // Patricia
    "/lovable-uploads/dc9cdcec-8795-45ee-b8e7-056499336614.png", // Beatriz
    "/lovable-uploads/fc166cd7-abce-4b6d-ba41-59d0e07e2546.png", // Amanda
    "/lovable-uploads/c5f57ed6-f3a1-42d2-bffa-ac8264c5b613.png", // Fernanda
    "/lovable-uploads/0f0b3e5e-9991-4f75-a127-6d03019104b3.png"  // Roberta
  ],

  // ====== PÁGINA 2 - QUESTION 1 (sem imagens) ======
  2: [],

  // ====== PÁGINA 3 - QUESTION 2 - GÊNERO ======
  3: [
    "/lovable-uploads/gender-female-dra-alice-clear.webp", // Gênero feminino
    "/lovable-uploads/gender-male-dra-alice-clear.webp"    // Gênero masculino
  ],

  // ====== PÁGINA 4 - BODY MAP - CORRIGIDO COM IDs REAIS ======
  4: [
    "/lovable-uploads/6c3a3325-1985-4cc4-a41f-8d3599daa4ce.png", // Male body map (CORRETO)
    "/lovable-uploads/99bfc5d4-7a66-41c8-b70c-8a4acf0f5dbb.png", // Female body map (CORRETO)
    // Imagens das 5 áreas do corpo
    "/lovable-uploads/38205f58-d2fe-4e98-bac1-10691787fedc.png", // Culotes
    "/lovable-uploads/ceb04ab6-854c-47ce-a338-1fb43a38f690.png", // Braços
    "/lovable-uploads/c963ffa5-fc98-4f2b-93ec-76afbd0e63eb.png", // Barriga
    "/lovable-uploads/354b2074-7ae9-466b-ba17-94221394f8a1.png", // Coxas
    "/lovable-uploads/2c661a02-b7c7-4144-9d1f-cb7defcbd263.png"  // Glúteos
  ],

  // ====== PÁGINA 5 - AGE - TODAS AS 8 IMAGENS REAIS ======
  5: [
    // Imagens masculinas de idade
    "/lovable-uploads/7573e5f7-fdbf-4498-b6c1-a986d5df7a8a.png", // Male 18-29
    "/lovable-uploads/aa599f6b-777e-463b-98e2-576212bc6024.png", // Male 30-39
    "/lovable-uploads/ff6e48ac-e1e6-48e7-b611-c84e697c39db.png", // Male 40-49
    "/lovable-uploads/5368c3f8-be79-4c02-8b95-85dce74c577c.png", // Male 50+
    // Imagens femininas de idade
    "/lovable-uploads/9ea5f56b-b44a-4ee2-90df-9fcfd0024515.png", // Female 18-29
    "/lovable-uploads/b06d4142-0440-43cd-97fb-3a3401da684f.png", // Female 30-39
    "/lovable-uploads/734b1843-e6ce-42ef-9a9b-7112f1dc6993.png", // Female 40-49
    "/lovable-uploads/ad141648-1244-447c-8bab-467216811b8a.png"  // Female 50+
  ],

  // ====== PÁGINA 6 - WEIGHT IMPACT - CORRIGIDO ======
  6: [], // Uses only Lucide icons (Shirt, Zap, Heart, etc.) - NO IMAGES

  // ====== PÁGINA 7 - SOCIAL PROOF ======
  7: [
    "/lovable-uploads/1dc22174-9e4e-4794-9445-fa26141e7ab5.png" // SocialProof transformation
  ],

  // ====== PÁGINA 8 - BODY TYPE - TODAS AS 8 IMAGENS REAIS ======
  8: [
    // Imagens femininas de tipo corporal
    "/lovable-uploads/c24837e6-ee61-4ba9-b6de-9a200a46762d.png", // Female regular
    "/lovable-uploads/57837bef-7591-4ef9-89b1-8e47b0c1eae5.png", // Female barriga falsa
    "/lovable-uploads/377a8cff-1ed1-469f-980d-ba2699a23f70.png", // Female flacida
    "/lovable-uploads/40f7afd4-e4e2-4df2-8901-489d1700d3c4.png", // Female sobrepeso
    // Imagens masculinas de tipo corporal
    "/lovable-uploads/9d6020ae-3512-402e-acda-4b8509bdee18.png", // Male regular
    "/lovable-uploads/d6dd4652-ad6e-498c-8155-e875e0910b1f.png", // Male barriga falsa
    "/lovable-uploads/96f23253-562e-4671-b88e-44f725230de4.png", // Male flacida
    "/lovable-uploads/a3fb2acc-8c03-4939-b86a-93c5ac1f0efc.png"  // Male sobrepeso
  ],

  // ====== PÁGINA 9 - DAILY ROUTINE (sem imagens) ======
  9: [],

  // ====== PÁGINA 10-22 - WATER INTAKE (IDs CORRETOS) ======
  22: [
    "/lovable-uploads/f18afb48-8006-4d0f-831f-e15d3bc56d44.png", // Male water intake (CORRETO)
    "/lovable-uploads/29d7889c-ff9c-4b67-85a7-ba7de1e439a3.png"  // Female water intake (CORRETO)
  ],

  // ====== PÁGINAS 10-21 - MAPEAMENTO COMPLETO ======
  10: [], // Daily Routine - sem imagens específicas
  11: [   // Weight Loss Barriers - ícones apenas
    // Sem imagens específicas - usa ícones Lucide
  ],
  12: [   // Physical Difficulties - ícones apenas
    // Sem imagens específicas - usa ícones Lucide
  ],
  13: [   // Testimonial - CORRIGIDO COM TODAS AS IMAGENS
    // Femininas (3 imagens)
    "/lovable-uploads/ef33ffb5-2660-456b-840e-208443e97600.png", // Deyse
    "/lovable-uploads/7cc14238-1538-4ba1-ba99-63a3ff38e4ab.png", // Mariana  
    "/lovable-uploads/4134e5e4-d36e-4d27-a67c-033fd72213a1.png", // Ana Paula
    // Masculinas (3 imagens)
    "/lovable-uploads/ec7145cc-8743-40a2-a1aa-10485cb6389c.png", // Carlos
    "/lovable-uploads/20752c73-cf95-486e-80ea-68f6e67d3bd9.png", // Roberto
    "/lovable-uploads/2bcec368-3ea9-46eb-8cea-09d90ec7c930.png"  // Fernando
  ],
  14: [   // VSL Nutritionist Authority - CORRIGIDO
    "/lovable-uploads/p13-poster.jpg" // Video poster correto (usado em CustomVideoPlayer)
  ],
  15: [], // Weight Triggers - ícones apenas
  16: [], // Objecoes Condicionais - sem imagens
  17: [], // Desired Benefits - ícones apenas
  18: [   // Face Transformation - CORRIGIDO
    "/lovable-uploads/1a88bdbc-4114-4664-8d25-6c08ba815a68.png", // Progressão facial
    "/lovable-uploads/53b5bee8-0364-4359-a2cb-5a098011a989.png", // Patricia avatar
    "/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png", // Juliana avatar
    "/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png", // Carla avatar
    "/lovable-uploads/8bb8ee2e-22e9-4cac-9d23-e92ee06b10a1.png", // Patricia media
    "/lovable-uploads/c7038f7e-deca-4699-bcdd-951620998aa2.png", // Juliana media
    "/lovable-uploads/be27528f-2f96-46d9-86d3-ae2c7d8f0779.png"  // Carla media
  ],
  19: [], // Height Weight / Testimonial - sem imagens específicas
  20: [], // Daily Routine Question - sem imagens
  21: [], // Authority Boost / Score IRR / Sleep Hours - sem imagens

  // ====== PÁGINA 23 - FRUIT PREFERENCES - URLS DINÂMICAS RESOLVIDAS ======
  23: getFruitAssetUrls(), // Resolve URLs reais dos imports estáticos

  // ====== PÁGINA 24 - COMPARISON / TRIPLE ANALYSIS ======
  24: [
    // Todas as imagens de body type para comparação
    "/lovable-uploads/c24837e6-ee61-4ba9-b6de-9a200a46762d.png", // Female regular
    "/lovable-uploads/57837bef-7591-4ef9-89b1-8e47b0c1eae5.png", // Female barriga falsa
    "/lovable-uploads/377a8cff-1ed1-469f-980d-ba2699a23f70.png", // Female flacida
    "/lovable-uploads/40f7afd4-e4e2-4df2-8901-489d1700d3c4.png", // Female sobrepeso
    "/lovable-uploads/9d6020ae-3512-402e-acda-4b8509bdee18.png", // Male regular
    "/lovable-uploads/d6dd4652-ad6e-498c-8155-e875e0910b1f.png", // Male barriga falsa
    "/lovable-uploads/96f23253-562e-4671-b88e-44f725230de4.png", // Male flacida
    "/lovable-uploads/a3fb2acc-8c03-4939-b86a-93c5ac1f0efc.png"  // Male sobrepeso
  ],

  // ====== PÁGINA 25 - PRE CHECKOUT ======
  25: [
    "/lovable-uploads/9806ee48-f8bc-4dba-98de-897aac584a40.png", // Deyse avatar principal
    "/lovable-uploads/7e356b84-30b7-4c25-bb0c-e815780ce430.png", // Avatar depoimento 1
    "/lovable-uploads/e8605e35-590c-418b-a109-cb8d514353da.png", // Avatar depoimento 2
    // Todas as imagens de body type para comparação final
    "/lovable-uploads/c24837e6-ee61-4ba9-b6de-9a200a46762d.png", // Female regular
    "/lovable-uploads/57837bef-7591-4ef9-89b1-8e47b0c1eae5.png", // Female barriga falsa
    "/lovable-uploads/377a8cff-1ed1-469f-980d-ba2699a23f70.png", // Female flacida
    "/lovable-uploads/40f7afd4-e4e2-4df2-8901-489d1700d3c4.png", // Female sobrepeso
    "/lovable-uploads/9d6020ae-3512-402e-acda-4b8509bdee18.png", // Male regular
    "/lovable-uploads/d6dd4652-ad6e-498c-8155-e875e0910b1f.png", // Male barriga falsa
    "/lovable-uploads/96f23253-562e-4671-b88e-44f725230de4.png", // Male flacida
    "/lovable-uploads/a3fb2acc-8c03-4939-b86a-93c5ac1f0efc.png"  // Male sobrepeso
  ],

  // ====== PÁGINA 26 - CHECKOUT - COMPLETO COM TODAS AS IMAGENS ======
  26: [
    "/lovable-uploads/p13-poster.jpg", // Video poster
    // Depoimentos no carousel
    "/lovable-uploads/3027f407-e3e3-49d9-b580-9b2a2e329a97.png", // Karolina
    "/lovable-uploads/0c6d3fef-1fb2-4895-9686-e0182a8e27a9.png", // Jessica
    "/lovable-uploads/ba7ba216-78ee-425f-a50d-dc289dcb1b8e.png", // Paulinha
    // Imagens que aparecem após o CTA ser liberado
    "/lovable-uploads/cupom-desconto-50-off.png", // Cupom desconto
    "/lovable-uploads/seu-plano-inclui.png", // Seu plano inclui
    "/lovable-uploads/aplicativo-facil-acesso.png", // Aplicativo
    "/lovable-uploads/garantia-30-dias.png", // Garantia 30 dias
    "/lovable-uploads/nutricionista-camila-santos.png", // Nutricionista
    "/lovable-uploads/progress-chart-transformation.png" // Gráfico progresso
  ],

  // ====== PÁGINA 27 - THANK YOU (sem imagens específicas) ======
  27: []
} as const;