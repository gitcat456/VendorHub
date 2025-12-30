import client from './client';

export const initiatePayment = async (amount, phoneNumber) => {
    const response = await client.post('api/subscriptions/initiate/', {
        amount,
        phone_number: phoneNumber
    });
    return response.data;
};
