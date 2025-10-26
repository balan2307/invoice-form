export const validateInvoiceForm = (formData) => {
  const errors = {};

  if (!formData.vendor || formData.vendor.trim() === '') {
    errors.vendor = 'Vendor is required';
  }

  if (!formData.purchaseOrderNumber || formData.purchaseOrderNumber.trim() === '') {
    errors.purchaseOrderNumber = 'Purchase Order Number is required';
  }

  if (!formData.invoiceNumber || formData.invoiceNumber.trim() === '') {
    errors.invoiceNumber = 'Invoice Number is required';
  }

  if (!formData.invoiceDate || formData.invoiceDate.trim() === '') {
    errors.invoiceDate = 'Invoice Date is required';
  } else if (!isValidDate(formData.invoiceDate)) {
    errors.invoiceDate = 'Please enter a valid date (MM/DD/YYYY)';
  }

  if (!formData.dueDate || formData.dueDate.trim() === '') {
    errors.dueDate = 'Due Date is required';
  } else if (!isValidDate(formData.dueDate)) {
    errors.dueDate = 'Please enter a valid date (MM/DD/YYYY)';
  }

  if (!formData.totalAmount || formData.totalAmount.trim() === '') {
    errors.totalAmount = 'Total Amount is required';
  } else if (!isValidAmount(formData.totalAmount)) {
    errors.totalAmount = 'Please enter a valid amount';
  }

  if (!formData.paymentTerms || formData.paymentTerms.trim() === '') {
    errors.paymentTerms = 'Payment Terms is required';
  }

  if (!formData.glPostDate || formData.glPostDate.trim() === '') {
    errors.glPostDate = 'GL Post Date is required';
  } else if (!isValidDate(formData.glPostDate)) {
    errors.glPostDate = 'Please enter a valid date (MM/DD/YYYY)';
  }

  if (!formData.description || formData.description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (!formData.lineAmount || formData.lineAmount.trim() === '') {
    errors.lineAmount = 'Line Amount is required';
  } else if (!isValidAmount(formData.lineAmount)) {
    errors.lineAmount = 'Please enter a valid amount';
  }

  if (!formData.account || formData.account.trim() === '') {
    errors.account = 'Account is required';
  }

  if (!formData.department || formData.department.trim() === '') {
    errors.department = 'Department is required';
  }

  if (!formData.location || formData.location.trim() === '') {
    errors.location = 'Location is required';
  }

  return errors;
};

const isValidDate = (dateString) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const [month, day, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() == year && 
         date.getMonth() == month - 1 && 
         date.getDate() == day;
};

const isValidAmount = (amountString) => {
  const amountRegex = /^\$?[\d,]+(\.\d{2})?$/;
  return amountRegex.test(amountString);
};

export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
