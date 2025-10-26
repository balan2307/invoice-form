import React, { memo } from 'react';

const VendorDetails = memo(({ formData, onFormDataChange, errors, touched }) => {
  const handleFieldChange = (fieldName, value) => {
    onFormDataChange(fieldName, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Vendor Details</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Vendor Information</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
          <select
            name="vendor"
            value={formData.vendor}
            onChange={(e) => handleFieldChange('vendor', e.target.value)}
            className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 ${
              errors.vendor && touched.vendor 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            } appearance-none`}
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em"
            }}
          >
            <option value="">Select Vendor</option>
            <option value="A-1 Exterminators">A-1 Exterminators</option>
            <option value="Other Vendor">Other Vendor</option>
          </select>
          {errors.vendor && touched.vendor && (
            <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>
          )}
            </div>

            <div className="text-sm text-gray-600">
              550 Main St, Lynn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VendorDetails;
