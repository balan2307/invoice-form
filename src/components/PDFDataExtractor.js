import React, { useState, useEffect } from 'react';


const PDFDataExtractor = ({ file, onDataExtracted }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const extractDataFromPDF = async (pdfFile) => {
    setIsExtracting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsComplete(true);
    } catch (err) {
      setError('Failed to extract data from PDF. Please try again.');
      console.error('PDF extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    if (file) {
      setIsComplete(false);
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
            <p className="text-sm text-blue-700">Processing PDF...</p>
          </div>
        </div>
      ) : isComplete ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700">PDF uploaded successfully</p>
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
