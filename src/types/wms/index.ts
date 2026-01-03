// WMS Entity Types

export interface Item {
  id: number;
  code: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  weight?: number;
  volume?: number;
  status: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface Location {
  id: number;
  code: string;
  name: string;
  warehouseId: number;
  locationType: string;
  capacity?: number;
  status: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  contact?: string;
  phone?: string;
  status: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contact?: string;
  phone?: string;
  address?: string;
  status: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface Customer {
  id: number;
  code: string;
  name: string;
  contact?: string;
  phone?: string;
  address?: string;
  status: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface Inventory {
  id: number;
  itemId: number;
  locationId: number;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface InboundOrder {
  id: number;
  orderNo: string;
  supplierId: number;
  status: string;
  expectedDate?: Date;
  receivedDate?: Date;
  remark?: string;
  createTime?: Date;
  updateTime?: Date;
}

export interface OutboundOrder {
  id: number;
  orderNo: string;
  customerId: number;
  status: string;
  expectedDate?: Date;
  shippedDate?: Date;
  remark?: string;
  createTime?: Date;
  updateTime?: Date;
}

// Form Types
export interface ItemForm {
  code: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  weight?: number;
  volume?: number;
  status: number;
}

export interface LocationForm {
  code: string;
  name: string;
  warehouseId: number;
  locationType: string;
  capacity?: number;
  status: number;
}

export interface InventoryAdjustmentForm {
  itemId: number;
  locationId: number;
  quantity: number;
  reason: string;
  remark?: string;
}

// Query Types
export interface ItemQuery {
  code?: string;
  name?: string;
  category?: string;
  status?: number;
  page: number;
  size: number;
}

export interface InventoryQuery {
  itemId?: number;
  locationId?: number;
  minQuantity?: number;
  maxQuantity?: number;
  page: number;
  size: number;
}

// API Response Types
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface Result<T> {
  code: number;
  message: string;
  data?: T;
}