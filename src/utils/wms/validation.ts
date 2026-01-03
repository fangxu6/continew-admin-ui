/**
 * WMS Form Validation Utilities
 */

// Validate item form data
export function validateItemForm(formData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.code || formData.code.trim() === '') {
    errors.push('物品编码不能为空');
  } else if (formData.code.length > 32) {
    errors.push('物品编码长度不能超过32个字符');
  }

  if (!formData.name || formData.name.trim() === '') {
    errors.push('物品名称不能为空');
  } else if (formData.name.length > 100) {
    errors.push('物品名称长度不能超过100个字符');
  }

  if (!formData.unit || formData.unit.trim() === '') {
    errors.push('物品单位不能为空');
  }

  if (formData.status === undefined || formData.status === null) {
    errors.push('物品状态不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate location form data
export function validateLocationForm(formData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.code || formData.code.trim() === '') {
    errors.push('库位编码不能为空');
  } else if (formData.code.length > 32) {
    errors.push('库位编码长度不能超过32个字符');
  }

  if (!formData.name || formData.name.trim() === '') {
    errors.push('库位名称不能为空');
  } else if (formData.name.length > 100) {
    errors.push('库位名称长度不能超过100个字符');
  }

  if (!formData.warehouseId) {
    errors.push('所属仓库不能为空');
  }

  if (!formData.locationType || formData.locationType.trim() === '') {
    errors.push('库位类型不能为空');
  }

  if (formData.status === undefined || formData.status === null) {
    errors.push('库位状态不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate supplier form data
export function validateSupplierForm(formData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.code || formData.code.trim() === '') {
    errors.push('供应商编码不能为空');
  } else if (formData.code.length > 32) {
    errors.push('供应商编码长度不能超过32个字符');
  }

  if (!formData.name || formData.name.trim() === '') {
    errors.push('供应商名称不能为空');
  } else if (formData.name.length > 100) {
    errors.push('供应商名称长度不能超过100个字符');
  }

  if (formData.status === undefined || formData.status === null) {
    errors.push('供应商状态不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate customer form data
export function validateCustomerForm(formData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formData.code || formData.code.trim() === '') {
    errors.push('客户编码不能为空');
  } else if (formData.code.length > 32) {
    errors.push('客户编码长度不能超过32个字符');
  }

  if (!formData.name || formData.name.trim() === '') {
    errors.push('客户名称不能为空');
  } else if (formData.name.length > 100) {
    errors.push('客户名称长度不能超过100个字符');
  }

  if (formData.status === undefined || formData.status === null) {
    errors.push('客户状态不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}