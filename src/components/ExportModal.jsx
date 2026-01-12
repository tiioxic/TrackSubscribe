import React from 'react';
import { Download, FileText, Table, X } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';

const ExportModal = ({ isOpen, onClose, subscriptions, totals }) => {
    if (!isOpen) return null;

    const exportToCSV = () => {
        // Create CSV Content
        const headers = ['Nom', 'Prix', 'Devise', 'Périodicité', 'Catégorie', 'Date Début', 'Statut'];
        const rows = subscriptions.map(sub => [
            sub.name,
            sub.price,
            'EUR',
            sub.period,
            sub.category || '',
            sub.startDate || '',
            sub.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `subcribe_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="export-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Exporter les données</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className="export-options">
                    <button className="export-btn" onClick={exportToCSV}>
                        <div className="icon-box csv">
                            <Table size={24} />
                        </div>
                        <div className="text-box">
                            <span className="format">CSV / Excel</span>
                            <span className="desc">Tableur simple</span>
                        </div>
                    </button>

                    <PDFDownloadLink
                        document={<PdfDocument subscriptions={subscriptions} totals={totals} />}
                        fileName={`subcribe_report_${new Date().toISOString().split('T')[0]}.pdf`}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ blob, url, loading, error }) => (
                            <button className="export-btn" disabled={loading}>
                                <div className="icon-box pdf">
                                    <FileText size={24} />
                                </div>
                                <div className="text-box">
                                    <span className="format">{loading ? 'Génération...' : 'PDF Rapport'}</span>
                                    <span className="desc">Document stylisé</span>
                                </div>
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            <style>{`
                .export-modal {
                    background-color: var(--bg-secondary);
                    border: 1px solid var(--border-subtle);
                    border-radius: 20px;
                    padding: 24px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: popIn 0.2s ease-out;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .modal-header h3 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .export-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .export-btn {
                    background-color: var(--bg-tertiary);
                    border: 1px solid var(--border-subtle);
                    border-radius: 16px;
                    padding: 20px 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                }

                .export-btn:hover {
                    background-color: var(--bg-primary);
                    border-color: var(--accent-primary);
                    transform: translateY(-2px);
                }

                .icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                }

                .icon-box.csv {
                    background-color: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .icon-box.pdf {
                    background-color: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .text-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }

                .format {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .desc {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    );
};

export default ExportModal;
