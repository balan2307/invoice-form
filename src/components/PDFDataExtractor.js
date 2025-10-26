import React, { useState, useEffect } from 'react';


const PDFDataExtractor = ({ file, onDataExtracted }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);

  const extractDataFromPDF = async (pdfFile) => {
    setIsExtracting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockExtractedData = {
        vendor: {
          name: "A-1 Exterminators",
          address: "550 Main St, Lynn",
          phone: "(555) 123-4567",
          email: "info@a1exterminators.com"
        },
        invoice: {
          number: "INV-2024-001",
          date: "01/15/2024",
          dueDate: "02/15/2024",
          totalAmount: "1,250.00",
          description: "Monthly pest control services for office building",
          paymentTerms: "Net 30",
          purchaseOrderNumber: "PO-001",
          glPostDate: "01/15/2024",
          comments: "Regular monthly service - all areas covered"
        },
        lineItems: [
          {
            description: "Monthly pest control service",
            amount: "1,250.00",
            account: "Office Maintenance",
            department: "Facilities",
            location: "Main Office"
          }
        ]
      };

      if (onDataExtracted) {
        onDataExtracted(mockExtractedData);
      }
      
      setTimeout(() => {
        if (onDataExtracted) {
          onDataExtracted(mockExtractedData);
        }
      }, 100);
    } catch (err) {
      setError('Failed to extract data from PDF. Please try again.');
      console.error('PDF extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    if (file) {
      extractDataFromPDF(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  if (!file) return null;

  return (
    <div className="mt-4">
      {isExtracting ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-sm text-blue-700">Extracting data from PDF...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PDFDataExtractor;
