import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/components/Index'
import curPredict from '@/components/CurPredict'
import History from '@/components/History'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/curPredict',
      name: 'curPredict',
      component: curPredict
    },{
      path: '/history/:lotterytype/:lotteryname',
      name: 'history',
      component: History,
      props: (route) => {
        console.log(route)
      }
    }
  ]
})
