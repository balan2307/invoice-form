import React, { memo } from 'react';
import { formatDateForInput, formatDateForStorage } from '../utils/validation';

const InvoiceDetails = memo(({ formData, onFormDataChange, errors, touched }) => {
  const handleFieldChange = (fieldName, value) => {
    onFormDataChange(fieldName, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Invoice Details</h3>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">General Information</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Order Number <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.purchaseOrderNumber || ''}
            onChange={(e) => handleFieldChange('purchaseOrderNumber', e.target.value)}
            className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 appearance-none ${
              errors.purchaseOrderNumber && touched.purchaseOrderNumber 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
            style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em"}}
          >
            <option value="">Select PO Number</option>
            <option value="PO-001">PO-001</option>
            <option value="PO-002">PO-002</option>
          </select>
          {errors.purchaseOrderNumber && touched.purchaseOrderNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.purchaseOrderNumber}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Invoice Details</h4>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
          <select 
            value={formData.invoiceNumber || ''}
            onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em"}}
          >
            <option value="">Select Invoice Number</option>
            <option value="INV-2024-001">INV-2024-001</option>
            <option value="INV-2024-002">INV-2024-002</option>
          </select>
          {errors.invoiceNumber && touched.invoiceNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>
          )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                value={formatDateForInput(formData.invoiceDate)}
                onChange={(e) => handleFieldChange('invoiceDate', formatDateForStorage(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.invoiceDate && touched.invoiceDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.invoiceDate && touched.invoiceDate && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms <span className="text-red-500">*</span>
              </label>
          <select 
            value={formData.paymentTerms || ''}
            onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em"}}
          >
            <option value="">Select</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="Due on Receipt">Due on Receipt</option>
          </select>
          {errors.paymentTerms && touched.paymentTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentTerms}</p>
          )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GL Post Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                value={formatDateForInput(formData.glPostDate)}
                onChange={(e) => handleFieldChange('glPostDate', formatDateForStorage(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.glPostDate && touched.glPostDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.glPostDate && touched.glPostDate && (
                <p className="mt-1 text-sm text-red-600">{errors.glPostDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value={formData.totalAmount || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[\d,]*\.?\d{0,2}$/.test(value)) {
                        handleFieldChange('totalAmount', value);
                      }
                    }}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <span className="ml-2 text-sm text-gray-500">USD</span>
              </div>
              {errors.totalAmount && touched.totalAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Due Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                value={formatDateForInput(formData.dueDate)}
                onChange={(e) => handleFieldChange('dueDate', formatDateForStorage(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.dueDate && touched.dueDate 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.dueDate && touched.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter invoice description..."
              />
              {errors.description && touched.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoiceDetails;
