export const SessionManager = {
  setSession: (userSession) => {
    try {
      localStorage.setItem('userSession', JSON.stringify(userSession));
      return true;
    } catch (error) {
      console.error('Failed to store session:', error);
      return false;
    }
  },

  getSession: () => {
    try {
      const session = localStorage.getItem('userSession');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      return null;
    }
  },

  isLoggedIn: () => {
    const session = SessionManager.getSession();
    if (!session) return false;

    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      SessionManager.clearSession();
      return false;
    }

    return true;
  },

  clearSession: () => {
    try {
      localStorage.removeItem('userSession');
      return true;
    } catch (error) {
      console.error('Failed to clear session:', error);
      return false;
    }
  },

  getCurrentUser: () => {
    const session = SessionManager.getSession();
    return session ? { username: session.username, loginTime: session.loginTime } : null;
  }
};

export const UserManager = {
  setUser: (userData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to store user data:', error);
      return false;
    }
  },

  getUser: (username) => {
    try {
      const users = localStorage.getItem('userData');
      if (!users) return null;
      
      const userData = JSON.parse(users);
      return userData[username] || null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  getAllUsers: () => {
    try {
      const users = localStorage.getItem('userData');
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Failed to retrieve all users:', error);
      return {};
    }
  },

  registerUser: (userData) => {
    try {
      const users = UserManager.getAllUsers();
      
      if (users[userData.username]) {
        return { success: false, error: 'Username already exists' };
      }

      users[userData.username] = {
        ...userData,
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      localStorage.setItem('userData', JSON.stringify(users));
      return { success: true, user: users[userData.username] };
    } catch (error) {
      console.error('Failed to register user:', error);
      return { success: false, error: 'Registration failed' };
    }
  },

  authenticateUser: (username, password) => {
    try {
      const user = UserManager.getUser(username);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      return { success: true, user };
    } catch (error) {
      console.error('Failed to authenticate user:', error);
      return { success: false, error: 'Authentication failed' };
    }
  },

  initializeDefaultUsers: () => {
    const users = UserManager.getAllUsers();
    
    if (!users['admin']) {
      UserManager.registerUser({
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    }
  }
};

export const FormDataManager = {
  saveFormData: (formData) => {
    try {
      localStorage.setItem('invoiceFormData', JSON.stringify(formData));
      return true;
    } catch (error) {
      console.error('Failed to save form data:', error);
      return false;
    }
  },

  getFormData: () => {
    try {
      const formData = localStorage.getItem('invoiceFormData');
      return formData ? JSON.parse(formData) : null;
    } catch (error) {
      console.error('Failed to retrieve form data:', error);
      return null;
    }
  },

  clearFormData: () => {
    try {
      localStorage.removeItem('invoiceFormData');
      return true;
    } catch (error) {
      console.error('Failed to clear form data:', error);
      return false;
    }
  },

  savePDFData: (pdfData) => {
    try {
      localStorage.setItem('pdfData', JSON.stringify(pdfData));
      return true;
    } catch (error) {
      console.error('Failed to save PDF data:', error);
      return false;
    }
  },

  savePDFFile: async (file) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result,
            lastModified: file.lastModified
          };
          localStorage.setItem('pdfFile', JSON.stringify(fileData));
          resolve(fileData);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Failed to save PDF file:', error);
      return null;
    }
  },

  getPDFFile: () => {
    try {
      const fileData = localStorage.getItem('pdfFile');
      if (!fileData) return null;
      
      const parsed = JSON.parse(fileData);
      const byteCharacters = atob(parsed.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: parsed.type });
      
      return new File([blob], parsed.name, {
        type: parsed.type,
        lastModified: parsed.lastModified
      });
    } catch (error) {
      console.error('Failed to retrieve PDF file:', error);
      return null;
    }
  },

  clearPDFFile: () => {
    try {
      localStorage.removeItem('pdfFile');
      return true;
    } catch (error) {
      console.error('Failed to clear PDF file:', error);
      return false;
    }
  },

  getPDFData: () => {
    try {
      const pdfData = localStorage.getItem('pdfData');
      return pdfData ? JSON.parse(pdfData) : null;
    } catch (error) {
      console.error('Failed to retrieve PDF data:', error);
      return null;
    }
  },

  clearPDFData: () => {
    try {
      localStorage.removeItem('pdfData');
      localStorage.removeItem('pdfFile');
      localStorage.removeItem('dummyPDFFile');
      return true;
    } catch (error) {
      console.error('Failed to clear PDF data:', error);
      return false;
    }
  },

  createDummyPDFFile: async () => {
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
  /Font <<
    /F1 <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica-Bold
    >>
    /F2 <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica
    >>
  >>
>>
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 350
>>
stream
BT
/F1 24 Tf
200 700 Td
(Sample Invoice) Tj
ET
BT
/F2 12 Tf
100 650 Td
(Vendor: A-1 Exterminators) Tj
0 -25 Td
(Invoice Number: INV-2024-001) Tj
0 -25 Td
(Amount: $1,250.00) Tj
0 -25 Td
(Due Date: 02/15/2024) Tj
0 -25 Td
(Date: 01/15/2024) Tj
0 -25 Td
(Payment Terms: Net 30) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000444 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
537
%%EOF
`;
    
    const uint8Array = new TextEncoder().encode(pdfContent);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const file = new File([blob], 'sample-invoice.pdf', { 
      type: 'application/pdf', 
      lastModified: Date.now() 
    });
    
    return file;
  },

  getDummyPDFFile: async () => {
    const cachedFile = localStorage.getItem('dummyPDFFile');
    if (cachedFile) {
      try {
        const parsed = JSON.parse(cachedFile);
        const byteCharacters = atob(parsed.data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: parsed.type });
        
        return new File([blob], parsed.name, {
          type: parsed.type,
          lastModified: parsed.lastModified
        });
      } catch (error) {
        console.error('Error loading cached dummy PDF:', error);
      }
    }
    
    const file = await FormDataManager.createDummyPDFFile();
    
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result,
          lastModified: file.lastModified
        };
        localStorage.setItem('dummyPDFFile', JSON.stringify(fileData));
        resolve(file);
      };
      reader.readAsDataURL(file);
    });
  }
};

export const dummyData = {
  vendor: 'A-1 Exterminators',
  purchaseOrderNumber: 'PO-001',
  invoiceNumber: 'INV-2024-001',
  invoiceDate: '01/15/2024',
  dueDate: '02/15/2024',
  totalAmount: '1,250.00',
  description: 'Monthly pest control services for office building',
  paymentTerms: 'Net 30',
  glPostDate: '01/15/2024',
  lineAmount: '1,250.00',
  account: 'Office Maintenance',
  department: 'Facilities',
  location: 'Main Office'
};

export const dummyPDFData = {
  fileName: 'sample-invoice.pdf',
  fileSize: '245.6 KB',
  extractedData: {
    vendor: {
      name: "A-1 Exterminators",
      address: "550 Main St, Lynn",
      phone: "(555) 123-4567",
      email: "info@a1exterminators.com"
    },
    invoice: {
      number: "INV-2024-001",
      date: "01/15/2024",
      dueDate: "02/15/2024",
      totalAmount: "1,250.00",
      description: "Monthly pest control services for office building",
      paymentTerms: "Net 30",
      purchaseOrderNumber: "PO-001",
      glPostDate: "01/15/2024"
    },
    lineItems: [
      {
        description: "Monthly pest control service",
        amount: "1,250.00",
        account: "Office Maintenance",
        department: "Facilities",
        location: "Main Office"
      }
    ]
  }
};
