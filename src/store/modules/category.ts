// store/modules/category.ts
import { defineStore } from 'pinia'
import type { CategoryObj, CategoryResponseData } from '@/api/product/attr/type' // 确保路径正确
import { reqC1, reqC2, reqC3 } from '@/api/product/attr' // 从分类模块导入，而不是属性模块

interface CategoryState {
  c1Id: string
  c2Id: string
  c3Id: string
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
}

export const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => ({
    c1Id: '',
    c2Id: '',
    c3Id: '',
    c1Arr: [],
    c2Arr: [],
    c3Arr: [],
  }),

  actions: {
    async getC1() {
      const res: CategoryResponseData = await reqC1()
      if (res.code === 200) {
        this.c1Arr = res.data
      }
    },

    async getC2() {
      const res: CategoryResponseData = await reqC2(this.c1Id)
      if (res.code === 200) {
        this.c2Arr = res.data
      }
    },

    async getC3() {
      const res: CategoryResponseData = await reqC3(this.c2Id)
      if (res.code === 200) {
        this.c3Arr = res.data
      }
    },
  },
})
