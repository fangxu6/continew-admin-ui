import http from '@/utils/http';
import type { PageResult, Inventory, InventoryQuery, InventoryAdjustmentForm } from '@/types/wms';

const BASE_URL = '/wms/inventory';

export function getInventoryList(params: InventoryQuery) {
  return http.get<PageResult<Inventory>>(`${BASE_URL}/page`, { params });
}

export function getInventoryDetail(id: number) {
  return http.get<Inventory>(`${BASE_URL}/${id}`);
}

export function adjustInventory(data: InventoryAdjustmentForm) {
  return http.post(`${BASE_URL}/adjust`, data);
}