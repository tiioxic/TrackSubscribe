import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:3001/api';

export const PERIODS = {
    MONTHLY: { label: 'Mensuel', value: 'Monthly' },
    YEARLY: { label: 'Annuel', value: 'Yearly' },
    WEEKLY: { label: 'Hebdomadaire', value: 'Weekly' }
};

export const CATEGORY_EMOJIS = {
    'Divertissement': '🎬',
    'Gaming': '🎮',
    'Travail': '💼',
    'Utilitaires': '🛠️',
    'Bien-être': '🌿',
    'Software': '💻',
    'Investissements': '📈',
    'Crypto': '🚀',
    'Autre': '📦'
};

const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [settings, setSettings] = useState({ budget: '0', currency: 'EUR' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch subscriptions from the backend
    const fetchSubscriptions = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions`);
            if (!response.ok) throw new Error('Failed to fetch subscriptions');
            const data = await response.json();
            // Transform startDate string back to Date object for frontend usage if needed, 
            // but for now we keep it as YYYY-MM-DD string as stored.
            setSubscriptions(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch settings
    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data = await response.json();
            // Merge with defaults
            setSettings(prev => ({ ...prev, ...data }));
        } catch (err) {
            console.error(err);
            // Don't set global error for settings failure, just log it
        }
    };

    useEffect(() => {
        fetchSubscriptions();
        fetchSettings();
    }, []);

    // Add a new subscription
    const addSubscription = async (newSub) => {
        // Calculate status based on startDate? For now default to active or user provided
        const subToAdd = {
            ...newSub,
            status: newSub.status || 'active',
            category: newSub.category || 'Other',
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_URL}/subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subToAdd),
            });

            if (!response.ok) throw new Error('Failed to add subscription');

            // To ensure UI consistency, refetch all or append manually
            // Optimistic update could be faster, but fetching ensures sync
            await fetchSubscriptions();
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    };

    // Update an existing subscription
    const updateSubscription = async (updatedSub) => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/${updatedSub.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSub),
            });

            if (!response.ok) throw new Error('Failed to update subscription');

            await fetchSubscriptions();
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    };

    // Remove a subscription
    const removeSubscription = async (id) => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete subscription');

            await fetchSubscriptions();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    // Update settings
    const updateSettings = async (newSettings) => {
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings),
            });
            if (!response.ok) throw new Error('Failed to update settings');
            setSettings(prev => ({ ...prev, ...newSettings }));
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        let monthly = 0;
        let yearly = 0;
        let weekly = 0;
        const categoryTotals = {};

        // Only count active subscriptions
        const activeSubs = subscriptions.filter(sub => sub.status !== 'paused');

        activeSubs.forEach(sub => {
            const price = parseFloat(sub.price);
            let monthlyPrice = 0;

            const period = sub.period ? sub.period.toLowerCase() : 'monthly';

            if (period === 'monthly') {
                monthly += price;
                yearly += price * 12;
                weekly += (price * 12) / 52;
                monthlyPrice = price;
            } else if (period === 'yearly') {
                monthly += price / 12;
                yearly += price;
                weekly += price / 52;
                monthlyPrice = price / 12;
            } else if (period === 'weekly') {
                monthly += price * 4.33; // Average weeks in a month
                yearly += price * 52;
                weekly += price;
                monthlyPrice = price * 4.33;
            }

            // Category Totals (Monthly Basis)
            const cat = sub.category || 'Other';
            if (!categoryTotals[cat]) categoryTotals[cat] = 0;
            categoryTotals[cat] += monthlyPrice;
        });

        return {
            weekly: Math.round(weekly * 100) / 100,
            monthly: Math.round(monthly * 100) / 100,
            yearly: Math.round(yearly * 100) / 100,
            byCategory: categoryTotals
        };
    };

    return {
        subscriptions,
        settings,
        addSubscription,
        updateSubscription,
        removeSubscription,
        updateSettings,
        totals: calculateTotals(),
        loading,
        error
    };
};

export default useSubscriptions;
