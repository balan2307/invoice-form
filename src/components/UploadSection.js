import React, { useState, useEffect, memo } from 'react';
import PDFUpload from './PDFUpload';
import PDFDataExtractor from './PDFDataExtractor';
import { FormDataManager } from '../utils/sessionManager';

const UploadSection = memo(({ onFormDataUpdate, onPdfUpload, pdfData }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (pdfData?.file) {
      setUploadedFile({ file: pdfData.file, fileUrl: pdfData.fileUrl });
    } else if (!pdfData) {
      setUploadedFile(null);
    }
  }, [pdfData]);

  const handleFileUpload = (file, fileUrl) => {
    setUploadedFile({ file, fileUrl });
    console.log('PDF uploaded:', file.name);
    
    if (onPdfUpload) {
      onPdfUpload(file, fileUrl);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    if (onPdfUpload) {
      onPdfUpload(null, null);
    }
    FormDataManager.clearPDFData();
  };

  const handleDataExtracted = (extractedData) => {
    console.log('Extracted data:', extractedData);
    
    if (onFormDataUpdate) {
      onFormDataUpdate(extractedData);
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-lg p-4">
      <PDFUpload onFileUpload={handleFileUpload} initialFile={pdfData?.file} onRemove={handleRemove} />
      
      {uploadedFile && (
        <>
          <PDFDataExtractor 
            file={uploadedFile.file} 
            onDataExtracted={handleDataExtracted}
          />
        </>
      )}
      
    </div>
  );
});

export default UploadSection;
