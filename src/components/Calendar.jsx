import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, CreditCard, Tag, Hourglass } from 'lucide-react';

const CalendarView = ({ subscriptions }) => {
  const [date, setDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate events
  const events = useMemo(() => {
    const eventMap = {};

    subscriptions.filter(s => s.status !== 'paused').forEach(sub => {
      const start = new Date(sub.startDate);
      const day = start.getDate();
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();

      // Simple recurrence logic for Monthly
      // (More complex logic needed for weekly/yearly to be perfect)
      let eventDate = null;

      if (sub.period === 'Monthly') {
        eventDate = new Date(currentYear, currentMonth, day);
      } else if (sub.period === 'Yearly') {
        const subMonth = start.getMonth();
        if (subMonth === currentMonth) {
          eventDate = new Date(currentYear, currentMonth, day);
        }
      } else if (sub.period === 'Weekly') {
        // Complex to project weekly, skipping for simple MVP visual
        // Just showing start date for weeklies if in this month
        if (start.getMonth() === currentMonth) {
          eventDate = start;
        }
      }

      if (eventDate) {
        const key = eventDate.toDateString();
        if (!eventMap[key]) eventMap[key] = [];
        eventMap[key].push(sub);
      }
    });

    return eventMap;
  }, [subscriptions, date]);

  const handleDateClick = (value) => {
    const key = value.toDateString();
    if (events[key] && events[key].length > 0) {
      setSelectedDateEvents(events[key]);
      setIsModalOpen(true);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const key = date.toDateString();
      const daysEvents = events[key];

      if (daysEvents && daysEvents.length > 0) {
        return (
          <div className="calendar-tile-content">
            {daysEvents.map((sub, i) => (
              <div key={i} className="tile-dot-wrapper">
                {sub.icon ? (
                  <img src={sub.icon} alt="" className="tile-icon" />
                ) : (
                  <div className="tile-dot" style={{ backgroundColor: 'var(--accent-primary)' }} />
                )}
              </div>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-page">
      <header className="page-header">
        <h1>Calendrier des Paiements</h1>
      </header>

      <div className="calendar-wrapper">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          onClickDay={handleDateClick}
          locale="fr-FR"
          className="custom-calendar"
        />
      </div>

      {/* Upcoming Payments Section */}
      <section className="upcoming-section-calendar">
        <h3 className="section-title">Prochaines Échéances</h3>
        <div className="upcoming-scroll-container">
          {subscriptions
            .filter(s => s.status === 'active')
            .map(sub => {
              // Same logic as Dashboard
              const calculateNextPayment = (startDate, period) => {
                if (!startDate) return new Date();
                let nextDate = new Date(startDate);
                const now = new Date();
                now.setHours(0, 0, 0, 0);

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

              const nextDate = calculateNextPayment(sub.startDate, sub.period);
              return { ...sub, nextPayment: nextDate };
            })
            .sort((a, b) => a.nextPayment - b.nextPayment)
            .map((sub) => {
              const dayOfMonth = sub.nextPayment.getDate();
              return (
                <div key={sub.id} className="upcoming-card-mini">
                  <div className="upcoming-date-badge">
                    <span className="day">{dayOfMonth}</span>
                    <span className="month">{sub.nextPayment.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div className="upcoming-mini-info">
                    <span className="name">
                      {sub.name}
                      {!!sub.pauseAtRenewal && <Hourglass size={10} color="var(--color-warning)" style={{ marginLeft: 4, display: 'inline', verticalAlign: 'middle' }} />}
                    </span>
                    <span className="price">{parseFloat(sub.price).toFixed(2)}€</span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <style>{`
        .upcoming-section-calendar {
            margin-top: 32px;
        }
        
        .section-title {
            margin-bottom: 16px;
            font-size: 1.1rem;
            color: var(--text-primary);
        }
        
        .upcoming-scroll-container {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding-bottom: 12px; /* Space for scrollbar */
            scroll-behavior: smooth;
        }
        
        .upcoming-scroll-container::-webkit-scrollbar {
            height: 6px;
        }
        
        .upcoming-scroll-container::-webkit-scrollbar-thumb {
            background-color: var(--bg-tertiary);
            border-radius: 4px;
        }
        
        .upcoming-card-mini {
            flex-shrink: 0;
            width: 160px;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .upcoming-card-mini:hover {
            transform: translateY(-2px);
            border-color: var(--accent-primary);
        }
        
        .upcoming-date-badge {
            background-color: var(--bg-tertiary);
            padding: 8px 12px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        
        .upcoming-date-badge .day { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); }
        .upcoming-date-badge .month { font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); }
        
        .upcoming-mini-info .name { display: block; font-weight: 500; font-size: 0.9rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
        .upcoming-mini-info .price { color: var(--text-muted); font-size: 0.85rem; }
      `}</style>
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div
              className="details-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Paiements pour le {selectedDateEvents[0] && new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="events-list">
                {selectedDateEvents.map(sub => (
                  <div key={sub.id} className="event-item">
                    <div className="event-main">
                      {sub.icon ? <img src={sub.icon} className="event-icon" /> : <div className="event-placeholder">{sub.name[0]}</div>}
                      <div>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {sub.name}
                          {!!sub.pauseAtRenewal && <Hourglass size={12} color="var(--color-warning)" />}
                        </h4>
                        <div className="event-meta">
                          <span className="cat-badge"><Tag size={10} /> {sub.category || 'Autre'}</span>
                          {sub.description && <span className="desc-text">{sub.description}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="event-price">
                      -{parseFloat(sub.price).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <span>Total jour: </span>
                <strong>{selectedDateEvents.reduce((acc, curr) => acc + parseFloat(curr.price), 0).toFixed(2)}€</strong>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
                .calendar-page {
                    max-width: 900px;
                    margin: 0 auto;
                }
                
                .page-header {
                    margin-bottom: 24px;
                }

                .calendar-wrapper {
                    background: var(--bg-secondary);
                    padding: 24px;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-subtle);
                }

                .custom-calendar {
                    width: 100%;
                    background: transparent;
                    border: none;
                    font-family: inherit;
                }
                
                .react-calendar__navigation button {
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                
                .react-calendar__month-view__weekdays {
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 12px;
                }
                
                .react-calendar__tile {
                    color: var(--text-primary);
                    height: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding-top: 8px;
                    border-radius: 8px;
                    transition: background 0.2s;
                    position: relative;
                }
                
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: var(--bg-tertiary);
                }
                
                .react-calendar__tile--now {
                    background: var(--bg-tertiary);
                    border: 1px solid var(--accent-primary);
                }

                .react-calendar__tile--active {
                    background: var(--accent-primary) !important;
                    color: white;
                }

                .calendar-tile-content {
                    display: flex;
                    gap: 2px;
                    margin-top: 4px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .tile-icon {
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                }
                
                .tile-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(2px);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .details-modal {
                    background: var(--bg-secondary);
                    padding: 24px;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid var(--border-subtle);
                    box-shadow: var(--shadow-xl);
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid var(--border-subtle);
                    padding-bottom: 12px;
                }
                
                .events-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .event-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: var(--bg-tertiary);
                    border-radius: 8px;
                }
                
                .event-main {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .event-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                }
                
                .event-placeholder {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    background: var(--bg-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                .event-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                
                .cat-badge {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .desc-text {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-style: italic;
                }
                
                .event-price {
                    font-weight: 700;
                    color: var(--danger);
                }
                
                .modal-footer {
                    margin-top: 20px;
                    padding-top: 12px;
                    border-top: 1px solid var(--border-subtle);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            `}</style>
    </div >
  );
};

export default CalendarView;
