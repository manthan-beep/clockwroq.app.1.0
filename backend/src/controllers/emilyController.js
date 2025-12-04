const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const emilyController = {
    chat: async (req, res) => {
        try {
            const { message, history } = req.body;

            // For Gemini, we use a slightly different history format if we want to use the chat session
            // But for simplicity in this stateless request, we can just construct a prompt or use startChat

            // Construct the model
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            // Convert history to Gemini format if needed, or just append context
            // Gemini format: { role: "user" | "model", parts: [{ text: "..." }] }
            const chatHistory = (history || []).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{
                            text: `You are Emily, an intelligent AI assistant for the IDURAR ERP/CRM system. 
            You are helpful, professional, and efficient. 
            You can help users with their business tasks, analyze data, and provide insights.
            Keep your responses concise and relevant to business context.` }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Understood. I am Emily, ready to assist with IDURAR ERP/CRM tasks.' }]
                    },
                    ...chatHistory
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(message);
            const response = result.response;
            const text = response.text();

            return res.status(200).json({
                success: true,
                result: text,
                message: 'Successfully retrieved response from Emily',
            });
        } catch (error) {
            console.error('Emily Chat Error:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while communicating with Emily',
                error: error.message,
            });
        }
    },

    upload: async (req, res) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files were uploaded.',
                });
            }

            const file = req.files.file;
            const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', file.name);

            // Ensure directory exists
            const dir = path.dirname(uploadPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            await file.mv(uploadPath);

            return res.status(200).json({
                success: true,
                result: {
                    name: file.name,
                    path: `/uploads/${file.name}`,
                    size: file.size,
                },
                message: 'File uploaded successfully',
            });
        } catch (error) {
            console.error('Emily Upload Error:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while uploading the file',
                error: error.message,
            });
        }
    },
};

module.exports = emilyController;
