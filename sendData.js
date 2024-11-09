import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: ['http://localhost:4000', 'https://omara-frontend.vercel.app'],
  }));

async function sendData(supabase) {
    try {
        const data = await getData(supabase);
        return data; 
    } catch (error) {
        console.error("Error in sendData:", error.message);
        throw new Error("Error fetching data in sendData");
    }
}

async function getData(supabase) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*'); 

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw new Error('Error fetching data');
    }
}

export default sendData;
