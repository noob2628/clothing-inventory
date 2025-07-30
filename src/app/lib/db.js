// src/app/lib/db.js
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/db.json');

export const readData = async () => {
  try {
    const rawData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    // If file doesn't exist, return default data
    if (error.code === 'ENOENT') {
      return { products: [] };
    }
    throw error;
  }
};

export const writeData = async (data) => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};