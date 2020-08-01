
<style scoped>
	.transferBox{
		width: 400px;
	}
</style>
<template>
	<div class="table">
		<!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
		<div class="container" v-if="tableData">
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="账本ID" min-width="60"></el-table-column>
				<el-table-column prop="userId" label="用户ID" min-width="150"></el-table-column>
				<el-table-column prop="createTime" label="时间" min-width="150"></el-table-column>
				<el-table-column prop="addOrReduce" label="加减" min-width="60"></el-table-column>
				<el-table-column prop="type" label="类型" min-width="60"></el-table-column>
				<el-table-column prop="number" label="数量" min-width="60"></el-table-column>
        <el-table-column prop="currentMineralNum" label="还剩" min-width="60"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
      <!-- <div>
        <el-button type="primary" @click="getData">获取异常信息</el-button>
        <el-button type="primary" :loading="levelProfitLoading" icon="el-icon-circle-plus-outline" @click="reduceThisWeekMineral4YC">执行异常信息</el-button>
      </div> -->

			<div class="transferBox margT10">
        <el-form-item label="回收矿石">
        </el-form-item>
				<el-form ref="form4Transfer" :model="form4Transfer" :rules="rules4Transfer" label-width="110px" label-position="left">
			    <el-form-item label="回收类型" prop="transferType">
			      <el-select v-model="form4Transfer.transferType" @change="transferTypeTypeChange" class="handle-select mr10 width160">
			      	<el-option v-for="item in transferTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
			      </el-select>
			    </el-form-item>
				  <el-form-item label="回收数量" prop="transferAmount">
				    <el-input type="number" v-model.number="form4Transfer.transferAmount" clearable></el-input>
				  </el-form-item>
				  <el-form-item label="对方手机号" prop="mobilePhone">
				    <el-input v-model="form4Transfer.mobilePhone" clearable show-word-limit></el-input>
				  </el-form-item>
				  <el-form-item label="权限密码" prop="safePassword">
				    <el-input v-model="form4Transfer.safePassword" clearable type="password"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="submit4Transfer('form4Transfer')">提交</el-button>
				  </el-form-item>
				</el-form>
			</div>
		</div>

	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				levelProfitLoading:false,
				url: '',
				tableData: [],
        list: [],
				total: 400,
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					parentID:'',
					date:'',
					status: '',
					condition: '',
					searchContent: ''
				},
				status:"",
				statusOptions: [{
						id: "0",
						value: "+"
					},
					{
						id: "1",
						value: "-"
					}
				],
				conditionOptions: [{
						id: "0",
						value: "买家ID"
					},
					{
						id: "1",
						value: "买家手机号"
					},
					{
						id: "2",
						value: "卖家ID"
					},
					{
						id: "3",
						value: "卖家手机号"
					}
				],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				visibleType: 'detail',
				detailOrEditVisible: false,
				delVisible: false,
				form: {
					date: '',
					status:'',
					name: '',
					address: ''
				},
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
        form4Transfer:{
          transferType:8,
        	transferAmount:"",
        	mobilePhone:"",
        	safePassword:""
        },
        transferTypeOptions:[{
          id: 8,
          value: "竞拍服务商"
        },{
          id: 10,
          value: "矿机异常"
        },{
          id: 11,
          value: "账号异常"
        },{id:12,value:'系统回收'},{id:14,value:'30天没登录'}],
        rules4Transfer:{
          transferType: [
        	{ required: true, message: '请选择回收类型', trigger: 'blur' },
        	{ type: 'number', message: '请选择回收类型', trigger: 'blur' }
          ],
        	transferAmount: [
        		{ required: true, message: '请输入回收数量', trigger: 'blur' },
        		{ type: 'number', message: '请输入数字类型', trigger: 'blur' }
        	],
        	mobilePhone: [
        		{ required: true, message: '请输入对方手机号', trigger: 'blur' },
        		{ max: 11, message: '请填写正确的手机号', trigger: 'blur' }
        	],
        	safePassword:[
        		{ required: true, message: '请输权限密码', trigger: 'blur' },
        		{ min: 1, max: 20, message: '请填写正确的权限密码', trigger: 'blur' }
        	]
        },
			}
		},
		components: {
			//searchCondition
		},
		created() {
			console.log("created")
			this.initData();
			this.getData();
		},
		computed: {
		},
		methods: {
			initData(){
				this.pageSizes = [8, 30, 40, 50, 100];
				this.pageSize = this.$config.pageSize;
			},
      transferTypeTypeChange(val){
        let _this = this;
        console.log('val', val);
        _this.form4Transfer.transferType = val;
      },
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			statusChange(val) {
				console.log('val', val)
			},
			conditionChange(val) {
				console.log('val', val)
			},
			searchEvent() {
				this.pageIndex = 1;
			},
      submit4Transfer(formName){
      	let _this = this;
      	if(!_this.$reg.phone2.test(_this.form4Transfer.mobilePhone)){
      		_this.$message.error("手机号有误");
      		return;
      	}
      	if(!_this.$reg.safePassword.test(_this.form4Transfer.safePassword)){
      		_this.$message.error("权限密码有误");
      		return;
      	}
      	this.$refs[formName].validate((valid) => {
      		if (valid) {
      			let url = _this.$api.recycleMineral;
      			var params = _this.form4Transfer;
      			_this.$ajax.ajax(url, 'POST', params, function(res){
      				if (res.code == _this.$api.ERR_OK) { // 200
      					_this.$message.success("转让成功");
      					_this.currentPage = 1;
      					_this.getData();
      				}else{
      					_this.$message.error(res.message);
      				}
      			})
      		} else {
      			return false;
      		}
      	});
      },
			sellerSureBtn(){
				this.$confirm('此操作将帮卖方确认, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '确认成功'
					});
					this.detailOrEditVisible = false;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '我再考虑考虑'
					});
				});
			},
			cancelDealBtn() {
				this.$confirm('此操作将取消此单交易, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '取消成功'
					});
					this.detailOrEditVisible = false;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '我再考虑考虑'
					});
				});
			},
			// 分页导航
			handleCurrentChange(val) {
        console.log("val",val);
			  this.currentPage = val;
			  this.getData();
			},
			handleSizeChange(val) {
			  this.currentPage = 1;
			  this.pageSize = val;
			  this.getData();
			},
			getData() {
				let _this = this;
				var params = {
					pageNo: _this.currentPage,
					pageSize: _this.pageSize,
				}
        console.log('params', params);
				_this.$ajax.ajax(_this.$api.getMineralBookList, 'GET', params, function(res) {
					if (res.code == _this.$api.ERR_OK) {
						let list = res.data.list;
						_this.currentItemsCount = list.length;
						_this.tableData = list;
						_this.total = res.data.total;
					}
				})
			},
      reduceThisWeekMineral4YC(){
        let _this = this;
        //过滤出userId
        let userIdList = [];
        _this.tableData.forEach(item=>{
          userIdList.push(`'${item.userId}'`);
        })
        var params = {
          userIdList: userIdList.join(',')
        }
        console.log('params',params);
        _this.levelProfitLoading = true;
        _this.$ajax.ajax(_this.$api.reduceThisWeekMineral4YC, 'POST', params, function(res) {
          _this.levelProfitLoading = false;
          if (res.code == _this.$api.ERR_OK) {
            _this.$message.success('执行成功');
          }
        },function(){
          _this.levelProfitLoading = false;
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
				console.log("此处要转跳到矿石流通记录表")
				console.log('row.ID',row.ID)
				this.$router.push({path:'circulationRecords',query:{condition:'矿石账本ID',id:row.ID}})
				// this.visibleType = 'detail';
				// this.idx = index;
				// const item = this.tableData[index];
				// this.form = {
				// 	name: item.name,
				// 	date: item.date,
				// 	address: item.address
				// }
				// this.detailOrEditVisible = true;
			},
      getYC(){
        let _this = this;
        var params = {
        	pageNo: _this.pageIndex,
        	pageSize: _this.pageSize,
        }
        _this.$ajax.ajax(_this.$api.getMineralBookInfoList4YC, 'GET', params, function(res) {
        	////console.log('res', res);
        	if (res.code == _this.$api.ERR_OK) { // 200
        		let list = res.data.list;
        		////console.log('list', list);
        		_this.currentItemsCount = list.length;
        		_this.tableData = list;
        		_this.total = res.data.total;
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
