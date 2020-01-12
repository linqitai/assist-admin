import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
				{
				    path: '/blankPage',
				    component: resolve => require(['../components/page/other/blankPage.vue'], resolve),
				    meta: { title: '---' }
				},
				{
				    path: '/home',
				    component: resolve => require(['../components/page/home/home.vue'], resolve),
				    meta: { title: '首页' }
				},
				{
				    path: '/ranking',
				    component: resolve => require(['../components/page/ranking/ranking.vue'], resolve),
				    meta: { title: '排行榜' }
				},
				{
				    path: '/userManage',
				    component: resolve => require(['../components/page/user/userManage.vue'], resolve),
				    meta: { title: '用户管理' }
				},
				{
				    path: '/checkManage',
				    component: resolve => require(['../components/page/user/checkManage.vue'], resolve),
				    meta: { title: '审核管理' }
				},
				{
				    path: '/machineManage',
				    component: resolve => require(['../components/page/machine/machineManage.vue'], resolve),
				    meta: { title: '矿机管理' }
				},
				{
				    path: '/dealOrderManage',
				    component: resolve => require(['../components/page/deal/dealOrderManage.vue'], resolve),
				    meta: { title: '交易订单管理' }
				},
				{
				    path: '/platformManage',
				    component: resolve => require(['../components/page/transfer/platformManage.vue'], resolve),
				    meta: { title: '帮扶券管理' }
				},
				{
				    path: '/merchantManage',
				    component: resolve => require(['../components/page/merchant/merchantManage.vue'], resolve),
				    meta: { title: '商家管理' }
				},
				{
				    path: '/contributionManage',
				    component: resolve => require(['../components/page/contribution/contributionManage.vue'], resolve),
				    meta: { title: '贡献值总账本' }
				},
				{
				    path: '/mineralManage',
				    component: resolve => require(['../components/page/mineral/mineralManage.vue'], resolve),
				    meta: { title: '矿石总账本' }
				},
				{
				    path: '/circulationRecords',
				    component: resolve => require(['../components/page/mineral/circulationRecords.vue'], resolve),
				    meta: { title: '矿石流通记录' }
				},
				{
				    path: '/shopOrderManage',
				    component: resolve => require(['../components/page/shop/shopOrderManage.vue'], resolve),
				    meta: { title: '商品订单管理' }
				},
				{
				    path: '/messageBoard',
				    component: resolve => require(['../components/page/message/messageBoard.vue'], resolve),
				    meta: { title: '留言板管理' }
				},
				{
				    path: '/noticeManage',
				    component: resolve => require(['../components/page/notice/noticeManage.vue'], resolve),
				    meta: { title: '公告管理' }
				},
				{
				    path: '/voteManage',
				    component: resolve => require(['../components/page/vote/voteManage.vue'], resolve),
				    meta: { title: '投票管理' }
				},
				{
				    path: '/noobGuide',
				    component: resolve => require(['../components/page/noob/noobGuide.vue'], resolve),
				    meta: { title: '新手指南' }
				},
				{
				    path: '/agencyManage',
				    component: resolve => require(['../components/page/agency/agencyManage.vue'], resolve),
				    meta: { title: '省市代理' }
				},
				{
				    path: '/serviceManage',
				    component: resolve => require(['../components/page/service/serviceManage.vue'], resolve),
				    meta: { title: '客服管理' }
				},
				{
				    path: '/roleManage',
				    component: resolve => require(['../components/page/role/roleManage.vue'], resolve),
				    meta: { title: '角色管理' }
				},
				{
				    path: '/roleDetail',
				    component: resolve => require(['../components/page/role/detail.vue'], resolve),
				    meta: { title: '角色详情' }
				},
				{
				    path: '/menuManage',
				    component: resolve => require(['../components/page/menu/menuManage.vue'], resolve),
				    meta: { title: '菜单管理' }
				},
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
		{
		    path: '/operateNotice',
		    component: resolve => require(['../components/page/notice/vueEditor.vue'], resolve)
		},
		{
		    path: '/operateGuide',
		    component: resolve => require(['../components/page/noob/vueEditor.vue'], resolve)
		},
		{
		    path: '/operateVote',
		    component: resolve => require(['../components/page/vote/vueEditor.vue'], resolve)
		},
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
