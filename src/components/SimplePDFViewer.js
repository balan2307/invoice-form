import React, { useState, useCallback } from 'react';

const SimplePDFViewer = ({ file, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load PDF preview');
    if (onError) {
      onError('PDF preview failed');
    }
  };

  if (error) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-96 bg-gray-50">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 mb-2">PDF Preview Unavailable</p>
            <p className="text-sm text-gray-500">The PDF was uploaded successfully but preview is not available</p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>File:</strong> {file?.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Size:</strong> {(file?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading PDF preview...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={URL.createObjectURL(file)}
        className="w-full h-96"
        onLoad={handleLoad}
        onError={handleError}
        title="PDF Preview"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default SimplePDFViewer;
