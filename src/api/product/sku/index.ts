
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData, SkuData } from './type'
enum API {
  SKU_URL = '/new_api/product/list/',
  SALE_URL = '/new_api/product/onSale/',
  CANCELSALE_URL = '/new_api/product/cancelSale/',
  SKUINFO_URL = '/new_api/product/getSkuInfo/',
  DELETESKU_URL = '/new_api/product/deleteSku/',
  UPDATESKU_URL = '/new_api/product/updateSku',
  UPLOAD_SKU_IMAGE_URL = '/new_api/product/uploadSkuImage',
}

export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)

export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)

export const reqUpdateSku = (data: SkuData) =>
  request.post<any, any>(API.UPDATESKU_URL, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const reqUploadSkuImage = (file: File, skuId: number) => {
  const formData = new FormData()
  formData.append('skuImage', file)
  formData.append('skuId', skuId.toString())

  return request.post<any, { code: number; message: string; path: string }>(
    API.UPLOAD_SKU_IMAGE_URL,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
