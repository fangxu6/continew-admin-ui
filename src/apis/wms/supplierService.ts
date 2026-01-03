import http from '@/utils/http';
import type { PageResult, Supplier, ItemQuery } from '@/types/wms';

const BASE_URL = '/wms/supplier';

export function getSupplierList(params: ItemQuery) {
  return http.get<PageResult<Supplier>>(`${BASE_URL}/page`, { params });
}

export function getSupplierDetail(id: number) {
  return http.get<Supplier>(`${BASE_URL}/${id}`);
}

export function addSupplier(data: Omit<Supplier, 'id'>) {
  return http.post(`${BASE_URL}`, data);
}

export function updateSupplier(id: number, data: Partial<Supplier>) {
  return http.put(`${BASE_URL}/${id}`, data);
}

export function deleteSupplier(id: number) {
  return http.del(`${BASE_URL}/${id}`);
}