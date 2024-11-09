import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';  
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabaseUrl = 'https://tvsismlsejyvenvykyed.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const statuses = ['pending', 'processing', 'completed', 'cancelled'];

function generateOrders(count) {
  let currentId = 1;

  return Array.from({ length: count }, () => {
    const id = currentId++;
    const customerName = faker.person.fullName();
    const orderAmount = parseFloat((Math.random() * 500).toFixed(2));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      price: parseFloat(faker.commerce.price(5, 100)),
    }));
    
    const fromDate = new Date(2020, 0, 1); 
    const toDate = new Date(2025, 0, 1);   
    
    const createdAt = faker.date.between({ from: fromDate, to: toDate }).toISOString();

    return {
      id,
      customer_name: customerName,
      order_amount: orderAmount,
      status,
      items,
      created_at: createdAt,
    };
  });
}


async function seedOrders() {
  await deleteAllOrders();  
  const orders = generateOrders(10000);

  try {
    const batchSize = 1000;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);

      const { error } = await supabase
        .from('orders')  
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
      } else {
        console.log(`Batch ${i / batchSize + 1} inserted successfully.`);
      }
    }

    console.log('Seeding complete');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
}

async function deleteAllOrders() {
  const { error } = await supabase
    .from('orders')
    .delete()
    .in('status', ['completed', 'processing', 'pending', 'cancelled']);
  
  if (error) {
    console.error('Error deleting orders:', error.message);
  }
}



export default seedOrders;
