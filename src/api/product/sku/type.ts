export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface Attr {
  id?: number
  attrId: number | string
  valueId: number | string
}

export interface saleAttr {
  id?: number
  saleAttrId: number | string
  saleAttrValueId: number | string
}

export interface SkuData {
  spuId?: string | number //已有的SPU的ID
  tmId?: string | number //SPU品牌的ID
  skuName?: string //sku名字
  price?: string | number //sku价格
  weight?: string | number //sku重量
  skuDesc?: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleAttr[]
  skuDefaultImg?: string //sku图片地址
  isSale?: number
  id?: number
  skuTrademark?: string | number //sku品牌
  category1Id?: string | number // 一级分类ID
  category2Id?: string | number // 二级分类ID
  category3Id?: string | number // 三级分类ID
}

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

export interface SkuInfoData extends ResponseData {
  data: SkuData
}


// 图片上传响应数据
export interface UploadSkuImageResponse extends ResponseData {
  path: string; // 图片的访问路径
}