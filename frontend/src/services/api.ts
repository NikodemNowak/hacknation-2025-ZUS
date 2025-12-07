import type { ExtendedFormData } from '../components/FormularzPoszkodowanego';
import { mapToBackendJSON } from '../utils/dataMappers';

const API_URL = 'http://127.0.0.1:8000';

export const createCase = async () => {
    const response = await fetch(`${API_URL}/api/cases`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to create case');
    }
    return response.json();
};

export const updateZawiadomienie = async (caseId: string, data: any) => {
    const response = await fetch(`${API_URL}/api/cases/${caseId}/zawiadomienie`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update zawiadomienie: ${errorBody}`);
    }
    return response.json();
};

export const updateWyjasnienia = async (caseId: string, data: any) => {
    const response = await fetch(`${API_URL}/api/cases/${caseId}/wyjasnienia`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update wyjasnienia: ${errorBody}`);
    }
    return response.json();
};

export const updateCaseStatus = async (caseId: string, status: string) => {
    const response = await fetch(`${API_URL}/api/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update status: ${errorBody}`);
    }
    return response.json();
};

export const submitFullForm = async (formData: ExtendedFormData) => {
    // 1. Create a new case
    const newCase = await createCase();
    const caseId = newCase.id;

    // 2. Map data to backend format
    const { zawiadomieniePayload, wyjasnieniaPayload } = mapToBackendJSON(formData);

    // 3. Perform updates
    await updateZawiadomienie(caseId, zawiadomieniePayload);
    await updateWyjasnienia(caseId, wyjasnieniaPayload);

    return caseId;
};
