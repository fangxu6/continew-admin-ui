import http from '@/utils/http';
import type { PageResult, InboundOrder, ItemQuery } from '@/types/wms';

const BASE_URL = '/wms/inbound';

export function getInboundOrderList(params: ItemQuery) {
  return http.get<PageResult<InboundOrder>>(`${BASE_URL}/page`, { params });
}

export function getInboundOrderDetail(id: number) {
  return http.get<InboundOrder>(`${BASE_URL}/${id}`);
}

export function addInboundOrder(data: Omit<InboundOrder, 'id'>) {
  return http.post(`${BASE_URL}`, data);
}

export function updateInboundOrder(id: number, data: Partial<InboundOrder>) {
  return http.put(`${BASE_URL}/${id}`, data);
}

export function deleteInboundOrder(id: number) {
  return http.del(`${BASE_URL}/${id}`);
}