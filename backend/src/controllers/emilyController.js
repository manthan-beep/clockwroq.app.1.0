const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Import Models
const Client = require('../models/appModels/Client');
const Invoice = require('../models/appModels/Invoice');

const emilyController = {
    chat: async (req, res) => {
        try {
            const { message, history } = req.body;

            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY is not defined in environment variables');
            }

            // Initialize Gemini
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            // Define Tools
            const tools = [
                {
                    function_declarations: [
                        {
                            name: "create_client",
                            description: "Create a new client or lead in the CRM.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    name: { type: "STRING", description: "Name of the client or company" },
                                    email: { type: "STRING", description: "Email address of the client" },
                                    phone: { type: "STRING", description: "Phone number of the client" },
                                    country: { type: "STRING", description: "Country of the client" }
                                },
                                required: ["name"]
                            }
                        },
                        {
                            name: "create_invoice",
                            description: "Create a new invoice for a client.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    clientName: { type: "STRING", description: "Name of the client to create invoice for" },
                                    itemName: { type: "STRING", description: "Name of the item or service" },
                                    price: { type: "NUMBER", description: "Price of the item" },
                                    quantity: { type: "NUMBER", description: "Quantity of the item" },
                                    description: { type: "STRING", description: "Description of the item" },
                                    date: { type: "STRING", description: "Invoice date (YYYY-MM-DD)" },
                                    dueDate: { type: "STRING", description: "Due date (YYYY-MM-DD)" }
                                },
                                required: ["clientName", "itemName", "price"]
                            }
                        }
                    ]
                }
            ];

            const model = genAI.getGenerativeModel({ model: 'gemini-pro', tools: tools });

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
            You have access to tools to create clients and invoices. Use them when requested.
            Keep your responses concise and relevant to business context.` }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Understood. I am Emily, ready to assist with IDURAR ERP/CRM tasks.' }]
                    },
                    ...chatHistory
                ],
            });

            const result = await chat.sendMessage(message);
            const response = result.response;

            // Check for function calls
            const functionCalls = response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                const { name, args } = call;
                let functionResult;

                if (name === 'create_client') {
                    const newClient = new Client({
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        country: args.country,
                        createdBy: req.admin ? req.admin._id : null // Assuming auth middleware adds user to req
                    });
                    await newClient.save();
                    functionResult = { success: true, message: `Client ${args.name} created successfully with ID: ${newClient._id}` };
                } else if (name === 'create_invoice') {
                    // Find client first
                    const client = await Client.findOne({ name: { $regex: new RegExp(args.clientName, 'i') } });
                    if (!client) {
                        functionResult = { success: false, message: `Client '${args.clientName}' not found. Please create the client first.` };
                    } else {
                        const newInvoice = new Invoice({
                            client: client._id,
                            createdBy: req.admin ? req.admin._id : null,
                            number: Math.floor(Math.random() * 100000), // Simple random number for demo
                            year: new Date().getFullYear(),
                            date: args.date ? new Date(args.date) : new Date(),
                            expiredDate: args.dueDate ? new Date(args.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            items: [{
                                itemName: args.itemName,
                                description: args.description || '',
                                price: args.price,
                                quantity: args.quantity || 1,
                                total: args.price * (args.quantity || 1)
                            }],
                            subTotal: args.price * (args.quantity || 1),
                            total: args.price * (args.quantity || 1),
                            currency: 'USD',
                            paymentStatus: 'unpaid',
                            status: 'draft'
                        });
                        await newInvoice.save();
                        functionResult = { success: true, message: `Invoice created successfully for ${client.name}. Total: ${newInvoice.total}` };
                    }
                }

                // Send function result back to model
                const result2 = await chat.sendMessage([{
                    functionResponse: {
                        name: name,
                        response: functionResult
                    }
                }]);

                return res.status(200).json({
                    success: true,
                    result: result2.response.text(),
                    message: 'Successfully processed request with tool execution',
                });
            }

            return res.status(200).json({
                success: true,
                result: response.text(),
                message: 'Successfully retrieved response from Emily',
            });

        } catch (error) {
            console.error('Emily Chat Error:', error);
            // Return a more descriptive error if it's an API key issue
            if (error.message.includes('API_KEY')) {
                return res.status(500).json({
                    success: false,
                    message: 'Configuration Error: Gemini API Key is missing or invalid.',
                    error: error.message,
                });
            }
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
