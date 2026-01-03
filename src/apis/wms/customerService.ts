import http from '@/utils/http';
import type { PageResult, Customer, ItemQuery } from '@/types/wms';

const BASE_URL = '/wms/customer';

export function getCustomerList(params: ItemQuery) {
  return http.get<PageResult<Customer>>(`${BASE_URL}/page`, { params });
}

export function getCustomerDetail(id: number) {
  return http.get<Customer>(`${BASE_URL}/${id}`);
}

export function addCustomer(data: Omit<Customer, 'id'>) {
  return http.post(`${BASE_URL}`, data);
}

export function updateCustomer(id: number, data: Partial<Customer>) {
  return http.put(`${BASE_URL}/${id}`, data);
}

export function deleteCustomer(id: number) {
  return http.del(`${BASE_URL}/${id}`);
}