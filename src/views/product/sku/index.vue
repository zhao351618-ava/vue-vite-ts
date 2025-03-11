<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
  reqUpdateSku,
  reqUploadSkuImage,
} from '@/api/product/sku'
import type {
  SkuData,
  SkuResponseData,
  SkuInfoData,
} from '@/api/product/sku/type'
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref(0)
let skuArr = ref<SkuData[]>([])
let drawer_info = ref<boolean>(false)
let drawer_update = ref<boolean>(false)
let skuInfo = ref<SkuData>({})
onMounted(() => {
  getHasSku()
})

const fileInput = ref<HTMLInputElement | null>(null)


const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)

  if (res.code === 200) {
    total.value = res.data.total
    skuArr.value = res.data.records
  }
}

const handler = (pageSizes: number) => {
  getHasSku()
}

const updateSale = async (row: SkuData) => {
  if (row.isSale === 1) {
    await reqCancelSale(row.id as number)
    ElMessage({
      type: 'success',
      message: '下架成功',
    })
    getHasSku(pageNo.value)
  } else {
    await reqSaleSku(row.id as number)
    ElMessage({
      type: 'success',
      message: '上架成功',
    })
    getHasSku(pageNo.value)
  }
}

const updateSku = async (row: SkuData) => {
  drawer_update.value = true // 打开编辑抽屉
  let res: SkuInfoData = await reqSkuInfo(row.id as number) // 获取商品详情
  skuInfo.value = res.data // 填充商品信息
}

//（更新）上传sku图片
const handleImageUpload = async () => {
  const file = fileInput.value?.files?.[0];
  if (!file) {
    alert('请选择图片');
    return;
  }

  try {
    const res = await reqUploadSkuImage(file, skuInfo.value.id as number);
    if (res.code === 200) {
      console.log('图片上传成功', res.path);
      skuInfo.value.skuDefaultImg = res.path; // 更新 skuDefaultImg
      ElMessage({ type: 'success', message: '图片上传成功' });
    } else {
      console.error('图片上传失败', res.message);
      ElMessage({ type: 'error', message: '图片上传失败' });
    }
  } catch (err) {
    console.error('图片上传失败', err);
    ElMessage({ type: 'error', message: '图片上传失败' });
  }
};

const submitUpdate = async () => {
  try {
    console.log('Submitting SKU Data:', skuInfo.value); // 打印提交的数据
    let res = await reqUpdateSku(skuInfo.value);
    if (res.code === 200) {
      ElMessage({ type: 'success', message: '更新成功' });
      drawer_update.value = false;
      getHasSku(pageNo.value);
    } else {
      ElMessage({ type: 'error', message: '更新失败' });
    }
  } catch (err) {
    ElMessage({ type: 'error', message: '更新失败' });
  }
};

const findSku = async (row: SkuData) => {
  drawer_info.value = true
  let res: SkuInfoData = await reqSkuInfo(row.id as number)
  skuInfo.value = res.data
}

const removeSku = async (id: number) => {
  try {
    let res = await reqRemoveSku(id) // 调用删除接口
    if (res.code === 200) {
      ElMessage({ type: 'success', message: '删除成功' })
      getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1) // 刷新列表
    } else {
      ElMessage({ type: 'error', message: '删除失败' })
    }
  } catch (err) {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}


// 处理分类变化事件
const handleCategoryChange = (c1Id: string, c2Id: string, c3Id: string) => {
  skuInfo.value.category1Id = c1Id;
  skuInfo.value.category2Id = c2Id;
  skuInfo.value.category3Id = c3Id;
};

</script>
<template>

  <def-category :scene="1" @category-change="handleCategoryChange" />
  <el-card>
    <el-table border style="margin: 10px 0; width: 100%" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
        fixed
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="品牌"
        show-overflow-tooltip
        width="150px"
        prop="skuTrademark"
      ></el-table-column>
      <el-table-column label="图片" width="250px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="350px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column
        label="重量(g)"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="350px">
        <template #="{ row, $index }">
          <el-button
            size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes, total,"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <el-drawer v-model="drawer_info">
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
    <el-drawer v-model="drawer_update">
      <template #header>
        <h4>编辑商品信息</h4>
      </template>
      <template #default>
        <el-form :model="skuInfo" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="skuInfo.skuName" />
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="skuInfo.skuTrademark" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="skuInfo.skuDesc" type="textarea" />
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="skuInfo.weight" type="number" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="skuInfo.price" type="number" />
          </el-form-item>
          <el-form-item label="默认图片">
            <el-input v-model="skuInfo.skuDefaultImg" />
          </el-form-item>
          <el-form-item label="上传图片">
            <label for="skuImage" class="upload-box">
              <input
                type="file"
                id="skuImage"
                accept="image/*"
                @change="handleImageUpload"
                hidden
              />
              <div class="upload-icon">+</div>
              <div class="upload-text">点击上传图片</div>
            </label>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdate">提交</el-button>
            <el-button @click="drawer_update = false">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </el-card>

</template>
<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.upload-box {
  display: inline-block;
  width: 150px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  text-align: center;
  padding-top: 50px;
}

.upload-box:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 30px;
  color: #ccc;
  transition: color 0.3s ease;
}

.upload-box:hover .upload-icon {
  color: #409eff;
}

.upload-text {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}
</style>
