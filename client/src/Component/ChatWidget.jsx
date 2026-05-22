import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
       { text: "Welcome to HIRESMART! 💼 I'm your recruitment assistant. Are you looking to hire or searching for your next big role?", sender: 'bot' }
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const query = input;
        setInput('');

        try {
            // Updated endpoint to reflect Job/Hiring context
            const { data } = await axios.post('http://localhost:6102/api/jobs/enquiry', { message: query });
            setMessages(prev => [...prev, { 
                text: data.reply, 
                sender: 'bot', 
                jobs: data.jobs // Changed from products to jobs
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "We're experiencing a high volume of applications. Please try again!", sender: 'bot' }]);
        }
    };

    // Updated to show clean Job Info text
const renderJobInfo = (job) => (
    <div key={job._id} style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255,255,255,0.2)', 
    }}>
        {/* Corrected: job.companyId.name (matches your Company schema) */}
        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#ff4d4d' }}>
            {job.jobTitle} — {job.companyId?.name || "Hiring Company"}
        </div>
        
        <div style={{ fontSize: '13px', margin: '4px 0', lineHeight: '1.4' }}>
            📍 {job.location} | 💼 {job.jobType}
        </div>
        
        <div style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '4px' }}>
            {job.jobDescription?.substring(0, 80)}...
        </div>
        
        {/* Corrected: Accessing the min/max from your salaryRange object */}
        <div style={{ fontWeight: '800', fontSize: '15px' }}>
            Salary: ₹{job.salaryRange?.min?.toLocaleString()} - ₹{job.salaryRange?.max?.toLocaleString()}
        </div>
    </div>
);

    return (
        <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999, fontFamily: 'inherit' }}>
            {/* Main Toggle Button - Professional Navy/Red shadow */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: '#00214f',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0, 33, 79, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.3s',
                    padding: '0'
                }}
            >
                {isOpen ? (
                    <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>✕</span>
                ) : (
                <img 
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Professional Job/Profile icon
                        alt="Hiring Support"
                        style={{ width: '35px', height: '35px', filter: 'invert(1)' }} 
                    />
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '0',
                    width: '360px',
                    maxHeight: '580px',
                    height: '60vh',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0'
                }}>
                    {/* Header - HIRESMART Recruitment Branding */}
                    <div style={{ background: 'linear-gradient(135deg, #00214f 0%, #001a3d 100%)', padding: '20px', color: 'white' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#ff4d4d' }}>●</span> HIRESMART Recruitment AI
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Connecting Talent with Opportunity</div>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '20px' }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: '12px 18px',
                                    borderRadius: m.sender === 'user' ? '20px 20px 2px 20px' : '20px 20px 20px 2px',
                                    backgroundColor: m.sender === 'user' ? '#ff4d4d' : '#00214f', 
                                    color: '#fff', 
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                                }}>
                                    {m.text}
                                    {/* Detailed Job Info Rendered as Text */}
                                    {m.jobs && m.jobs.map(j => renderJobInfo(j))}
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input Footer */}
                    <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
                        <input 
                            style={{ 
                                flex: 1, 
                                padding: '12px 18px', 
                                border: '1px solid #e0e0e0', 
                                borderRadius: '30px', 
                                outline: 'none',
                                fontSize: '14px',
                                backgroundColor: '#f9f9f9'
                            }}
                            placeholder="Ask about 'Java Developer' or 'HR roles'..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            style={{ 
                                backgroundColor: '#00214f', 
                                color: 'white', 
                                border: 'none', 
                                width: '45px', 
                                height: '45px', 
                                borderRadius: '50%', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;