/**
 * EPS Document Servicing API Client
 * Handles all communication with CMG's Document API
 */

const API_CONFIG = {
  baseUrl: 'https://qa.servicing-api.cmgtest.com/docs',
  apiKey: 'dd87e724615b4d6988c58fe5b771876a',
};

/**
 * Base fetch wrapper with authentication and error handling
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  const headers = {
    'Ocp-Apim-Subscription-Key': API_CONFIG.apiKey,
    'Accept': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
        errorData.title ||
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`EPS API Error [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Get all documents for a specific loan (AccountId)
 * @param {string|number} accountId - Loan number (e.g., "TEST0000081920")
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} - Documents response
 */
export const getDocumentsByLoan = async (accountId, filters = {}) => {
  const queryParams = new URLSearchParams({
    AccountId: accountId,
    ...filters,
  });

  const response = await apiFetch(`/api/v1/documents?${queryParams}`);
  return response;
};

/**
 * Get a single document by GUID
 * @param {string} documentGuid - Document GUID
 * @returns {Promise<Object>} - Document metadata
 */
export const getDocumentById = async (documentGuid) => {
  return await apiFetch(`/api/v1/documents/${documentGuid}`);
};

/**
 * Download a document file
 * @param {string} documentGuid - Document GUID
 * @returns {Promise<Object>} - File content, name, and MIME type
 */
export const downloadDocument = async (documentGuid) => {
  return await apiFetch(`/api/v1/documents/${documentGuid}/download`);
};

/**
 * Get multiple documents by GUIDs (bulk operation)
 * @param {string|number} accountId - Loan number
 * @param {string[]} documentGuids - Array of document GUIDs
 * @returns {Promise<Object>} - Bulk documents response
 */
export const getBulkDocuments = async (accountId, documentGuids) => {
  const queryParams = new URLSearchParams({
    AccountId: accountId,
  });

  documentGuids.forEach(guid => {
    queryParams.append('DocumentGuids', guid);
  });

  return await apiFetch(`/api/v1/documents/bulk?${queryParams}`);
};

/**
 * Upload a new document to a loan
 * @param {Object} documentData - Document upload data
 * @returns {Promise<Object>} - Upload response
 */
export const uploadDocument = async (documentData) => {
  const formData = new FormData();
  formData.append('AccountId', documentData.accountId);
  formData.append('Name', documentData.name);
  formData.append('DocumentTypeGUID', documentData.documentTypeGUID);
  formData.append('SourceApplicationGUID', documentData.sourceApplicationGUID);

  if (documentData.vendorGUID) {
    formData.append('VendorGUID', documentData.vendorGUID);
  }

  formData.append('File', documentData.file);

  return await apiFetch('/api/v1/documents', {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type - browser will set it with boundary for multipart
    },
  });
};

/**
 * Merge multiple documents into a single PDF
 * @param {string|number} accountId - Loan number
 * @param {string[]} documentGuids - Array of document GUIDs to merge
 * @returns {Promise<Object>} - Merge response
 */
export const mergeDocuments = async (accountId, documentGuids) => {
  return await apiFetch('/api/v1/documents/merge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountId,
      documentGuids,
    }),
  });
};

/**
 * Helper: Get document status for bundle building
 * Compares required documents vs. existing documents
 *
 * @param {string|number} accountId - Loan number
 * @param {Array} requiredDocuments - Array of required document types for bundle
 * @returns {Promise<Object>} - Status summary
 */
export const getLoanDocumentStatus = async (accountId, requiredDocuments = []) => {
  try {
    const response = await getDocumentsByLoan(accountId);
    const existingDocuments = response?.documents || [];

    // Map existing documents by type
    const existingDocMap = {};
    existingDocuments.forEach(doc => {
      const typeKey = doc.documentTypeGUID || doc.name;
      if (!existingDocMap[typeKey]) {
        existingDocMap[typeKey] = [];
      }
      existingDocMap[typeKey].push(doc);
    });

    // Calculate status for each required document
    const documentStatus = requiredDocuments.map(reqDoc => {
      const found = existingDocMap[reqDoc.documentTypeCode] ||
                    existingDocMap[reqDoc.documentType] ||
                    existingDocuments.filter(d =>
                      d.name?.toLowerCase().includes(reqDoc.documentType?.toLowerCase())
                    );

      return {
        ...reqDoc,
        status: found && found.length > 0 ? 'Found' : 'Missing',
        foundCount: found ? found.length : 0,
        documents: found || [],
      };
    });

    const summary = {
      loanNumber: accountId,
      totalRequired: requiredDocuments.length,
      foundCount: documentStatus.filter(d => d.status === 'Found').length,
      missingCount: documentStatus.filter(d => d.status === 'Missing').length,
      documentStatus,
      allDocuments: existingDocuments,
    };

    return summary;
  } catch (error) {
    console.error(`Error getting document status for loan ${accountId}:`, error);
    throw error;
  }
};

/**
 * Helper: Get document status for multiple loans (bulk)
 * Used by Bundle Manager for bulk operations
 *
 * @param {Array} loanNumbers - Array of loan numbers
 * @param {Array} requiredDocuments - Required documents for bundle
 * @returns {Promise<Array>} - Array of loan statuses
 */
export const getBulkLoanDocumentStatus = async (loanNumbers, requiredDocuments = []) => {
  const promises = loanNumbers.map(loanNumber =>
    getLoanDocumentStatus(loanNumber, requiredDocuments)
      .catch(error => ({
        loanNumber,
        error: error.message,
        totalRequired: requiredDocuments.length,
        foundCount: 0,
        missingCount: requiredDocuments.length,
        documentStatus: [],
        allDocuments: [],
      }))
  );

  return await Promise.all(promises);
};

/**
 * Test connection to EPS API
 * @param {string} testLoanNumber - Optional test loan number
 * @returns {Promise<boolean>} - True if connection successful
 */
export const testConnection = async (testLoanNumber = 'TEST0000081920') => {
  try {
    const response = await getDocumentsByLoan(testLoanNumber);
    console.log('✅ EPS API Connection Successful', response);
    return true;
  } catch (error) {
    console.error('❌ EPS API Connection Failed:', error);
    return false;
  }
};

// Export the API config for reference
export { API_CONFIG };
