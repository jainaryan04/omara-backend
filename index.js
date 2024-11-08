import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import SeedData from './seed.js';
import express from 'express';

dotenv.config();

const app = express();
const supabaseUrl = 'https://tvsismlsejyvenvykyed.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_KEY is not defined in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', SeedData); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
