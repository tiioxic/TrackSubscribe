import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a', // Dark
    },
    date: {
        fontSize: 10,
        color: '#666',
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 20,
    },
    statCard: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        flex: 1,
    },
    statLabel: {
        fontSize: 8,
        color: '#666',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#e5e7eb',
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        padding: 8,
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e5e7eb',
        padding: 8,
    },
    tableCellHeader: {
        margin: "auto",
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableCell: {
        margin: "auto",
        fontSize: 10,
        color: '#4b5563',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
    },
});

const PdfDocument = ({ subscriptions, totals }) => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Subcribe - Rapport</Text>
                    <Text style={styles.date}>{today}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Coût Mensuel</Text>
                        <Text style={styles.statValue}>{totals.monthly} €</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Coût Annuel</Text>
                        <Text style={styles.statValue}>{totals.yearly} €</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Abonnements Actifs</Text>
                        <Text style={styles.statValue}>{activeSubs.length}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Nom</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Prix</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Catégorie</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Périodicité</Text></View>
                    </View>

                    {subscriptions.map((sub, i) => (
                        <View style={styles.tableRow} key={sub.id || i}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{sub.name}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{parseFloat(sub.price).toFixed(2)} €</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{sub.category || '-'}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{sub.period}</Text></View>
                        </View>
                    ))}
                </View>

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

export default PdfDocument;
