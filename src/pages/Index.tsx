import { NutritionQuiz } from '@/components/NutritionQuiz';
import { devLog } from '@/utils/productionLogger';

const Index = () => {
  devLog.log('🔍 Index component rendering...');
  
  return (
    <>
      <NutritionQuiz />
    </>
  );
};

export default Index;
