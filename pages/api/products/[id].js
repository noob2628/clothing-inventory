import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/db.json');

const readData = () => JSON.parse(fs.readFileSync(dataFilePath));
const writeData = (data) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

export default function handler(req, res) {
  const { id } = req.query;
  const db = readData();
  const product = db.products.find(p => p.id === id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  switch (req.method) {
    case 'GET':
      res.status(200).json(product);
      break;

    case 'PUT':
      const updated = { ...product, ...req.body };
      db.products = db.products.map(p => p.id === id ? updated : p);
      writeData(db);
      res.status(200).json(updated);
      break;

    case 'DELETE':
      db.products = db.products.filter(p => p.id !== id);
      writeData(db);
      res.status(204).end();
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}