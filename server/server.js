import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeNexus',
    })
});

app.post('/', async (req, res) => {

    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",      // The model to use for completion
            prompt: `${prompt}`,        // The prompt to complete
            temperature: 0.7,     // The temperature for the model. 0.9 is a good value
            max_tokens: 4000,       // The maximum number of tokens to generate
            top_p: 1,       // The sampling top-p. 1 is the same as greedy sampling
            frequency_penalty: 0,         // The frequency penalty for the model. 0.5 is a good value
            presence_penalty: 0,        // The presence penalty for the model. 0 is a good value
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } 
    catch (error) 
    {
        console.log(error);
        res.status(420).send({error});
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));