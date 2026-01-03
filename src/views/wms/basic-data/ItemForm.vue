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
          <a-form-item field="code" label="物品编码" required>
            <a-input v-model="formData.code" placeholder="请输入物品编码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="name" label="物品名称" required>
            <a-input v-model="formData.name" placeholder="请输入物品名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="category" label="物品分类">
            <a-select v-model="formData.category" placeholder="请选择物品分类">
              <a-option value="electronics">电子产品</a-option>
              <a-option value="furniture">家具</a-option>
              <a-option value="clothing">服装</a-option>
              <a-option value="food">食品</a-option>
              <a-option value="books">图书</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="unit" label="单位" required>
            <a-input v-model="formData.unit" placeholder="请输入单位" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="weight" label="重量(kg)">
            <a-input-number v-model="formData.weight" placeholder="请输入重量" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="volume" label="体积(m³)">
            <a-input-number v-model="formData.volume" placeholder="请输入体积" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item field="description" label="描述">
            <a-textarea v-model="formData.description" placeholder="请输入描述" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
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
import type { ItemForm } from '@/types/wms';

// Define props
interface Props {
  visible: boolean;
  title: string;
  formData?: ItemForm;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  formData: () => ({
    code: '',
    name: '',
    description: '',
    category: '',
    unit: '',
    weight: undefined,
    volume: undefined,
    status: 1
  })
});

// Define emits
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  submit: [formData: ItemForm];
  cancel: [];
}>();

// Template refs
const formRef = ref();
const modalVisible = ref(props.visible);

// Form validation rules
const formRules = {
  code: [
    { required: true, message: '请输入物品编码' },
    { minLength: 1, maxLength: 32, message: '物品编码长度应在1-32个字符之间' }
  ],
  name: [
    { required: true, message: '请输入物品名称' },
    { minLength: 1, maxLength: 100, message: '物品名称长度应在1-100个字符之间' }
  ],
  unit: [
    { required: true, message: '请输入单位' }
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