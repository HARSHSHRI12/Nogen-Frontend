import React, { useState, useEffect } from 'react';
import './Pricing.css';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const [userPlan, setUserPlan] = useState('free');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Use centralized axios instance
    // const API_URL = ... (removed)

    useEffect(() => {
        fetchUserPlan();
    }, []);

    const fetchUserPlan = async () => {
        try {
            // axiosInstance already has baseURL '/api'
            const res = await axiosInstance.get('/profile/me');
            if (res.data.subscription) {
                setUserPlan(res.data.subscription.plan);
            }
        } catch (err) {
            console.error('Error fetching plan', err);
        }
    };

    const handlePayment = async (plan) => {
        if (plan === 'free') return; // Cannot "buy" free
        // If already on this plan or higher, redirect/notify

        setLoading(true);
        try {
            // 1. Create Order
            const { data } = await axiosInstance.post('/payment/create-order', { plan });

            const { order, key_id } = data;

            // 2. Open Razorpay
            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: "Nogen AI",
                description: `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await axiosInstance.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: plan
                        });

                        if (verifyRes.data.success) {
                            alert('Payment Successful! Plan Upgraded.');
                            setUserPlan(plan);
                            // Refresh/redirect
                            window.location.reload();
                        }
                    } catch (error) {
                        alert('Payment verification failed.');
                        console.error(error);
                    }
                },
                prefill: {
                    // We could prefill user details if we had them in context
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert('Payment Failed: ' + response.error.description);
            });
            rzp1.open();

        } catch (error) {
            console.error('Payment initiation failed', error);
            alert(error.response?.data?.message || 'Could not initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pricing-container">
            <div className="pricing-header">
                <h1>Unlock Your Full Potential</h1>
                <p>Choose the plan that best fits your learning journey.</p>
            </div>

            <div className="pricing-grid">
                {/* FREE PLAN */}
                <div className={`pricing-card ${userPlan === 'free' ? 'active-plan' : ''}`}>
                    <div className="plan-name">Basic / Free</div>
                    <div className="plan-price">₹0<span>/mo</span></div>
                    <ul className="plan-features">
                        <li><span className="check-icon">✓</span> Max 10 connections</li>
                        <li><span className="check-icon">✓</span> Text chat only</li>
                        <li><span className="check-icon">✓</span> 5 AI Prompts / day</li>
                        <li><span className="check-icon">✓</span> Run code only</li>
                        <li><span className="check-icon">✓</span> View & Like posts</li>
                    </ul>
                    {userPlan === 'free' ? (
                        <div className="current-plan-badge">Current Plan</div>
                    ) : (
                        <button className="cta-button free" disabled>Included</button>
                    )}
                </div>

                {/* STUDENT PLAN */}
                <div className={`pricing-card ${userPlan === 'student' ? 'active-plan' : ''}`}>
                    <div className="plan-name">Student</div>
                    <div className="plan-price">
                        <span className="original-price">₹599</span>
                        ₹399<span>/mo</span>
                    </div>
                    <ul className="plan-features">
                        <li><span className="check-icon">✓</span> Unlimited Connections</li>
                        <li><span className="check-icon">✓</span> Unlimited Text Chat</li>
                        <li><span className="check-icon">✓</span> 50 AI Prompts / day</li>
                        <li><span className="check-icon">✓</span> Image Sharing</li>
                        <li><span className="check-icon">✓</span> Create Posts & Comments</li>
                    </ul>
                    {userPlan === 'student' ? (
                        <div className="current-plan-badge">Current Plan</div>
                    ) : (
                        <button
                            className="cta-button primary"
                            onClick={() => handlePayment('student')}
                            disabled={loading || userPlan === 'pro'} // Disable if already pro
                        >
                            {userPlan === 'pro' ? 'Downgrade' : 'Upgrade to Student'}
                        </button>
                    )}
                </div>

                {/* PRO PLAN */}
                <div className={`pricing-card popular ${userPlan === 'pro' ? 'active-plan' : ''}`}>
                    <div className="popular-badge">Most Popular</div>
                    <div className="plan-name">Pro</div>
                    <div className="plan-price">
                        <span className="original-price">₹799</span>
                        ₹499<span>/mo</span>
                    </div>
                    <ul className="plan-features">
                        <li><span className="check-icon">✓</span> <b>Everything in Student</b></li>
                        <li><span className="check-icon">✓</span> Unlimited AI Usage</li>
                        <li><span className="check-icon">✓</span> Voice Notes & Media</li>
                        <li><span className="check-icon">✓</span> Verified Badge</li>
                        <li><span className="check-icon">✓</span> Profile & Post Boosting</li>
                        <li><span className="check-icon">✓</span> Priority Support</li>
                    </ul>
                    {userPlan === 'pro' ? (
                        <div className="current-plan-badge">Current Plan</div>
                    ) : (
                        <button
                            className="cta-button primary"
                            onClick={() => handlePayment('pro')}
                            disabled={loading}
                        >
                            Upgrade to Pro
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
