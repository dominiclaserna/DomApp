import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import signatureImage from './LASERNA_E_SIGNATURE.jpeg'; // Import the image

// Create a component to render each receipt as PDF
const ReceiptPDF = ({ receiptData }) => {
    // Define styles for PDF document
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            padding: 20,
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center', // Center the text horizontally
        },
        text: {
            fontSize: 12,
            marginBottom: 5,
            textAlign: 'center', // Center the text horizontally
        },
        image: {
            width: '50%', // Adjust the width of the image as needed
            alignSelf: 'center', // Center the image horizontally
            marginBottom: 10, // Add some margin at the bottom
        },
        downloadButton: {
            padding: 10,
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: 5,
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
        },
    });

    return (
        <PDFDownloadLink
            document={
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Receipt Details</Text>

                            <Text style={styles.text}>This is to certify that : {receiptData.receiver}</Text>
                            <Text style={styles.text}>Has paid the amount of: PHP{receiptData.amount}</Text>
                            <Text style={styles.text}>for: {receiptData.category}</Text>
                            <Text style={styles.text}>to: {receiptData.biller}</Text>
                            <Text style={styles.text}>on: {receiptData.datePaid || 'N/A'}</Text>
                            <View style={styles.imageContainer}>
                            <Text style={styles.text}>Signed by (Manager):</Text>
                                
                                <Image
                                    style={styles.image}
                                    src={signatureImage} // Use the imported image
                                />
                               
                            </View>
                        </View>
                    </Page>
                </Document>
            }
            fileName={`${receiptData.receiver}_${receiptData.datePaid || 'N_A'}.pdf`}
        >
            {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' :  <div style={styles.downloadButton}>Download PDF</div>
            }
        </PDFDownloadLink>
    );
};

export default ReceiptPDF;
