// src/app/lib/sizeFields.js
const topsFields = ['shoulder', 'armhole', 'sleeve', 'sleeveHole', 'underarmSleeve', 'bust', 'middleWidth', 'lowerWidth', 'sideLength', 'middleLength'];
const pantsShortFields = ['waist', 'length', 'inseam', 'fRise', 'leghole', 'hips'];
const skirtFields = ['waist', 'sideLength', 'middleLength', 'middleWidth', 'lowerWidth'];
const dressFields = ['bust', 'shoulder', 'sleeveHole', 'sleeve', 'armhole', 'underarmSleeve', 'waist', 'sideLength', 'middleLength', 'lowerWidth'];

// Combine TOPS and PANTS/SKIRT for TERNO
const ternoFields = [...new Set([...topsFields, ...pantsShortFields, ...skirtFields])];
// Combine all fields for NO CATEGORY
const allFields = [...new Set([
  ...topsFields, 
  ...pantsShortFields, 
  ...skirtFields, 
  ...dressFields
])];

export const sizeFields = {
  'NO CATEGORY': allFields,
  TOPS: topsFields,
  'PANTS/SHORT': pantsShortFields,
  SKIRT: skirtFields,
  DRESS: dressFields,
  TERNO: ternoFields,
};

export const getLabel = (field) => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace('fRise', 'Front Rise')
    .toUpperCase();
};
