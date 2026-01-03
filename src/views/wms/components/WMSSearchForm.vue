<template>
  <a-card>
    <a-form :model="model" layout="vertical">
      <a-row :gutter="16">
        <slot name="form-items"></slot>
        <a-col :span="24">
          <a-space>
            <a-button type="primary" @click="onSubmit">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="onReset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineOptions({
  name: 'WMSSearchForm'
});

interface Props {
  model: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  model: () => ({})
});

const emit = defineEmits<{
  submit: [];
  reset: [];
}>();

const onSubmit = () => {
  emit('submit');
};

const onReset = () => {
  emit('reset');
};
</script>