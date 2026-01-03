<template>
  <WMSPageLayout>
    <WMSSearchForm :model="query" @submit="handleQuery" @reset="resetQuery">
      <template #form-items>
        <a-col :span="6">
          <a-form-item field="code" label="物品编码">
            <a-input v-model="query.code" placeholder="请输入物品编码" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="name" label="物品名称">
            <a-input v-model="query.name" placeholder="请输入物品名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="category" label="物品分类">
            <a-select v-model="query.category" placeholder="请选择物品分类" allow-clear>
              <a-option value="electronics">电子产品</a-option>
              <a-option value="furniture">家具</a-option>
              <a-option value="clothing">服装</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="status" label="状态">
            <a-select v-model="query.status" placeholder="请选择状态" allow-clear>
              <a-option :value="1">启用</a-option>
              <a-option :value="0">禁用</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
    </WMSSearchForm>

    <a-card style="margin-top: 16px">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <a-button @click="handleBatchDelete" :disabled="selectedRows.length === 0">
            <template #icon>
              <icon-delete />
            </template>
            批量删除
          </a-button>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        row-key="id"
        :row-selection="{
          type: 'checkbox',
          selectedRowKeys: selectedRows,
          onSelect: handleSelect,
          onSelectAll: handleSelectAll
        }"
        :pagination="{
          current: query.page,
          pageSize: query.size,
          total: total,
          showTotal: true,
          showJumper: true,
          showPageSize: true,
          onChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }"
      >
        <template #status="{ record }">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template #createTime="{ record }">
          {{ formatDate(record.createTime) }}
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="text" size="small" status="danger" @click="handleDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- Item Form Dialog -->
    <a-modal
      v-model:visible="formVisible"
      :title="formTitle"
      :mask-closable="false"
      :esc-to-close="false"
      width="600px"
      @ok="handleSubmit"
      @cancel="closeForm"
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
  </WMSPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import WMSPageLayout from '../components/WMSPageLayout.vue';
import WMSSearchForm from '../components/WMSSearchForm.vue';
import { getItemList, addItem, updateItem, deleteItem } from '@/apis/wms/itemService';
import type { Item, ItemQuery, ItemForm } from '@/types/wms';
import { formatDate } from '@/utils';

// Table columns
const columns = [
  {
    title: '物品编码',
    dataIndex: 'code',
    slotName: 'code'
  },
  {
    title: '物品名称',
    dataIndex: 'name',
    slotName: 'name'
  },
  {
    title: '物品分类',
    dataIndex: 'category',
    slotName: 'category'
  },
  {
    title: '单位',
    dataIndex: 'unit',
    slotName: 'unit'
  },
  {
    title: '重量(kg)',
    dataIndex: 'weight',
    slotName: 'weight'
  },
  {
    title: '体积(m³)',
    dataIndex: 'volume',
    slotName: 'volume'
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    slotName: 'createTime'
  },
  {
    title: '操作',
    slotName: 'action',
    width: 120
  }
];

// Reactive data
const tableData = ref<Item[]>([]);
const total = ref(0);
const loading = ref(false);

// Query parameters
const query = reactive<ItemQuery>({
  code: '',
  name: '',
  category: '',
  status: undefined,
  page: 1,
  size: 10
});

// Selection
const selectedRows = ref<number[]>([]);

// Form
const formVisible = ref(false);
const formTitle = ref('');
const formData = ref<ItemForm>({
  code: '',
  name: '',
  description: '',
  category: '',
  unit: '',
  weight: undefined,
  volume: undefined,
  status: 1
});

// Form reference
const formRef = ref();

// Form validation rules
const formRules = {
  code: [{ required: true, message: '请输入物品编码' }],
  name: [{ required: true, message: '请输入物品名称' }],
  unit: [{ required: true, message: '请输入单位' }],
  status: [{ required: true, message: '请选择状态' }]
};

// Methods
const getList = async () => {
  loading.value = true;
  try {
    const { data } = await getItemList(query);
    tableData.value = data.list;
    total.value = data.total;
  } catch (error) {
    console.error('Failed to fetch item list:', error);
    Message.error('获取物品列表失败');
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  query.page = 1;
  getList();
};

const resetQuery = () => {
  query.code = '';
  query.name = '';
  query.category = '';
  query.status = undefined;
  query.page = 1;
  getList();
};

const handleAdd = () => {
  formTitle.value = '新增物品';
  formData.value = {
    code: '',
    name: '',
    description: '',
    category: '',
    unit: '',
    weight: undefined,
    volume: undefined,
    status: 1
  };
  formVisible.value = true;
};

const handleEdit = (record: Item) => {
  formTitle.value = '编辑物品';
  formData.value = { ...record };
  formVisible.value = true;
};

const handleDelete = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '您确定要删除这条数据吗？',
    async onOk() {
      try {
        await deleteItem(id);
        Message.success('删除成功');
        getList();
      } catch (error) {
        console.error('Failed to delete item:', error);
        Message.error('删除失败');
      }
    }
  });
};

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) return;
  
  Modal.confirm({
    title: '确认删除',
    content: `您确定要删除这 ${selectedRows.value.length} 条数据吗？`,
    async onOk() {
      try {
        // Batch delete implementation would go here
        Message.success('批量删除成功');
        selectedRows.value = [];
        getList();
      } catch (error) {
        console.error('Failed to batch delete items:', error);
        Message.error('批量删除失败');
      }
    }
  });
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    
    if (formTitle.value === '新增物品') {
      await addItem(formData.value);
      Message.success('新增成功');
    } else {
      await updateItem(formData.value.id as number, formData.value);
      Message.success('更新成功');
    }
    
    closeForm();
    getList();
  } catch (error) {
    console.error('Form submission failed:', error);
    Message.error('提交失败');
  }
};

const closeForm = () => {
  formVisible.value = false;
};

const handleSelect = (record: Item, checked: boolean) => {
  if (checked) {
    selectedRows.value.push(record.id);
  } else {
    const index = selectedRows.value.indexOf(record.id);
    if (index > -1) {
      selectedRows.value.splice(index, 1);
    }
  }
};

const handleSelectAll = (checked: boolean, data: Item[]) => {
  if (checked) {
    selectedRows.value = data.map(item => item.id);
  } else {
    selectedRows.value = [];
  }
};

const handlePageChange = (page: number) => {
  query.page = page;
  getList();
};

const handlePageSizeChange = (size: number) => {
  query.size = size;
  query.page = 1;
  getList();
};

onMounted(() => {
  getList();
});
</script>