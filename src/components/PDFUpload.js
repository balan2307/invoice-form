import React, { useState, useCallback, useEffect, memo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SimplePDFViewer from './SimplePDFViewer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const setupPDFWorker = () => {
  try {
    const workerSources = [
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
      `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
      `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
    ];
    
    pdfjs.GlobalWorkerOptions.workerSrc = workerSources[0];
  } catch (error) {
    console.error('Failed to setup PDF worker:', error);
  }
};

setupPDFWorker();

const PDFUpload = memo(({ onFileUpload, initialFile, onRemove }) => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully:', numPages, 'pages');
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
    setError(null);
    
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    
    if (!useFallback) {
      console.log('Switching to fallback PDF viewer');
      setUseFallback(true);
      setIsLoading(false);
      setError(null);
    } else {
      setError('Failed to load PDF. Please make sure it\'s a valid PDF file.');
      setIsLoading(false);
    }
    
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
  };

  const handleFileSelect = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setIsLoading(true);
      
      const timeout = setTimeout(() => {
        console.error('PDF loading timeout');
        
        if (!useFallback) {
          console.log('Timeout: Switching to fallback PDF viewer');
          setUseFallback(true);
          setIsLoading(false);
          setError(null);
        } else {
          setError('PDF loading timed out. Please try again or use a different file.');
          setIsLoading(false);
        }
      }, 10000);
      
      setLoadTimeout(timeout);
      
      const fileUrl = URL.createObjectURL(selectedFile);
      
      if (onFileUpload) {
        onFileUpload(selectedFile, fileUrl);
      }
    } else {
      setError('Please select a valid PDF file.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFileUpload, useFallback]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(URL.createObjectURL(file));
    }
    setFile(null);
    setNumPages(null);
    setPageNumber(1);
    setError(null);
    setIsLoading(false);
    setUseFallback(false);
    
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    if (onRemove) {
      onRemove();
    }
  };

  useEffect(() => {
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };
  }, [loadTimeout]);

  useEffect(() => {
    if (initialFile && !file) {
      setFile(initialFile);
      const fileUrl = URL.createObjectURL(initialFile);
      if (onFileUpload) {
        onFileUpload(initialFile, fileUrl);
      }
    } else if (!initialFile && file) {
      setFile(null);
      setNumPages(null);
      setPageNumber(1);
      if (onRemove) {
        onRemove();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFile]);

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Your Invoice</h2>
          <p className="text-sm text-gray-600 mb-6">To auto-populate fields and save time</p>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -left-4 top-2 w-8 h-10 bg-gray-200 rounded transform rotate-12"></div>
              <div className="absolute -right-4 top-2 w-8 h-10 bg-gray-200 rounded transform -rotate-12"></div>
            </div>
          </div>

          <label className="cursor-pointer">
            <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center mx-auto">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload PDF File
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>

          <p className="text-sm text-gray-600">
            <span className="text-blue-600">Click to upload</span> or Drag and drop PDF files
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {useFallback ? (
            <SimplePDFViewer file={file} onError={() => setError('PDF preview failed')} />
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-96 bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 mb-2">Loading PDF...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                    <button
                      onClick={removeFile}
                      className="mt-3 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {numPages > 1 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-600">
                          Page {pageNumber} of {numPages}
                        </span>
                        <button
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        PDF Preview
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center bg-gray-50 p-4">
                    <Document
                      file={file}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      className="shadow-lg"
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={400}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  </div>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default PDFUpload;
