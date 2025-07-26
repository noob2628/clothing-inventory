import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'data/db.json');

const readData = () => {
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  const { method } = req;
  
  switch (method) {
    case 'GET':
      const data = readData();
      res.status(200).json(data.products);
      break;

    case 'POST':
      const newProduct = { id: uuidv4(), ...req.body };
      const db = readData();
      db.products.push(newProduct);
      writeData(db);
      res.status(201).json(newProduct);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}