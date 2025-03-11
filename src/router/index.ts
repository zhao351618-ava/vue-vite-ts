/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-19 17:41:54
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-19 17:48:44
 */
// import { createRouter, createWebHashHistory } from 'vue-router'
// import { constantRoute } from './routes'

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes: constantRoute,
//   // 滚动行为
//   scrollBehavior() {
//     return {
//       left: 0,
//       top: 0,
//     }
//   },
// })

// export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
import SkuPage from '@/views/product/sku/index.vue'

const routes = [
  {
    path: '/product/sku',
    component: SkuPage,
  },
  // 其他路由
]


const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
