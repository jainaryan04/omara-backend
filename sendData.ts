import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: ['http://localhost:4000', 'https://omara-frontend.vercel.app'],
}));

// Helper function to fetch all data
async function sendData(supabase) {
    try {
        const data = await getData(supabase);
        return data;
    } catch (error) {
        console.error("Error in sendData:", error.message);
        throw new Error("Error fetching data in sendData");
    }
}

// Function to fetch all data without pagination
async function getData(supabase) {
    try {
        // Fetch all data from Supabase without using range or cursor
        const { data, error } = await supabase
            .from('orders')
            .select('*'); // Fetch all records without pagination

        if (error) {
            throw error;
        }

        // Return all the data
        return { data };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw new Error('Error fetching data');
    }
}

export default sendData;
