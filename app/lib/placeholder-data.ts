// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'lydia',
    password: 'welsea42',
  },
];

const locations=[
  {
    id:1,
    name:"Jelsa"
  },
  {
    id:2,
    name:"Hønefoss"
  }
]

const categories=[
  {
    id:1,
    name:"Food"
  },
  {
    id:2,
    name:"Bed sheets"
  },
  {
    id: 3,
    name:"others"
  },
]

// wrong, need change
const lists = [
  {
    id:1,
    type:"exist",
    location_id:1,
    category_id:1
  },
  {
    id:2,
    type:"want",
    location_id:1,
    category_id:1
  },  
  {
    id:3,
    type:"want",
    location_id:2,
    category_id:2
  },
  {
    id:4,
    type:"exist",
    location_id:2,
    category_id:1
  },
  {
    id:5,
    type:"exist",
    location_id:2,
    category_id:3
  },

];

const items=[
  {
    id:1,
    name:"tomato can",
    quantity:4,
    list_id:1
  },
  {
    id:2,
    name:"tomato can",
    quantity:4,
    list_id:2
  },
  {
    id:3,
    name:"meat ball",
    quantity:1,
    list_id:3
  },
  {
    id:4,
    name:"sausage",
    quantity:2,
    list_id:4
  },
  {
    id:5,
    name:"moose meat",
    quantity:2,
    list_id:3
  }
]

export { users, categories,locations,lists,items};
