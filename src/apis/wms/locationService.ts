import http from '@/utils/http';
import type { PageResult, Location, ItemQuery, LocationForm } from '@/types/wms';

const BASE_URL = '/wms/location';

export function getLocationList(params: ItemQuery) {
  return http.get<PageResult<Location>>(`${BASE_URL}/page`, { params });
}

export function getLocationDetail(id: number) {
  return http.get<Location>(`${BASE_URL}/${id}`);
}

export function addLocation(data: LocationForm) {
  return http.post(`${BASE_URL}`, data);
}

export function updateLocation(id: number, data: LocationForm) {
  return http.put(`${BASE_URL}/${id}`, data);
}

export function deleteLocation(id: number) {
  return http.del(`${BASE_URL}/${id}`);
}