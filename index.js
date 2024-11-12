import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: 'https://omara-frontend.vercel.app', 
  }));
  

const supabaseUrl = 'https://tvsismlsejyvenvykyed.supabase.co'; 
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function sendData(supabase, cursor = null, limit = 10) {
    try {
        const data = await getData(supabase, cursor, limit); 
        return data;
    } catch (error) {
        console.error("Error in sendData:", error.message);
        throw new Error("Error fetching data in sendData");
    }
}

async function getData(supabase, cursor = null, limit = 10) {
    try {
        let query = supabase
            .from('orders') 
            .select('*')
            .order('id', { ascending: true }) 
            .limit(limit);

        if (cursor) {
            query = query.gt('id', cursor); 
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        const nextCursor = data.length > 0 ? data[data.length - 1].id : null; 

        return {
            data, 
            nextCursor, 
        };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw new Error('Error fetching data');
    }
}

app.get('/send', async (req, res) => {
    try {
      const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null; 
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; 

        const data = await sendData(supabase, cursor, limit);
        res.json(data); 
    } catch (error) {
        console.error('Error in /send route:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
