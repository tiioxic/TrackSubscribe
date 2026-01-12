import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, Label } from 'recharts';
import { Hourglass } from 'lucide-react';
import SubscriptionCard from './SubscriptionCard';
import CurrencyEuroIcon from './ui/CurrencyEuroIcon';
import { CATEGORY_EMOJIS } from '../hooks/useSubscriptions';

// Predefined colors for categories
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = ({ subscriptions, totals, settings, onRemove, onEdit }) => {
    const budget = parseFloat(settings.budget) || 0;
    const monthlyCost = totals.monthly;
    const budgetUsage = budget > 0 ? (monthlyCost / budget) * 100 : 0;
    const isOverBudget = monthlyCost > budget;

    const barData = [
        { name: 'Hebdo', value: totals.weekly },
        { name: 'Mensuel', value: totals.monthly },
        { name: 'Annuel', value: totals.yearly / 12 },
    ];

    const pieData = Object.entries(totals.byCategory || {}).map(([name, value], index) => ({
        name: `${CATEGORY_EMOJIS[name] || '📦'} ${name}`,
        value: Math.round(value * 100) / 100,
        plainName: name // Keep original name for key or other uses if needed
    })).filter(item => item.value > 0);

    const activeSubs = subscriptions.filter(sub => sub.status !== 'paused');

    // Logic for Upcoming Payments (Next 30 days)
    const today = new Date();

    const calculateNextPayment = (startDate, period) => {
        if (!startDate) return new Date(); // Fallback
        let nextDate = new Date(startDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        // If start date is in future, that's the next payment
        if (nextDate > now) return nextDate;

        while (nextDate <= now) {
            switch (period) {
                case 'Yearly':
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    break;
                case 'Weekly':
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case 'Monthly':
                default:
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;
            }
        }
        return nextDate;
    };

    const upcomingPayments = subscriptions
        .filter(sub => sub.status === 'active')
        .map(sub => {
            const nextDate = calculateNextPayment(sub.startDate, sub.period);
            return { ...sub, nextPayment: nextDate };
        })
        .sort((a, b) => a.nextPayment - b.nextPayment)
        .slice(0, 5); // Show top 5

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Tableau de Bord</h1>
                <p className="subtitle">Vue d'ensemble des dépenses récurrentes</p>
            </header>

            <div className="dashboard-layout">
                {/* Left Column: Stats & Charts */}
                <div className="main-column">
                    <section className="stats-grid">
                        <StatsCard label="Budget Mensuel" value={budget} />
                        <StatsCard label="Coût Mensuel" value={totals.monthly} />
                        <StatsCard label="Coût Annuel" value={totals.yearly} />
                        <StatsCard label="Abos Actifs" value={activeSubs.length} isCurrency={false} />
                    </section>

                    {/* Budget Indicator */}


                    <div className="charts-wrapper">
                        <section className="viz-section">
                            <h3>Dépenses</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                                            itemStyle={{ color: 'var(--text-primary)' }}
                                            cursor={{ fill: 'var(--bg-tertiary)' }}
                                            formatter={(value) => [`${value.toFixed(2)}€`, undefined]}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="viz-section">
                            <h3>Par Catégorie</h3>
                            <div className="chart-container pie-container">
                                {pieData.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={85}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                                                    itemStyle={{ color: 'var(--text-primary)' }}
                                                    formatter={(value) => [`${value.toFixed(2)}€`, undefined]}
                                                />
                                                <Legend
                                                    layout="horizontal"
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    iconSize={8}
                                                    iconType="circle"
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="pie-center-text">
                                            {budget > 0 ? (
                                                <>
                                                    <span className="pie-value">{Math.min(Math.round(budgetUsage), 999)}%</span>
                                                    <span className="pie-label">du budget</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="pie-value">{Math.round(totals.monthly)}€</span>
                                                    <span className="pie-label">/mois</span>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-chart">Pas de données</div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Upcoming Payments to fill the void */}
                    <section className="upcoming-section">
                        <h3>Prochaines Échéances</h3>
                        <div className="upcoming-grid">
                            {upcomingPayments.length > 0 ? (
                                upcomingPayments.map(sub => (
                                    <div key={sub.id} className="upcoming-item">
                                        <div className="upcoming-date">
                                            <span className="day">{sub.nextPayment.getDate()}</span>
                                            <span className="month">{formatDate(sub.nextPayment).split(' ')[1]}</span>
                                        </div>
                                        <div className="upcoming-info">
                                            <span className="upcoming-name">
                                                {sub.name}
                                                {!!sub.pauseAtRenewal && (
                                                    <span
                                                        title="Pause planifiée"
                                                        style={{
                                                            marginLeft: '6px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                                            borderRadius: '4px',
                                                            padding: '2px',
                                                            verticalAlign: 'middle',
                                                            height: '16px',
                                                            width: '16px'
                                                        }}
                                                    >
                                                        <Hourglass size={10} color="#f59e0b" />
                                                    </span>
                                                )}
                                            </span>
                                            <span className="upcoming-price">{parseFloat(sub.price).toFixed(2)}€</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-text">Aucune échéance proche</div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Active Subscriptions List */}
                <aside className="side-column">
                    <section className="subs-section">
                        <h3>Abonnements ({activeSubs.length})</h3>
                        <div className="list-container">
                            {activeSubs.length === 0 ? (
                                <div className="empty-state">
                                    Aucun abonnement actif.
                                </div>
                            ) : (
                                <div className="subs-scroll-area">
                                    {activeSubs.map((sub, idx) => (
                                        <SubscriptionCard
                                            key={sub.id}
                                            subscription={sub}
                                            onRemove={onRemove}
                                            onEdit={onEdit}
                                            index={idx}
                                            showCategory={true}
                                            showStatus={false}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </aside>
            </div>

            <style>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden; /* Prevent dashboard itself from causing scroll */
        }

        .dashboard-header {
          margin-bottom: 24px;
          flex-shrink: 0;
        }
        
        .subtitle {
            color: var(--text-secondary);
            margin-top: 4px;
        }

        .dashboard-layout {
            display: grid;
            grid-template-columns: 1fr 340px; /* Adjusted sidebar width */
            gap: 24px;
            align-items: start; /* Allow columns to be natural height apart from max constraints */
            flex: 1;
            min-height: 0; /* Crucial for nested scroll */
            padding-bottom: 0;
            overflow: hidden; /* Contain children */
        }

        /* Adjustments for Main Column */
        .main-column {
            display: flex;
            flex-direction: column;
            gap: 24px;
            overflow-y: auto;
            padding-right: 8px; /* Space for scrollbar */
            height: 100%; /* Main column usually takes full height for scrolling charts etc */
            max-height: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          flex-shrink: 0; /* Don't shrink stats */
        }
        
        .charts-wrapper {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            flex-shrink: 0; /* Don't shrink charts */
        }

        .viz-section {
          background-color: var(--bg-secondary);
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          height: 300px;
          display: flex;
          flex-direction: column;
        }
        
        .upcoming-section {
            background-color: var(--bg-secondary);
            padding: 24px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-subtle);
            flex-shrink: 0; /* Don't shrink upcoming */
            margin-bottom: 24px; /* Bottom spacing */
        }
        
        .upcoming-grid {
            display: flex; /* Changed from grid to flex for horizontal scroll */
            gap: 12px;
            margin-top: 16px;
            overflow-x: auto;
            padding-bottom: 8px; /* Space for scrollbar */
        }
        
        .upcoming-grid::-webkit-scrollbar {
             height: 6px;
        }
        .upcoming-grid::-webkit-scrollbar-thumb {
            background-color: var(--bg-tertiary);
            border-radius: 4px;
        }
        
        .upcoming-item {
            flex-shrink: 0; /* Prevent shrinking */
            width: 180px; /* Fixed width for better scroll flow */
            background-color: var(--bg-primary);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-md);
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .upcoming-date {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--bg-tertiary);
            padding: 4px 8px;
            border-radius: 6px;
            min-width: 40px;
        }
        
        .upcoming-date .day { font-weight: 700; font-size: 1.1rem; color: var(--text-primary); }
        .upcoming-date .month { font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); }
        
        .upcoming-info {
            display: flex;
            flex-direction: column;
        }
        
        .upcoming-name { font-weight: 500; font-size: 0.9rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
        .upcoming-price { font-size: 0.8rem; color: var(--text-muted); }

        /* Side Column Fix */
        .side-column {
            display: flex;
            flex-direction: column;
            height: auto; /* Allow natural height */
            max-height: 100%; /* But constrain to viewport */
            overflow: hidden; /* Force containment */
        }

        .subs-section {
            background-color: var(--bg-secondary);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-subtle);
            padding: 20px;
            display: flex;
            flex-direction: column;
            max-height: 100%; /* Inherit constraint */
            overflow: hidden; /* Contain children */
        }
        
        .subs-section h3 {
            flex-shrink: 0;
            margin-bottom: 16px;
        }

        .list-container {
            display: flex;
            flex-direction: column;
            min-height: 0; /* Allow shrinking */
            flex-shrink: 1; /* Allow this container to shrink to fit max-height */
            overflow: hidden;
        }

        .subs-scroll-area {
            overflow-y: auto;
            padding-right: 4px; /* Reduced padding to keep scrollbar tight */
            /* No fixed height, let it fill available space in flex container */
        }

        /* Scrollbar styling */
        .subs-scroll-area::-webkit-scrollbar, 
        .main-column::-webkit-scrollbar { 
            width: 6px; 
        }
        
        .subs-scroll-area::-webkit-scrollbar-track,
        .main-column::-webkit-scrollbar-track {
            background: transparent;
        }

        .subs-scroll-area::-webkit-scrollbar-thumb, 
        .main-column::-webkit-scrollbar-thumb { 
            background-color: var(--border-subtle);
            border-radius: 4px;
        }
        
        .subs-scroll-area::-webkit-scrollbar-thumb:hover,
        .main-column::-webkit-scrollbar-thumb:hover {
            background-color: var(--text-muted);
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
            .dashboard {
                height: auto; /* Allow natural scroll on mobile */
                overflow: visible;
            }
            .dashboard-layout {
                grid-template-columns: 1fr;
                height: auto;
                overflow: visible;
                display: flex;
                flex-direction: column;
            }
            .charts-wrapper { grid-template-columns: 1fr; }
            .side-column, .main-column { 
                height: auto; 
                overflow: visible; 
                max-height: none;
                width: 100%;
            }
            .subs-scroll-area {
                height: auto;
                max-height: 500px; /* Cap it on mobile instead of full height */
            }
            .upcoming-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
        }
 
        /* Utils */
        .budget-header { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 500; }
        .progress-bar-container { width: 100%; height: 10px; background-color: var(--bg-tertiary); border-radius: 6px; overflow: hidden; }
        .progress-bar { height: 100%; border-radius: 6px; }
        .budget-warning { color: var(--danger); font-size: 0.9rem; margin-top: 8px; }
        .stats-card { background-color: var(--bg-secondary); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; }
        .stat-label { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 8px; }
        .stat-value-wrapper { display: flex; align-items: center; gap: 4px; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
        .chart-container { flex: 1; width: 100%; min-height: 180px; display: flex; align-items: center; justify-content: center; position: relative; }
        .pie-container { position: relative; }
        .pie-center-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* Start centered */
            text-align: center;
            display: flex;
            flex-direction: column;
            pointer-events: none;
            /* Legend adjustment: Recharts pushes chart up when legend is bottom. */
            margin-top: -15px; /* Manual tweak to center in the donut hole because Legend takes bottom space */
        }
        .pie-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1;
        }
        .pie-label {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-top: 2px;
        }
        .empty-chart { color: var(--text-muted); }
        .empty-state { text-align: center; padding: 32px; color: var(--text-muted); }
        .sub-name { max-width: 120px; } /* Truncate longer names in sidebar list */
      `}</style>
        </div>
    );
};

const StatsCard = ({ label, value, isCurrency = true }) => {
    const iconRef = useRef(null);

    // Format value: if currency, 2 decimals. If not (count), no decimals.
    const formattedValue = isCurrency
        ? (typeof value === 'number' ? value.toFixed(2) : value)
        : value;

    return (
        <div
            className="stats-card"
            onMouseEnter={() => iconRef.current?.startAnimation()}
            onMouseLeave={() => iconRef.current?.stopAnimation()}
        >
            <span className="stat-label">{label}</span>
            <div className="stat-value-wrapper">
                {isCurrency && <CurrencyEuroIcon ref={iconRef} size={28} color="var(--accent-primary)" className="stat-icon" />}
                <span className="stat-value">
                    {formattedValue}
                </span>
            </div>
        </div>
    );
};

export default Dashboard;
