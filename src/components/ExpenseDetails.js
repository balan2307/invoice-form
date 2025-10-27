import React, { useState, memo } from 'react';

const ExpenseDetails = memo(({ formData, onFormDataChange, errors, touched }) => {
  const [amountMode, setAmountMode] = useState('dollar');

  const handleFieldChange = (fieldName, value) => {
    onFormDataChange(fieldName, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Expense Details</h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">$0.00 / $0.00</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAmountMode('dollar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                amountMode === 'dollar'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              $
            </button>
            <button
              onClick={() => setAmountMode('percent')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                amountMode === 'percent'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              %
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  name="lineAmount"
                  value={formData.lineAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[\d,]*\.?\d{0,2}$/.test(value)) {
                      handleFieldChange('lineAmount', value);
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <span className="ml-2 text-sm text-gray-500">USD</span>
            </div>
            {errors.lineAmount && touched.lineAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.lineAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account <span className="text-red-500">*</span>
            </label>
            <select
              name="account"
              value={formData.account}
              onChange={(e) => handleFieldChange('account', e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 appearance-none ${
                errors.account && touched.account 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em"}}
            >
              <option value="">Select Account</option>
              <option value="Office Maintenance">Office Maintenance</option>
              <option value="IT Services">IT Services</option>
              <option value="Utilities">Utilities</option>
            </select>
            {errors.account && touched.account && (
              <p className="mt-1 text-sm text-red-600">{errors.account}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em"}}
            >
              <option value="">Select Department</option>
              <option value="Facilities">Facilities</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && touched.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              style={{backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em"}}
            >
              <option value="">Select Location</option>
              <option value="Main Office">Main Office</option>
              <option value="New York">New York</option>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
            </select>
            {errors.location && touched.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Enter expense description..."
        />
      </div>

      <div className="flex justify-end">
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Expense Coding
        </button>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button 
          onClick={() => onFormDataChange && onFormDataChange('__saveDraft', null)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Save as Draft
        </button>
        <button 
          onClick={() => onFormDataChange && onFormDataChange('__submit', null)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit & New
        </button>
      </div>
    </div>
  );
});

export default ExpenseDetails;
