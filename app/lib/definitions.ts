// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  password: string;
};

export type Category = {
  category_id: number;
  category_name: string;
};

export type Location = {
  location_id: number;
  location_name:string;
};

export type List = {
  id:number;
  type:"want"|"exist";
  location_id:number;
  category_id:number;
};

export type Item = {
  id: number;
  name: string;
  list_id:number;
  quantity:number
};

