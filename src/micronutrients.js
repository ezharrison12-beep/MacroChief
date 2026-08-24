export const MICRONUTRIENT_TARGETS = {
  vitaminA: { label: 'Vitamin A', unit: 'mcg', target: 900 },
  vitaminC: { label: 'Vitamin C', unit: 'mg', target: 90 },
  vitaminD: { label: 'Vitamin D', unit: 'mcg', target: 15 },
  vitaminE: { label: 'Vitamin E', unit: 'mg', target: 15 },
  vitaminK: { label: 'Vitamin K', unit: 'mcg', target: 120 },
  calcium: { label: 'Calcium', unit: 'mg', target: 1000 },
  iron: { label: 'Iron', unit: 'mg', target: 8 },
  magnesium: { label: 'Magnesium', unit: 'mg', target: 400 },
  potassium: { label: 'Potassium', unit: 'mg', target: 3400 },
  zinc: { label: 'Zinc', unit: 'mg', target: 11 },
  folate: { label: 'Folate', unit: 'mcg', target: 400 },
  vitaminB12: { label: 'Vitamin B12', unit: 'mcg', target: 2.4 }
};

export const FOOD_MICRONUTRIENTS = {
  'chicken-breast': { vitaminB12: 0.3, zinc: 1, magnesium: 29, iron: 1 },
  rice: { magnesium: 19, iron: 2, zinc: 1 },
  eggs: { vitaminA: 160, vitaminD: 2.2, vitaminB12: 1.1, folate: 47, iron: 1.8 },
  oats: { magnesium: 61, iron: 1.7, zinc: 1.5, folate: 14 },
  'greek-yogurt': { calcium: 190, vitaminB12: 1, potassium: 240 },
  banana: { vitaminC: 10, potassium: 422, magnesium: 32, folate: 24 },
  avocado: { vitaminK: 21, vitaminE: 1.3, folate: 59, potassium: 485, magnesium: 29 },
  salmon: { vitaminD: 10, vitaminB12: 3.2, vitaminB6: 0.6, potassium: 363 },
  'sweet-potato': { vitaminA: 1400, vitaminC: 22, potassium: 542, magnesium: 31 },
  whey: { calcium: 120, iron: 0.5 },
  'peanut-butter': { vitaminE: 3, magnesium: 49, zinc: 1 },
  broccoli: { vitaminA: 68, vitaminC: 81, vitaminK: 92, folate: 57, calcium: 62, potassium: 457 }
};

export function emptyMicronutrients() {
  return Object.keys(MICRONUTRIENT_TARGETS).reduce((result, key) => {
    result[key] = 0;
    return result;
  }, {});
}

export function calculateMicronutrients(meals) {
  const totals = emptyMicronutrients();
  meals.forEach(meal => {
    const nutrients = FOOD_MICRONUTRIENTS[meal.id] || {};
    Object.keys(nutrients).forEach(key => {
      if (key in totals) totals[key] += nutrients[key];
    });
  });
  return totals;
}
