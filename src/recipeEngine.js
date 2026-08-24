export function generateRecipe({ calories, protein, carbs, fat, mealType = 'Dinner', ingredients = '' }) {
  const ingredientList = ingredients.split(',').map(x => x.trim()).filter(Boolean);
  const primary = ingredientList[0] || 'chicken breast';
  const templates = {
    Breakfast: { name: 'High-Protein Breakfast Bowl', base: ['eggs', 'oats', 'banana'] },
    Lunch: { name: 'MacroChief Power Bowl', base: [primary, 'rice', 'broccoli'] },
    Dinner: { name: 'Balanced Protein Bowl', base: [primary, 'rice', 'avocado'] },
    Snack: { name: 'Protein Yogurt Bowl', base: ['greek yogurt', 'banana', 'peanut butter'] }
  };
  const template = templates[mealType] || templates.Dinner;
  return {
    title: template.name,
    description: `A ${mealType.toLowerCase()} designed around your remaining nutrition targets.`,
    targetCalories: Math.max(300, Math.round(calories || 600)),
    targetProtein: Math.max(15, Math.round(protein || 35)),
    targetCarbs: Math.round(carbs || 50),
    targetFat: Math.round(fat || 20),
    ingredients: template.base.map((name, i) => ({ name, amount: i === 0 ? '150 g' : i === 1 ? '1 cup' : '1 serving' })),
    steps: ['Prepare the protein and carbohydrate base.', 'Add vegetables or fruit and your selected toppings.', 'Season to taste, combine, and adjust the portion to your target.', 'Log the finished meal in MacroChief.']
  };
}
