<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                <i :class="subItem.icon"></i>{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus';
  export default {
    data() {
      return {
        collapse: false,
        items: [{
            icon: 'el-icon-pie-chart',
            // icon:'iconfont iconfont-question',
            index: 'home',
            title: '首页'
          },
          {
            icon: 'el-icon-data-analysis',
            // icon:'iconfont iconfont-question',
            index: 'ranking',
            title: '查看排名'
          },
          {
            icon: 'el-icon-s-platform',
            // icon:'iconfont iconfont-question',
            index: 'machineManage',
            title: '矿机管理'
          },
          {
            icon: 'el-icon-user',
            index: 'userManage',
            title: '用户管理',
            subs:[
              {
                icon: 'el-icon-user',
                // icon:'iconfont iconfont-question',
                index: 'userManage',
                title: '用户管理',
              },
              {
                icon: 'el-icon-user',
                // icon:'iconfont iconfont-question',
                index: 'freezeManage',
                title: '冻结管理',
              },
              {
                icon: 'el-icon-user',
                // icon:'iconfont iconfont-question',
                index: 'checkManage',
                title: '审核管理'
              },
              {
                icon: 'el-icon-guide',
                // icon:'iconfont iconfont-question',
                index: 'agencyManage',
                title: '省市代理'
              },
              {
                icon: 'el-icon-s-custom',
                // icon:'iconfont iconfont-question',
                index: 'serviceDealManage',
                title: '服务商管理'
              },
              {
                icon: 'el-icon-headset',
                // icon:'iconfont iconfont-question',
                index: 'serviceManage',
                title: '客服管理'
              },
              {
                icon: 'el-icon-s-custom',
                // icon:'iconfont iconfont-question',
                index: 'merchantManage',
                title: '商家管理'
              },
            ]
          },
          {
            icon: 'el-icon-coin',
            // icon:'iconfont iconfont-question',
            index: 'orderManage',
            title: '订单管理',
            subs:[
              {
                icon: 'el-icon-coin',
                // icon:'iconfont iconfont-question',
                index: 'dealOrderManage',
                title: '交易订单管理',
              },
              {
                icon: 'el-icon-shopping-cart-full',
                // icon:'iconfont iconfont-question',
                index: 'shopOrderManage',
                title: '商品订单管理'
              },
            ]
          },
          {
            icon: 'el-icon-coin',
            // icon:'iconfont iconfont-question',
            index: 'bookManage',
            title: '账本管理',
            subs:[
              {
                icon: 'el-icon-medal',
                // icon:'iconfont iconfont-question',
                index: 'mineralManage',
                title: '矿石总账本'
              },
              {
                icon: 'el-icon-coin',
                // icon:'iconfont iconfont-question',
                index: 'platformManage',
                title: '帮扶券管理'
              },
              {
                icon: 'el-icon-s-flag',
                // icon:'iconfont iconfont-question',
                index: 'contributionManage',
                title: '贡献值总账本'
              },
            ]
          },
          {
            icon: 'el-icon-document',
            // icon:'iconfont iconfont-question',
            index: 'messageBoard',
            title: '留言板管理'
          },
          {
            icon: 'el-icon-money',
            // icon:'iconfont iconfont-question',
            index: 'voteManage',
            title: '投票管理'
          },
          {
            icon: 'el-icon-bell',
            // icon:'iconfont iconfont-question',
            index: 'noticeManage',
            title: '公告管理'
          },
          /* {
            icon: 'el-icon-reading',
            // icon:'iconfont iconfont-question',
            index: 'noobGuide',
            title: '新手指南'
          }, */
          {
            icon: 'iconfont iconfont-role',
            // icon:'iconfont iconfont-question',
            index: 'roleManage',
            title: '角色管理'
          },
          {
            icon: 'el-icon-menu',
            // icon:'iconfont iconfont-question',
            index: 'menuManage',
            title: '菜单管理'
          },
          {
            icon: 'el-icon-s-grid',
            // icon:'iconfont iconfont-question',
            index: 'crowdManage',
            title: '众筹管理'
          },
          /* {
            icon: 'el-icon-lx-home',
            // icon:'iconfont iconfont-question',
            index: 'dashboard111',
            title: '=============='
          },
          {
            icon: 'el-icon-lx-home',
            // icon:'iconfont iconfont-question',
            index: 'dashboard',
            title: '系统首页'
          },
          {
            icon: 'el-icon-lx-cascades',
            index: 'table',
            title: '基础表格'
          },
          {
            icon: 'el-icon-lx-copy',
            index: 'tabs',
            title: 'tab选项卡'
          },
          {
            icon: 'el-icon-lx-calendar',
            index: '3',
            title: '表单相关',
            subs: [{
                index: 'form',
                title: '基本表单'
              },
              {
                index: '3-2',
                title: '三级菜单',
                subs: [{
                    index: 'editor',
                    title: '富文本编辑器'
                  },
                  {
                    index: 'markdown',
                    title: 'markdown编辑器'
                  },
                ]
              },
              {
                index: 'upload',
                title: '文件上传'
              }
            ]
          },
          {
            icon: 'el-icon-lx-emoji',
            index: 'icon',
            title: '自定义图标'
          },
          {
            icon: 'el-icon-lx-favor',
            index: 'charts',
            title: 'schart图表'
          },
          {
            icon: 'el-icon-rank',
            index: '6',
            title: '拖拽组件',
            subs: [{
                index: 'drag',
                title: '拖拽列表',
              },
              {
                index: 'dialog',
                title: '拖拽弹框',
              }
            ]
          },
          {
            icon: 'el-icon-lx-warn',
            index: '7',
            title: '错误处理',
            subs: [{
                index: 'permission',
                title: '权限测试'
              },
              {
                index: '404',
                title: '404页面'
              }
            ]
          } */
        ]
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar>ul {
    height: 100%;
  }
</style>
