<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    width="600px"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="code" label="库位编码" required>
            <a-input v-model="formData.code" placeholder="请输入库位编码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="name" label="库位名称" required>
            <a-input v-model="formData.name" placeholder="请输入库位名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="warehouseId" label="所属仓库" required>
            <a-select v-model="formData.warehouseId" placeholder="请选择仓库">
              <!-- Will be populated dynamically -->
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="locationType" label="库位类型" required>
            <a-select v-model="formData.locationType" placeholder="请选择库位类型">
              <a-option value="storage">存储区</a-option>
              <a-option value="picking">拣选区</a-option>
              <a-option value="packing">包装区</a-option>
              <a-option value="receiving">收货区</a-option>
              <a-option value="shipping">发货区</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="capacity" label="容量">
            <a-input-number v-model="formData.capacity" placeholder="请输入容量" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="status" label="状态" required>
            <a-radio-group v-model="formData.status">
              <a-radio :value="1">启用</a-radio>
              <a-radio :value="0">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { LocationForm } from '@/types/wms';

// Define props
interface Props {
  visible: boolean;
  title: string;
  formData?: LocationForm;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  formData: () => ({
    code: '',
    name: '',
    warehouseId: 0,
    locationType: '',
    capacity: undefined,
    status: 1
  })
});

// Define emits
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  submit: [formData: LocationForm];
  cancel: [];
}>();

// Template refs
const formRef = ref();
const modalVisible = ref(props.visible);

// Form validation rules
const formRules = {
  code: [
    { required: true, message: '请输入库位编码' },
    { minLength: 1, maxLength: 32, message: '库位编码长度应在1-32个字符之间' }
  ],
  name: [
    { required: true, message: '请输入库位名称' },
    { minLength: 1, maxLength: 100, message: '库位名称长度应在1-100个字符之间' }
  ],
  warehouseId: [
    { required: true, message: '请选择所属仓库' }
  ],
  locationType: [
    { required: true, message: '请选择库位类型' }
  ],
  status: [
    { required: true, message: '请选择状态' }
  ]
};

// Watch for changes in props
watch(
  () => props.visible,
  (newVal) => {
    modalVisible.value = newVal;
  }
);

// Methods
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    emit('submit', props.formData);
  } catch (error) {
    console.error('Form validation failed:', error);
  }
};

const handleCancel = () => {
  emit('update:visible', false);
  emit('cancel');
};

// Sync internal state with prop
watch(modalVisible, (val) => {
  emit('update:visible', val);
});
</script>