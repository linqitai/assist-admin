<style scoped lang="scss">
  .table {
		width: 100%;
		font-size: 14px;
    .transferBox{

    }

	}
</style>

<template>
  <div class="table">
    <!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
    <div class="container">
      <!-- <el-select
			  class="width200"
			  size="medium"
			  v-model="form.courtId"
			  @change="courtChange"
			  placeholder="请选择"
			>
			  <el-option
			    v-for="item in courtOptions4search"
			    :key="item.value"
			    :label="item.label"
			    :value="item.value"
			  ></el-option>
			</el-select> -->
      <search-condition @clickSearchData="searchEvent">
        <div class="element">
          <p class="inline">等级</p>
          <div class="inline">
            <el-select v-model="searchForm.level" @change="levelChange" placeholder="等级" class="handle-select mr10 width160">
              <el-option v-for="item in levelOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <!-- <div class="element">
					<p class="inline">来自</p>
					<div class="inline width140">
						<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
							<el-option key="1" label="广东省" value="广东省"></el-option>
						</el-select>
					</div>
				</div> -->
        <div class="element">
          <p class="inline">注册时间段</p>
          <div class="inline">
            <el-date-picker type="datetime" placeholder="选择时间" v-model="searchForm.startTime" default-time="00:00:00" value-format="yyyy/MM/dd HH:mm:ss"></el-date-picker>
          </div>
          <div class="inline">
            <el-date-picker type="datetime" placeholder="选择时间" v-model="searchForm.endTime" default-time="00:00:00" value-format="yyyy/MM/dd HH:mm:ss"></el-date-picker>
          </div>
        </div>
        <div class="element">
          <div class="inline width160 margL10"><el-button type="primary" :loading="levelProfitLoading" icon="el-icon-circle-plus-outline" @click="giveLevelDealProfit">执行分红</el-button></div>
        </div>

        <!-- <div class="element">
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="选择日期" v-model="searchForm.date" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div> -->
      </search-condition>
      <!-- <div class="handle-box">
				<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
			</div> -->
      <el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%" height="680" v-loading="loading">
        <!-- <el-table-column prop="registerTime" label="注册日期" min-width="120"></el-table-column> -->
        <el-table-column prop="nickName" label="昵称" min-width="80" show-overflow-tooltip fixed="left"></el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="70" show-overflow-tooltip fixed="left"></el-table-column>
        <el-table-column prop="mobilePhone" label="手机号" min-width="90"></el-table-column>
        <el-table-column prop="level" label="级别" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.level | getUserLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="teamateNum" label="直推人数" min-width="70"></el-table-column>
        <el-table-column prop="realnameNum" label="实名人数" min-width="70"></el-table-column>
        <el-table-column prop="thisWeekMineral" label="可用矿石" min-width="80" fixed="right"></el-table-column>
        <el-table-column prop="contributionValue" label="贡献值" min-width="70" fixed="right"></el-table-column>
        <el-table-column prop="platformTicket" label="帮扶券" min-width="70" fixed="right"></el-table-column>
        <el-table-column prop="myCalculationPower" label="个人算力" min-width="60" fixed="right"></el-table-column>
        <el-table-column prop="teamCalculationPower" label="团队算力" min-width="60" fixed="right"></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 详情编辑弹出框 -->
    <el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible" fullscreen>
      <el-form ref="form" :model="form" label-width="auto" :inline="true" :disabled="visibleType=='detail'?true:false">
        <el-form-item label="注册时间">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.registerTime" value-format="yyyy-MM-dd hh:mm:ss"
            class="width200" :disabled="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="上级ID">
          <el-input v-model="form.parentId"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobilePhone"></el-input>
        </el-form-item>
        <el-form-item label="支付宝">
          <el-input v-model="form.alipayNum"></el-input>
        </el-form-item>
        <el-form-item label="微信号">
          <el-input v-model="form.wechartNum"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="上周拥有矿石">
          <el-input v-model="form.lastWeekMineral"></el-input>
        </el-form-item>
        <el-form-item label="当前拥有矿石">
          <el-input v-model="form.thisWeekMineral"></el-input>
        </el-form-item>
        <el-form-item label="临时冻结矿石">
          <el-input v-model="form.temporaryFreezeMineral"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="待释放矿石">
          <el-input v-model="form.toBeReleasedMineral"></el-input>
        </el-form-item>
        <el-form-item label="贡献值">
          <el-input v-model="form.contributionValue"></el-input>
        </el-form-item>
        <el-form-item label="临时冻结贡献值">
          <el-input v-model="form.temporaryFreezeContribution"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="团队算力">
          <el-input v-model="form.teamCalculationPower"></el-input>
        </el-form-item>
        <el-form-item label="平台券">
          <el-input v-model="form.platformTicket"></el-input>
        </el-form-item>
        <el-form-item label="临时冻结平台券">
          <el-input v-model="form.temporaryFreezePlatformTicket"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="买入次数">
          <el-input v-model="form.buyTimes"></el-input>
        </el-form-item>
        <el-form-item label="卖出次数">
          <el-input v-model="form.sellTimes"></el-input>
        </el-form-item>
        <el-form-item label="区块地址">
          <el-input v-model="form.blockAddress"></el-input>
        </el-form-item>
        <el-form-item label="被打小报告次数">
          <el-input v-model="form.beComplaintTimes"></el-input>
        </el-form-item>
        <el-form-item label="被冻结账号次数">
          <el-input v-model="form.beFrozenTimes"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="是否激活">
          {{form.actived | isOrNo}}
        </el-form-item>
        <el-form-item label="账号状态">
          {{form.accountStatus | accountStatus}}
        </el-form-item>
        <el-form-item label="可否解冻">
          {{form.canUnfreeze | canUnFreeze}}
        </el-form-item>
        <el-form-item label="驳回原因">
          <el-input v-model="form.remark" class="width400"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="审核者昵称">
          {{checkerInfo.nickName}}
        </el-form-item>
        <el-form-item label="审核者姓名">
          {{checkerInfo.realName}}
        </el-form-item>
        <el-form-item label="审核者手机号">
          {{checkerInfo.mobilePhone}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer center">
        <el-button type="primary" icon="el-icon-edit" @click="freezeBtn(form.userId)">冻结</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="unFreezeBtn(form)">解冻</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="canUnFreezeBtn(form)">可解冻</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="isShowFreezeModel" width="440px" center>
      <div class="transferBox">
        <el-form ref="form4Freeze" :model="form4Freeze" :rules="rules4Freeze" label-width="140px" label-position="left">
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="form4Freeze.userId" clearable></el-input>
          </el-form-item>
          <el-form-item label="冻结原因" prop="reason">
            <el-input v-model="form4Freeze.reason" clearable show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="解封所需帮扶券" prop="needTicket">
            <el-input min="10" max="100" v-model="form4Freeze.needTicket" clearable></el-input>
          </el-form-item>
          <el-form-item label="可否立马解冻" prop="canUnfreeze">
            <el-radio-group v-model="form4Freeze.canUnfreeze">
              <el-radio :label="1">可</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限密码" prop="safePassword">
            <el-input v-model="form4Freeze.safePassword" clearable type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit4Freeze('form4Freeze')">冻结对方账号</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="isShowFreezeModel = false">取 消</el-button>
        <el-button type="primary" @click="submit4Freeze('form4Freeze')">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog title="提示" :visible.sync="isShowUnfrezeeModel" width="300px" center>
      <div class="del-dialog-cnt">是否确定帮[{{unFreezeNickName}}]用户解冻？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowUnfrezeeModel = false">取 消</el-button>
        <el-button type="primary" @click="sureUnFreeze">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import searchCondition from "@/components/common/searchCondition.vue";
  export default {
    data() {
      return {
        form4Freeze: {
          userId: "",
          reason: "经系统检测存在刷号",
          needTicket: "",
          canUnfreeze: 1,
          safePassword: ""
        },
        rules4Freeze: {
          userId: [{
            required: true,
            message: '请输入对方用户ID',
            trigger: 'blur'
          }, ],
          reason: [{
            required: true,
            message: '请填写冻结原因',
            trigger: 'blur'
          }, ],
          needTicket: [{
            required: true,
            message: '请填写解冻所需帮扶券',
            trigger: 'blur'
          }, ],
          canUnfreeze: [{
            required: true,
            message: '请选择可否解冻',
            trigger: 'blur'
          }, ],
          safePassword: [{
            required: true,
            message: '请输权限密码',
            trigger: 'blur'
          }, ]
        },
        url: '',
        tableData: [],
        total: 400,
        pageSizes: '',
        pageSize: '',
        currentPage: 1,
        multipleSelection: [],
        searchForm: {
          level: 3,
          startTime: '',
          endTime: ''
        },
        levelOptions: [],
        conditionOptions: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        visibleType: 'detail',
        detailOrEditVisible: false,
        isShowFreezeModel: false,
        isShowUnfrezeeModel: false,
        form: {},
        adressWidth: '200px',
        idx: -1,
        checkedMineralDesc: false,
        unFreezeUserId:"",
        unFreezeNickName:"",
        checkerInfo:{},
        loading:false,
        startTime:'',
        endTime:'',
        levelProfitLoading:false
      }
    },
    components: {
      searchCondition
    },
    created() {
      ////console.log("created")
      this.initData();
      //this.getData();
    },
    computed: {},
    methods: {
      initData() {
        this.pageSizes = [20, 30, 40, 50, 100];
        this.pageSize = 20;
        this.currentPage = 1;
        this.levelOptions = this.$config.levelOptions;
        this.conditionOptions = this.$config.conditionOptions;
      },
      canUnFreezeBtn(row){
        let _this = this;
        let params = {
          userId: row.userId
        }
        _this.$ajax.ajax(_this.$api.updateLetCanUnFreeze, 'POST', params, function(res) {
          _this.isShowUnfrezeeModel = false;
        	if (res.code == _this.$api.ERR_OK) { // 200  60 * 60 * 12
        		_this.$message.success("操作成功");
            _this.detailOrEditVisible = false;
            _this.getData();
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      freezeBtn(userId) {
        let _this = this;
        _this.isShowFreezeModel = true;
        _this.form4Freeze.userId = userId;
      },
      unFreezeBtn(row){
        let _this = this;
        _this.isShowUnfrezeeModel = true;
        _this.unFreezeUserId = row.userId;
        _this.unFreezeNickName = row.nickName;
      },
      sureUnFreeze(){
        let _this = this;
        _this.unFreezeEvent();
      },
      unFreezeEvent(){
        let _this = this;
        let params = {
          unFreezeUserId: _this.unFreezeUserId
        }
        _this.$ajax.ajax(_this.$api.unFreeze, 'POST', params, function(res) {
          _this.isShowUnfrezeeModel = false;
        	if (res.code == _this.$api.ERR_OK) { // 200  60 * 60 * 12
        		_this.$message.success("解冻成功");
            _this.detailOrEditVisible = false;
            _this.getData();
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      submit4Freeze(formName) {
        let _this = this;
        if (!_this.$reg.userId.test(_this.form4Freeze.userId)) {
          _this.$message.error("用户ID有误");
          return;
        }
        if ((_this.form4Freeze.reason.length < 3 || _this.form4Freeze.reason.length > 50)) {
          _this.$message.error("请填写3~50个字的冻结原因");
          return;
        }
        if ((_this.form4Freeze.needTicket < 0 || _this.form4Freeze.needTicket > 1000)) {
          _this.$message.error("请填写0~1000的解封所需帮扶券");
          return;
        }
        if (!(_this.form4Freeze.canUnfreeze == 1 || _this.form4Freeze.canUnfreeze == 0)) {
          _this.$message.error("请选择可否立马解冻");
          return;
        }
        if (!_this.$reg.safePassword.test(_this.form4Freeze.safePassword)) {
          _this.$message.error("权限密码有误");
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = _this.$api.insertAssistUserFreeze;
            var params = _this.form4Freeze;
            _this.$ajax.ajax(url, 'POST', params, function(res) {
              // //console.log('res',res)
              if (res.code == _this.$api.ERR_OK) { // 200
                _this.$message.success("操作成功");
                _this.$utils.formClear(_this.form4Freeze);
                _this.isShowFreezeModel = false;
                _this.detailOrEditVisible = false;
                _this.getData();
              } else {
                _this.$message.error(res.message);
              }
            })
          } else {
            return false;
          }
        });
      },
      checkedMineralDescChange() {
      },
      levelChange(val) {
        let _this = this;
        _this.searchForm.level = val;
        _this.currentPage = 1;
        this.getData();
      },
      conditionChange(val) {
        let _this = this;
        _this.searchForm.condition = val;
      },
      searchEvent() {
        this.currentPage = 1;
        //console.log(this.searchForm.startTime,"startTime");
        //console.log(this.searchForm.endTime,"endTime");
        this.getData();
        // this.getList();
      },
      // 分页导航
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      giveLevelDealProfit(){
        let _this = this;
        //过滤出userId
        let userIdList = [];
        _this.tableData.forEach(item=>{
          userIdList.push(item.userId);
        })
        var params = {
          userIdList: userIdList.join(','),
          level:_this.searchForm.level
        }
        _this.levelProfitLoading = true;
        _this.$ajax.ajax(_this.$api.giveLevelDealProfit, 'POST', params, function(res) {
          _this.levelProfitLoading = false;
          if (res.code == _this.$api.ERR_OK) { // 200
            _this.$message.success('执行成功');
          }
        })
      },
      getData() {
        let _this = this;
        // var params = {
        //   pageNo: _this.currentPage,
        //   pageSize: _this.pageSize,
        //   level:_this.searchForm.level,
        //   startTime:_this.searchForm.startTime,
        //   endTime:_this.searchForm.endTime
        // }
        // params.level = _this.searchForm.level;
        // _this.loading = true;
        // _this.$ajax.ajax(_this.$api.getAssistUserInfoPageList4Prifit, 'GET', params, function(res) {
        //   // //console.log('res',res)
        //   if (res.code == _this.$api.ERR_OK) { // 200
        //     _this.tableData = res.data.list;
        //     _this.total = res.data.total;
        //   }
        //   _this.loading = false;
        // })
        var params = {
          pageNo: _this.currentPage,
          pageSize: _this.pageSize,
          level:_this.searchForm.level
        }
        params.level = _this.searchForm.level;
        _this.loading = true;
        _this.$ajax.ajax(_this.$api.getAssistUserInfoPageList4Level, 'GET', params, function(res) {
          // //console.log('res',res)
          if (res.code == _this.$api.ERR_OK) { // 200
            _this.tableData = res.data.list;
            _this.total = res.data.total;
          }
          _this.loading = false;
        })
      },
      search() {
        this.is_search = true;
      },
      formatter(row, column) {
        return row.region;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      handleDetail(index, row) {
        let _this = this;
        _this.visibleType = 'detail';
        _this.form = row;
        _this.detailOrEditVisible = true;
        _this.getChecker(row.checkerId);
      },
      getChecker(checkerId){
        let _this = this;
        /* var params = {
          pageNo: _this.currentPage,
          pageSize: _this.pageSize,
        } */
        _this.$ajax.ajax(_this.$api.getAssistUserInfo + checkerId, 'GET', null, function(res) {
          // //console.log('res',res)
          if (res.code == _this.$api.ERR_OK) { // 200
            _this.checkerInfo = res.data;
          }
        })
      },
      handleEdit(index, row) {
        this.visibleType = 'edit';
        this.idx = index;
        const item = this.tableData[index];
        this.form = {
          name: item.name,
          date: item.date,
          address: item.address
        }
        this.detailOrEditVisible = true;
      },
      handleDelete(ID) {
        this.isShowFreezeModel = true;
      },
      delAll() {
        const length = this.multipleSelection.length;
        let str = '';
        this.del_list = this.del_list.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].name + ' ';
        }
        this.$message.error('删除了' + str);
        this.multipleSelection = [];
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 保存编辑
      saveEdit() {
        // this.$set(this.tableData, this.idx, this.form);
        this.detailOrEditVisible = false;
        this.$message.success(`修改 ${this.form.name} 信息成功`);
      },
      // 确定删除
      deleteRow() {
        this.tableData.splice(this.idx, 1);
        this.$message.success('删除成功');
        this.isShowFreezeModel = false;
        this.detailOrEditVisible = false;
      }
    }
  }
</script>
