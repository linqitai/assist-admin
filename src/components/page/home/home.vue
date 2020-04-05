<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="iconfont iconfont-role grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{todayRegisterNum}}</div>
                  <div>今日注册量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2" @click="toMessage">
                <i class="iconfont iconfont-role grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{leaveWordUndealNum}}</div>
                  <div>留言消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3" @click="toCheckManage">
                <i class="iconfont iconfont-role grid-con-icon bg_red"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{awaitingCheckNum}}</div>
                  <div>待审核人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="center">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="refresh">刷新</el-button>
        </div>
        <div class="placeholderLine"></div>
        <el-card shadow="hover" style="height:403px;">
          <schart ref="bar" class="schart" canvasId="bar" :data="registerNumList" type="bar" :options="options"></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Schart from 'vue-schart';
  import bus from '../../common/bus';
  export default {
    name: 'dashboard',
    data() {
      return {
        userInfo: {},
        name: localStorage.getItem('ms_username'),
        visitorVolume: [],
        options: {
          title: '最近七天每天的用户注册量',
          showValue: false,
          fillColor: 'rgb(45, 140, 240)',
          bottomPadding: 30,
          topPadding: 30
        },
        options2: {
          title: '最近七天用户访问趋势',
          fillColor: '#FC6FA1',
          axisColor: '#008ACD',
          contentColor: '#EEEEEE',
          bgColor: '#F5F8FD',
          bottomPadding: 30,
          topPadding: 30
        },
        todayRegisterNum:0,
        awaitingCheckNum:0,
        leaveWordUndealNum:0,
        registerNumList:[]
      }
    },
    components: {
      Schart
    },
    computed: {
      role() {
        return this.name === 'admin' ? '超级管理员' : '普通用户';
      }
    },
    created() {
      this.userInfo = JSON.parse(localStorage.getItem('_USERINFO_'));
      //this.getVisitorVolume();
      this.getLeaveWordUndealNum();
      this.getToDayRegisterNum();
      this.get7DaysRegisterNum();
    },
    activated() {
      this.handleListener();
    },
    deactivated() {
      window.removeEventListener('resize', this.renderChart);
      bus.$off('collapse', this.handleBus);
    },
    methods: {
      toMessage() {
        console.log("tomessage")
        this.$router.push('/messageBoard');
      },
      toCheckManage(){
        this.$router.push('/checkManage');
      },
      refresh(){
        this.getLeaveWordUndealNum();
        this.getToDayRegisterNum();
        this.get7DaysRegisterNum();
      },
      get7DaysRegisterNum(){
        let _this = this;
        _this.$ajax.ajax(_this.$api.get7DaysRegisterNum, 'GET', null, function(res) {
        	if (res.code == _this.$api.ERR_OK) { // 200  60 * 60 * 12
            _this.registerNumList = res.data;
            //_this.handleListener();
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      getAwaitingCheckNum(){
        let _this = this;
        _this.$ajax.ajax(_this.$api.getAwaitingCheckNum, 'GET', null, function(res) {
        	if (res.code == _this.$api.ERR_OK) { // 200  60 * 60 * 12
            _this.awaitingCheckNum = res.data;
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      getLeaveWordUndealNum(){
        let _this = this;
        _this.$ajax.ajax(_this.$api.getLeaveWordUndealNum, 'GET', null, function(res) {
        	if (res.code == _this.$api.ERR_OK) { // 200  60 * 60 * 12
            _this.leaveWordUndealNum = res.data;
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      getToDayRegisterNum(){
        let _this = this;
        _this.$ajax.ajax(_this.$api.getToDayRegisterNum, 'GET', null, function(res) {
        	if (res.code == _this.$api.ERR_OK) { // 200  60 * 60 * 12
            _this.todayRegisterNum = res.data;
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      handleListener() {
        bus.$on('collapse', this.handleBus);
        // 调用renderChart方法对图表进行重新渲染
        window.addEventListener('resize', this.renderChart)
      },
      handleBus(msg) {
        setTimeout(() => {
          this.renderChart()
        }, 300);
      },
      renderChart() {
        this.$refs.bar.renderChart();
        // this.$refs.line.renderChart();
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 10px;
    flex: 1;
    font-size: 16px;
    color: #999;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }

  .schart {
    width: 100%;
    height: 300px;
  }
</style>
