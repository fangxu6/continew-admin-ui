<template>
  <WMSPageLayout>
    <WMSSearchForm :model="query" @submit="handleQuery" @reset="resetQuery">
      <template #form-items>
        <a-col :span="6">
          <a-form-item field="code" label="库位编码">
            <a-input v-model="query.code" placeholder="请输入库位编码" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="name" label="库位名称">
            <a-input v-model="query.name" placeholder="请输入库位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="warehouseId" label="所属仓库">
            <a-select v-model="query.warehouseId" placeholder="请选择仓库" allow-clear>
              <!-- Will be populated dynamically -->
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

    <!-- Location Form Dialog -->
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
  </WMSPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import WMSPageLayout from '../components/WMSPageLayout.vue';
import WMSSearchForm from '../components/WMSSearchForm.vue';
import { getLocationList, addLocation, updateLocation, deleteLocation } from '@/apis/wms/locationService';
import type { Location, ItemQuery, LocationForm } from '@/types/wms';
import { formatDate } from '@/utils';

// Table columns
const columns = [
  {
    title: '库位编码',
    dataIndex: 'code',
    slotName: 'code'
  },
  {
    title: '库位名称',
    dataIndex: 'name',
    slotName: 'name'
  },
  {
    title: '所属仓库',
    dataIndex: 'warehouseId',
    slotName: 'warehouseId'
  },
  {
    title: '库位类型',
    dataIndex: 'locationType',
    slotName: 'locationType'
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    slotName: 'capacity'
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
const tableData = ref<Location[]>([]);
const total = ref(0);
const loading = ref(false);

// Query parameters
const query = reactive<ItemQuery>({
  code: '',
  name: '',
  warehouseId: undefined,
  status: undefined,
  page: 1,
  size: 10
});

// Selection
const selectedRows = ref<number[]>([]);

// Form
const formVisible = ref(false);
const formTitle = ref('');
const formData = ref<LocationForm>({
  code: '',
  name: '',
  warehouseId: 0,
  locationType: '',
  capacity: undefined,
  status: 1
});

// Form reference
const formRef = ref();

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

// Methods
const getList = async () => {
  loading.value = true;
  try {
    const { data } = await getLocationList(query);
    tableData.value = data.list;
    total.value = data.total;
  } catch (error) {
    console.error('Failed to fetch location list:', error);
    Message.error('获取库位列表失败');
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
  query.warehouseId = undefined;
  query.status = undefined;
  query.page = 1;
  getList();
};

const handleAdd = () => {
  formTitle.value = '新增库位';
  formData.value = {
    code: '',
    name: '',
    warehouseId: 0,
    locationType: '',
    capacity: undefined,
    status: 1
  };
  formVisible.value = true;
};

const handleEdit = (record: Location) => {
  formTitle.value = '编辑库位';
  formData.value = { ...record };
  formVisible.value = true;
};

const handleDelete = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '您确定要删除这条数据吗？',
    async onOk() {
      try {
        await deleteLocation(id);
        Message.success('删除成功');
        getList();
      } catch (error) {
        console.error('Failed to delete location:', error);
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
        console.error('Failed to batch delete locations:', error);
        Message.error('批量删除失败');
      }
    }
  });
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    
    if (formTitle.value === '新增库位') {
      await addLocation(formData.value);
      Message.success('新增成功');
    } else {
      await updateLocation(formData.value.id as number, formData.value);
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

const handleSelect = (record: Location, checked: boolean) => {
  if (checked) {
    selectedRows.value.push(record.id);
  } else {
    const index = selectedRows.value.indexOf(record.id);
    if (index > -1) {
      selectedRows.value.splice(index, 1);
    }
  }
};

const handleSelectAll = (checked: boolean, data: Location[]) => {
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