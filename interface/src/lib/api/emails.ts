import api from '../axios';

export interface EmailTemplateResponse {
    id?: string;
    appId: string;
    emailSubject: string;
    emailBodyTemplate: string;
}

export async function getEmailTemplate(): Promise<EmailTemplateResponse> {
    const { data } = await api.get('/v1/settings/emails');
    return data;
}

export async function saveEmailTemplate(subject: string, body: string): Promise<EmailTemplateResponse> {
    const { data } = await api.post('/v1/settings/emails', { subject, body });
    return data;
}
