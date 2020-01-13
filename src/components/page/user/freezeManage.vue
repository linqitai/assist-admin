<style scoped lang="scss">
  .table {
		width: 100%;
		font-size: 14px;
    .transferBox{
    	width: 400px;
    }
	}
</style>
<template>
  <div class="table">
    <div>
      <search-condition @clickSearchData="searchEvent">
        <div class="element">
          <p class="inline">用户手机号</p>
          <div class="inline width160">
            <el-input v-model="searchForm.mobilePhone" size="medium" placeholder="请输入用户手机号" clearable></el-input>
          </div>
        </div>
        <div class="element">
          <p class="inline">区块地址</p>
          <div class="inline width200">
            <el-input v-model="searchForm.blockAddress" size="medium" placeholder="请输入对方区块地址" clearable></el-input>
          </div>
        </div>
      </search-condition>
      <el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userId" label="用户ID" min-width="60" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="真实姓名" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobilePhone" label="用户手机号" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reason" label="冻结原因" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="冻结时间" min-width="160"></el-table-column>
        <el-table-column prop="needTicket" label="解冻所需券" min-width="100"></el-table-column>
        <el-table-column prop="canUnfreeze" label="可否立马解冻" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.canUnfreeze | isOrNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="freezer" label="执行人" min-width="120"></el-table-column>
        <el-table-column prop="accountStatus" label="现账户状态" min-width="100" fixed="right">
          <template slot-scope="scope">
            <span :class="scope.row.accountStatus==1?'red':'green'">{{scope.row.accountStatus | accountStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template slot-scope="scope">
            <el-link type="primary" @click="unFreezeBtn(scope.row)">解冻</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div class="transferBox">
        <el-form ref="form4Freeze" :model="form4Freeze" :rules="rules4Freeze" label-width="140px" label-position="left">
          <el-form-item label="对方用户ID" prop="userId">
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
    </div>
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
          reason: "",
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
          mobilePhone: "",
          blockAddress: ""
        },
        orderOptions: [],
        conditionOptions: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        visibleType: 'detail',
        detailOrEditVisible: false,
        isShowUnfrezeeModel: false,
        form: {},
        adressWidth: '200px',
        idx: -1,
        checkedMineralDesc: false,
        unFreezeUserId:"",
        unFreezeNickName:""
      }
    },
    components: {
      searchCondition
    },
    created() {
      console.log("created")

      this.initData();
      this.getData();
    },
    computed: {},
    methods: {
      initData() {
        this.pageSizes = this.$config.pageSizes;
        this.pageSize = this.$config.pageSize;
        this.currentPage = 1;
        this.orderOptions = this.$config.orderOptions;
        this.conditionOptions = this.$config.conditionOptions;
      },
      unFreezeBtn(row) {
        let _this = this;
        console.log("row",row);
        _this.unFreezeUserId = row.userId;
        _this.unFreezeNickName = row.nickName;
        _this.isShowUnfrezeeModel = true;
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
            _this.getData();
        	}else{
        		_this.$message.error(res.message);
        	}
        })
      },
      submit4Freeze(formName) {
        let _this = this;
        console.log('form4Freeze', _this.form4Freeze)
        if (!_this.$reg.userId.test(_this.form4Freeze.userId)) {
          _this.$message.error("用户ID有误");
          return;
        }
        if ((_this.form4Freeze.reason.length < 3 || _this.form4Freeze.reason.length > 50)) {
          _this.$message.error("请填写3~50个字的冻结原因");
          return;
        }
        if ((_this.form4Freeze.needTicket < 10 || _this.form4Freeze.needTicket > 1000)) {
          _this.$message.error("请填写10~1000的解封所需帮扶券");
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
            console.log('valid');
            let url = _this.$api.insertAssistUserFreeze;
            var params = _this.form4Freeze;
            console.log(params, 'params');
            _this.$ajax.ajax(url, 'POST', params, function(res) {
              // console.log('res',res)
              if (res.code == _this.$api.ERR_OK) { // 200
                _this.$message.success("操作成功");
                _this.$utils.formClear(_this.form4Freeze);
              } else {
                _this.$message.error(res.message);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      checkedMineralDescChange() {
        console.log('checkedMineralDesc', this.checkedMineralDesc)
      },
      orderChange(val) {
        console.log('val', val)
      },
      conditionChange(val) {
        console.log('val', val)
      },
      searchEvent() {
        this.currentPage = 1;
        console.log('searchForm', this.searchForm)
        this.getData();
        // this.getList();
      },
      operateBtn() {
        //这里需要根据账号状态来判断是冻结还是解冻
        this.$message("此功能尚未开通")
      },
      // 分页导航
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      handleSizeChange(val) {
        console.log('size', val)
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      // 获取 easy-mock 的模拟数据
      getData() {
        let _this = this;
        // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
        // if (process.env.NODE_ENV === 'development') {
        // 	this.url = '/ms/table/list';
        // };
        this.searchForm.condition = this.$route.query.condition;
        this.searchForm.searchContent = this.$route.query.id;
        console.log('searchForm', this.searchForm);
        var params = {
          pageNo: _this.currentPage,
          pageSize: _this.pageSize,
          mobilePhone: _this.searchForm.mobilePhone,
          blockAddress: _this.searchForm.blockAddress,
        }
        _this.$ajax.ajax(_this.$api.getAssistUserFreezePageList, 'GET', params, function(res) {
          // console.log('res',res)
          if (res.code == _this.$api.ERR_OK) { // 200
            _this.tableData = res.data.list;
            _this.total = res.data.total;
          }
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
        console.log('ID', ID);
        this.delVisible = true;
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
        this.delVisible = false;
        this.detailOrEditVisible = false;
      }
    }
  }
</script>
