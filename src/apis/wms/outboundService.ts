import http from '@/utils/http';
import type { PageResult, OutboundOrder, ItemQuery } from '@/types/wms';

const BASE_URL = '/wms/outbound';

export function getOutboundOrderList(params: ItemQuery) {
  return http.get<PageResult<OutboundOrder>>(`${BASE_URL}/page`, { params });
}

export function getOutboundOrderDetail(id: number) {
  return http.get<OutboundOrder>(`${BASE_URL}/${id}`);
}

export function addOutboundOrder(data: Omit<OutboundOrder, 'id'>) {
  return http.post(`${BASE_URL}`, data);
}

export function updateOutboundOrder(id: number, data: Partial<OutboundOrder>) {
  return http.put(`${BASE_URL}/${id}`, data);
}

export function deleteOutboundOrder(id: number) {
  return http.del(`${BASE_URL}/${id}`);
}