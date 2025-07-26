// lib/sizeFields.js
export const sizeFields = {
  TOPS: ['shoulder', 'armhole', 'sleeve', 'sleeveHole', 'underarmSleeve', 'bust', 'middleWidth', 'lowerWidth', 'sideLength', 'middleLength'],
  'PANTS/SHORT': ['waist', 'length', 'inseam', 'fRise', 'leghole', 'hips'],
  SKIRT: ['waist', 'sideLength', 'middleLength', 'middleWidth', 'lowerWidth'],
  DRESS: ['bust', 'shoulder', 'sleeveHole', 'sleeve', 'armhole', 'underarmSleeve', 'waist', 'sideLength', 'middleLength', 'lowerWidth']
};

export const getLabel = (field) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace('fRise', 'Front Rise')
    .toUpperCase();
};