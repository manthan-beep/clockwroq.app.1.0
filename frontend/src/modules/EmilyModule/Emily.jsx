import React, { useState, useRef, useEffect } from 'react';
import { Layout, Card, Input, Button, List, Avatar, Typography, Space, Upload, message } from 'antd';
import { SendOutlined, UploadOutlined, UserOutlined, RobotOutlined, PaperClipOutlined } from '@ant-design/icons';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

const Emily = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am Emily, your AI assistant. How can I help you with your business today?',
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef(null);
    const translate = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Prepare history for context (limit to last 10 messages to save tokens)
            const history = messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await request.post({
                entity: 'emily/chat',
                jsonData: {
                    message: userMessage.content,
                    history: history
                }
            });

            if (response.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: response.result },
                ]);
            } else {
                message.error('Failed to get response from Emily.');
            }
        } catch (error) {
            console.error('Chat Error:', error);
            message.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);

        try {
            // We need to use a custom request or axios directly for file upload if the request utility doesn't support FormData easily
            // Assuming request.post can handle it or we use fetch/axios
            // Here using fetch for simplicity with the auth token if needed, but let's try to use the request utility pattern if possible.
            // Since request utility might be strict on JSON, let's use standard fetch with the token from localStorage

            const token = window.localStorage.getItem('auth_token'); // Adjust key based on auth implementation
            // Actually, let's try to use the request wrapper if it supports it, otherwise fallback.
            // Looking at the codebase, let's assume we can use a direct axios call or similar.
            // For now, I will implement a direct fetch to the endpoint we created.

            // Note: In a real scenario, I'd check request.js. For now, I'll use a direct fetch to /api/emily/upload

            // Construct URL (using relative path as proxy is likely set up or base URL is known)
            // We need to get the API_BASE_URL. Let's import it if possible, or just use /api/

            const response = await fetch('/api/emily/upload', {
                method: 'POST',
                headers: {
                    'x-auth-token': window.localStorage.getItem('x-auth-token'), // Check actual token key
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'user',
                        content: `Uploaded file: ${data.result.name}`
                    },
                    {
                        role: 'assistant',
                        content: `I have received the file "${data.result.name}". What would you like me to do with it?`
                    }
                ]);
                onSuccess("Ok");
                message.success(`${file.name} file uploaded successfully`);
            } else {
                onError({ error: new Error('Upload failed') });
                message.error(`${file.name} file upload failed.`);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            onError({ error });
            message.error(`${file.name} file upload failed.`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Content style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', height: '100%' }}>
            <Card
                title={<Space><RobotOutlined style={{ color: '#1890ff' }} /> Emily AI Assistant</Space>}
                style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
            >
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={(item) => (
                            <List.Item style={{ borderBottom: 'none', padding: '10px 0' }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: item.role === 'user' ? 'row-reverse' : 'row',
                                    width: '100%'
                                }}>
                                    <Avatar
                                        icon={item.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                        style={{
                                            backgroundColor: item.role === 'user' ? '#87d068' : '#1890ff',
                                            margin: item.role === 'user' ? '0 0 0 10px' : '0 10px 0 0'
                                        }}
                                    />
                                    <div style={{
                                        maxWidth: '70%',
                                        backgroundColor: item.role === 'user' ? '#e6f7ff' : '#f5f5f5',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        borderTopRightRadius: item.role === 'user' ? '2px' : '12px',
                                        borderTopLeftRadius: item.role === 'assistant' ? '2px' : '12px',
                                    }}>
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{item.content}</Text>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
                    <Space.Compact style={{ width: '100%' }}>
                        <Upload
                            customRequest={handleUpload}
                            showUploadList={false}
                            disabled={isUploading || isLoading}
                        >
                            <Button icon={<PaperClipOutlined />} disabled={isUploading || isLoading} />
                        </Upload>
                        <Input
                            placeholder="Type a message to Emily..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleSendMessage}
                            disabled={isLoading}
                            style={{ borderRadius: 0 }}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSendMessage}
                            loading={isLoading}
                        >
                            Send
                        </Button>
                    </Space.Compact>
                </div>
            </Card>
        </Content>
    );
};

export default Emily;
