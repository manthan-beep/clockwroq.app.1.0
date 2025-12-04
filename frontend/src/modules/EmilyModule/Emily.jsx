import React, { useState, useRef, useEffect } from 'react';
import { Layout, Card, Input, Button, List, Avatar, Typography, Space, Upload, message } from 'antd';
import { SendOutlined, UploadOutlined, UserOutlined, RobotOutlined, PaperClipOutlined } from '@ant-design/icons';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

const Emily = () => {
    const [messages, setMessages] = useState([]);
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
            const token = window.localStorage.getItem('auth_token');
            const response = await fetch('/api/emily/upload', {
                method: 'POST',
                headers: {
                    'x-auth-token': window.localStorage.getItem('x-auth-token'),
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
        <Content style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: 'relative'
        }}>
            {messages.length === 0 ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '100px'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        padding: '10px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <RobotOutlined style={{ fontSize: '48px', color: '#10a37f' }} />
                    </div>
                    <Title level={2} style={{ marginBottom: 0, fontWeight: 600 }}>Hi, how can I get you started today?</Title>
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 20px 120px 20px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={(item) => (
                            <List.Item style={{ borderBottom: 'none', padding: '20px 0' }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    gap: '16px'
                                }}>
                                    <Avatar
                                        icon={item.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                        style={{
                                            backgroundColor: item.role === 'user' ? '#5436DA' : '#10a37f',
                                            flexShrink: 0
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <Text style={{
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: '4px',
                                            color: '#343541'
                                        }}>
                                            {item.role === 'user' ? 'You' : 'Emily'}
                                        </Text>
                                        <div style={{
                                            lineHeight: '1.6',
                                            color: '#374151',
                                            fontSize: '16px'
                                        }}>
                                            <Text style={{ whiteSpace: 'pre-wrap' }}>{item.content}</Text>
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    <div ref={messagesEndRef} />
                </div>
            )}

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%)',
                paddingBottom: '40px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative',
                    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5'
                }}>
                    <Input
                        placeholder="Message Emily..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={handleSendMessage}
                        disabled={isLoading}
                        style={{
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 45px 16px 16px',
                            fontSize: '16px',
                            boxShadow: 'none',
                            backgroundColor: 'transparent'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '8px',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <Upload
                            customRequest={handleUpload}
                            showUploadList={false}
                            disabled={isUploading || isLoading}
                        >
                            <Button
                                type="text"
                                icon={<PaperClipOutlined style={{ fontSize: '18px', color: '#8e8ea0' }} />}
                                disabled={isUploading || isLoading}
                                style={{ padding: '4px 8px' }}
                            />
                        </Upload>
                        <Button
                            type="text"
                            icon={<SendOutlined style={{ fontSize: '18px', color: inputValue.trim() ? '#10a37f' : '#8e8ea0' }} />}
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            style={{ padding: '4px 8px' }}
                        />
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Emily can make mistakes. Consider checking important information.</Text>
                </div>
            </div>
        </Content>
    );
};

export default Emily;
