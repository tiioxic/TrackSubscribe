import React, { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Moon, Bell } from 'lucide-react';

const Settings = ({ settings, onUpdateSettings }) => {
    const [formData, setFormData] = useState({ budget: '0', currency: 'EUR' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (settings) setFormData(settings);
    }, [settings]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMsg) setErrorMsg(''); // Clear error on edit
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            console.log("Saving settings...", formData);
            const result = await onUpdateSettings(formData);
            console.log("Save result:", result);

            if (result && result.success) {
                setSuccessMsg('Paramètres sauvegardés !');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setErrorMsg(result?.error || 'Erreur lors de la sauvegarde.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Une erreur inattendue est survenue.');
        }
    };

    return (
        <div className="settings-page">
            <h1>Paramètres</h1>

            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>Budget Mensuel Cible (€)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="ex: 50.00"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Devise Principale</label>
                    <select name="currency" value={formData.currency} onChange={handleChange}>
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar ($)</option>
                        <option value="GBP">Livre (£)</option>
                    </select>
                </div>



                <button type="submit" className="save-btn">
                    <Save size={18} /> Sauvegarder
                </button>

                {successMsg && <p className="success-msg">{successMsg}</p>}
                {errorMsg && <p className="error-msg">{errorMsg}</p>}
            </form>

            <style>{`
        .settings-page {
          max-width: 600px;
          margin: 0 auto;
        }
        
        h1 {
            margin-bottom: 32px;
        }

        .settings-form {
            background-color: var(--bg-secondary);
            padding: 32px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-subtle);
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .form-group label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .form-group input, .form-group select {
            padding: 12px;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            font-size: 1rem;
        }
        
        .form-group input:focus, .form-group select:focus {
            outline: 2px solid var(--accent-primary);
            border-color: transparent;
        }
        
        .toggle-group {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        
        .toggle-switch {
            width: 48px;
            height: 24px;
            background-color: var(--border-subtle);
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .toggle-switch.active {
            background-color: var(--accent-primary);
        }
        
        .toggle-knob {
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: transform 0.2s;
        }
        
        .toggle-switch.active .toggle-knob {
            transform: translateX(24px);
        }
        
        .save-btn {
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            background-color: var(--text-primary);
            color: var(--bg-primary);
            font-weight: 600;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: opacity 0.2s;
        }
        
        .save-btn:hover {
            opacity: 0.9;
        }
        
        .success-msg {
            color: #10b981;
            text-align: center;
            font-weight: 500;
        }
        
        .error-msg {
            color: var(--danger);
            text-align: center;
            font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default Settings;
