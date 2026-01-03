import http from '@/utils/http';
import type { PageResult, Item, ItemQuery, ItemForm } from '@/types/wms';

const BASE_URL = '/wms/item';

export function getItemList(params: ItemQuery) {
  return http.get<PageResult<Item>>(`${BASE_URL}/page`, { params });
}

export function getItemDetail(id: number) {
  return http.get<Item>(`${BASE_URL}/${id}`);
}

export function addItem(data: ItemForm) {
  return http.post(`${BASE_URL}`, data);
}

export function updateItem(id: number, data: ItemForm) {
  return http.put(`${BASE_URL}/${id}`, data);
}

export function deleteItem(id: number) {
  return http.del(`${BASE_URL}/${id}`);
}