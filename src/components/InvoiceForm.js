import React, { useState, useEffect, useCallback, useRef } from 'react';
import UploadSection from './UploadSection';
import VendorDetails from './VendorDetails';
import InvoiceDetails from './InvoiceDetails';
import ExpenseDetails from './ExpenseDetails';
import { FormDataManager, dummyData, dummyPDFData } from '../utils/sessionManager';
import { validateInvoiceForm } from '../utils/validation';

const InvoiceForm = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('vendor');
  
  const initialFormData = () => {
    const savedData = FormDataManager.getFormData();
    if (savedData) {
      return savedData;
    }
    return {
      vendor: '',
      purchaseOrderNumber: '',
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      totalAmount: '',
      description: '',
      paymentTerms: '',
      glPostDate: '',
      lineAmount: '',
      account: '',
      department: '',
      location: '',
      comments: ''
    };
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [pdfData, setPdfData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const formDataRef = useRef(formData);
  
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const tabs = [
    { id: 'vendor', label: 'Vendor Details' },
    { id: 'invoice', label: 'Invoice Details' },
    { id: 'comments', label: 'Comments' }
  ];

  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedPdfData = FormDataManager.getPDFData();
    const savedPdfFile = FormDataManager.getPDFFile();
    
    if (savedPdfData) {
      setPdfData(savedPdfData);
    }
    
    if (savedPdfFile) {
      setPdfData({
        fileName: savedPdfFile.name,
        fileSize: (savedPdfFile.size / 1024 / 1024).toFixed(2) + ' MB',
        file: savedPdfFile
      });
    }
    
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      FormDataManager.saveFormData(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (pdfData) {
      FormDataManager.savePDFData(pdfData);
    }
  }, [pdfData]);

  const handleFormDataUpdate = useCallback((extractedData) => {
    setFormData(prev => {
      const updateIfEmpty = (extractedValue, previousValue) => {
        const hasPreviousValue = previousValue && previousValue.trim() !== '';
        const hasExtractedValue = extractedValue && extractedValue.trim() !== '';
        return (hasPreviousValue ? previousValue : (hasExtractedValue ? extractedValue : previousValue));
      };
      
      const updatedData = {
        ...prev,
        vendor: updateIfEmpty(extractedData.vendor?.name, prev.vendor),
        purchaseOrderNumber: updateIfEmpty(extractedData.invoice?.purchaseOrderNumber, prev.purchaseOrderNumber),
        invoiceNumber: updateIfEmpty(extractedData.invoice?.number, prev.invoiceNumber),
        invoiceDate: updateIfEmpty(extractedData.invoice?.date, prev.invoiceDate),
        dueDate: updateIfEmpty(extractedData.invoice?.dueDate, prev.dueDate),
        totalAmount: updateIfEmpty(extractedData.invoice?.totalAmount, prev.totalAmount),
        description: updateIfEmpty(extractedData.invoice?.description, prev.description),
        paymentTerms: updateIfEmpty(extractedData.invoice?.paymentTerms, prev.paymentTerms),
        glPostDate: updateIfEmpty(extractedData.invoice?.glPostDate, prev.glPostDate),
        lineAmount: updateIfEmpty(extractedData.lineItems?.[0]?.amount, prev.lineAmount),
        account: updateIfEmpty(extractedData.lineItems?.[0]?.account, prev.account),
        department: updateIfEmpty(extractedData.lineItems?.[0]?.department, prev.department),
        location: updateIfEmpty(extractedData.lineItems?.[0]?.location, prev.location),
        comments: updateIfEmpty(extractedData.invoice?.comments, prev.comments)
      };
      const errors = validateInvoiceForm(updatedData);
      setValidationErrors(errors);
      return updatedData;
    });
  }, []);

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleFieldChange = useCallback((fieldName, value) => {
    if (fieldName === '__saveDraft') {
      FormDataManager.saveFormData(formDataRef.current);
      return;
    }
    
    if (fieldName === '__submit') {
      setSubmitAttempted(true);
      setTouchedFields({
        vendor: true,
        purchaseOrderNumber: true,
        invoiceNumber: true,
        invoiceDate: true,
        dueDate: true,
        totalAmount: true,
        description: true,
        paymentTerms: true,
        glPostDate: true,
        lineAmount: true,
        account: true,
        department: true,
        location: true,
        comments: true
      });
      
      const currentFormData = formDataRef.current;
      const errors = validateInvoiceForm(currentFormData);
      setValidationErrors(errors);
      
      if (Object.keys(errors).length === 0) {
        const submissionData = {
          ...currentFormData,
          submittedAt: new Date().toISOString(),
          status: 'submitted',
          id: Date.now().toString()
        };
        
        const existingSubmissions = JSON.parse(localStorage.getItem('invoiceSubmissions') || '[]');
        existingSubmissions.push(submissionData);
        localStorage.setItem('invoiceSubmissions', JSON.stringify(existingSubmissions));
        
        FormDataManager.saveFormData(submissionData);
        
        if (pdfData?.fileUrl) {
          URL.revokeObjectURL(pdfData.fileUrl);
        }
        
        setFormData({
          vendor: '',
          purchaseOrderNumber: '',
          invoiceNumber: '',
          invoiceDate: '',
          dueDate: '',
          totalAmount: '',
          description: '',
          paymentTerms: '',
          glPostDate: '',
          lineAmount: '',
          account: '',
          department: '',
          location: '',
          comments: ''
        });
        setPdfData(null);
        setValidationErrors({});
        setTouchedFields({});
        setSubmitAttempted(false);
        FormDataManager.clearPDFData();
        FormDataManager.clearFormData();
        
        setToastMessage('Form submitted successfully!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage('Please fix validation errors before submitting.');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      return;
    }
    
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      const errors = validateInvoiceForm(updatedData);
      setValidationErrors(errors);
      return updatedData;
    });
  }, [formData, pdfData]);

  const handlePdfUpload = useCallback(async (file, fileUrl) => {
    if (file) {
      const newPdfData = {
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        fileUrl: fileUrl,
        uploadedAt: new Date().toISOString(),
        file: file
      };
      setPdfData(newPdfData);
      
      await FormDataManager.savePDFFile(file);
    } else {
      setPdfData(null);
      FormDataManager.clearPDFFile();
    }
  }, []);

  const populateDummyData = async () => {
    setFormData(dummyData);
    setPdfData(dummyPDFData);
    
    const dummyPDFFile = await FormDataManager.getDummyPDFFile();
    if (dummyPDFFile) {
      await FormDataManager.savePDFFile(dummyPDFFile);
      const fileUrl = URL.createObjectURL(dummyPDFFile);
      
      setPdfData({
        fileName: dummyPDFFile.name,
        fileSize: (dummyPDFFile.size / 1024 / 1024).toFixed(2) + ' MB',
        fileUrl: fileUrl,
        uploadedAt: new Date().toISOString(),
        file: dummyPDFFile
      });
    }
  };

  const clearAllData = () => {
    if (pdfData?.fileUrl) {
      URL.revokeObjectURL(pdfData.fileUrl);
    }
    
    setFormData({
      vendor: '',
      purchaseOrderNumber: '',
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      totalAmount: '',
      description: '',
      paymentTerms: '',
      glPostDate: '',
      lineAmount: '',
      account: '',
      department: '',
      location: '',
      comments: ''
    });
    setPdfData(null);
    setValidationErrors({});
    setTouchedFields({});
    FormDataManager.clearFormData();
    FormDataManager.clearPDFData();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Create New Invoice</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/3 p-6 bg-pink-50">
          <UploadSection 
            onFormDataUpdate={handleFormDataUpdate} 
            onPdfUpload={handlePdfUpload}
            pdfData={pdfData}
          />
          
          <div className="mt-6 space-y-3">
            <button
              onClick={populateDummyData}
              className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              Load Dummy Data
            </button>
            
            <button
              onClick={clearAllData}
              className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="w-2/3 p-6 border-l border-dashed border-gray-300 bg-pink-50">
          <div className="space-y-8">
            {activeTab === 'vendor' && (
              <>
                <VendorDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
                <InvoiceDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
                <ExpenseDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
              </>
            )}
            {activeTab === 'invoice' && (
              <InvoiceDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
            )}
            {activeTab === 'comments' && (
              <ExpenseDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
            )}
          </div>
        </div>
      </div>

      {showToast && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {toastType === 'success' ? (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
