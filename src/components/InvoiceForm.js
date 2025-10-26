import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import VendorDetails from './VendorDetails';
import InvoiceDetails from './InvoiceDetails';
import ExpenseDetails from './ExpenseDetails';
import { FormDataManager, dummyData, dummyPDFData } from '../utils/sessionManager';
import { validateInvoiceForm, hasValidationErrors } from '../utils/validation';

const InvoiceForm = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('vendor');
  const [formData, setFormData] = useState({
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
  const [pdfData, setPdfData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const tabs = [
    { id: 'vendor', label: 'Vendor Details' },
    { id: 'invoice', label: 'Invoice Details' },
    { id: 'comments', label: 'Comments' }
  ];

  useEffect(() => {
    const savedFormData = FormDataManager.getFormData();
    const savedPdfData = FormDataManager.getPDFData();
    const savedPdfFile = FormDataManager.getPDFFile();
    
    if (savedFormData) {
      setFormData(savedFormData);
    }
    
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
  }, []);

  useEffect(() => {
    FormDataManager.saveFormData(formData);
  }, [formData]);

  useEffect(() => {
    if (pdfData) {
      FormDataManager.savePDFData(pdfData);
    }
  }, [pdfData]);

  const handleFormDataUpdate = (extractedData) => {
    const updatedData = {
      ...formData,
      vendor: extractedData.vendor?.name || formData.vendor,
      purchaseOrderNumber: extractedData.invoice?.purchaseOrderNumber || formData.purchaseOrderNumber,
      invoiceNumber: extractedData.invoice?.number || formData.invoiceNumber,
      invoiceDate: extractedData.invoice?.date || formData.invoiceDate,
      dueDate: extractedData.invoice?.dueDate || formData.dueDate,
      totalAmount: extractedData.invoice?.totalAmount || formData.totalAmount,
      description: extractedData.invoice?.description || formData.description,
      paymentTerms: extractedData.invoice?.paymentTerms || formData.paymentTerms,
      glPostDate: extractedData.invoice?.glPostDate || formData.glPostDate,
      lineAmount: extractedData.lineItems?.[0]?.amount || formData.lineAmount,
      account: extractedData.lineItems?.[0]?.account || formData.account,
      department: extractedData.lineItems?.[0]?.department || formData.department,
      location: extractedData.lineItems?.[0]?.location || formData.location,
      comments: extractedData.invoice?.comments || formData.comments
    };
    setFormData(updatedData);
    const errors = validateInvoiceForm(updatedData);
    setValidationErrors(errors);
  };

  const handleFieldChange = (fieldName, value) => {
    const updatedData = {
      ...formData,
      [fieldName]: value
    };
    setFormData(updatedData);
    
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    const errors = validateInvoiceForm(updatedData);
    setValidationErrors(errors);
  };

  const validateForm = () => {
    const errors = validateInvoiceForm(formData);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  };

  const handlePdfUpload = async (file, fileUrl) => {
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
  };

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
            <button className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
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
            <VendorDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
            <InvoiceDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
            <ExpenseDetails formData={formData} onFormDataChange={handleFieldChange} errors={validationErrors} touched={touchedFields} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
