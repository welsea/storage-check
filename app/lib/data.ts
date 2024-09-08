import { sql } from '@vercel/postgres';
import {
  Category, Location
} from './definitions';

export async function fetchLocation() {
  try {
    const data = await sql<Location>`SELECT location_name,location_id FROM locations`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch location data.');
  }
}

export async function fetchCategory() {
  try {
    const data = await sql<Category>`
      SELECT category_name,category_id FROM categories`;
    let result=data.rows
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchLists(location: string, category: string) {
  try {
    const bothNeed=`SELECT 
          l.list_id,
          l.list_type,
          loc.location_name,
          cat.category_name,
          i.item_name,
          i.quantity
      FROM 
          lists l
      JOIN 
          locations loc ON l.location_id = loc.location_id
      JOIN 
          categories cat ON l.category_id = cat.category_id
      LEFT JOIN 
          items i ON l.list_id = i.list_id
  `;

  const existList = await sql `${bothNeed}
          WHERE 
          loc.location_name = '${location}'  
          AND cat.category_name = '${category}'
          AND l.list_type = 'exist'  
      ORDER BY 
          i.item_name;
  `

  const wantList = await sql `${bothNeed}
          WHERE 
          loc.location_name = '${location}'  
          AND cat.category_name = '${category}'
          AND l.list_type = 'exist'  
      ORDER BY 
          i.item_name;
  `
  const data=[existList, wantList]
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

