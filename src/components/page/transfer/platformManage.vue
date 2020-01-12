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
		<!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
		<div class="container">
			<search-condition @clickSearchData="searchEvent">
				<!-- <div class="element">
					<p class="inline">匹配时间</p>
					<div class="inline">
						<el-date-picker class="width160" @change="datePickerChange" type="date" placeholder="选择日期" v-model="searchForm.machingTime" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div> -->
				<div class="element">
					<p class="inline">类型</p>
					<div class="inline">
						<el-select v-model="searchForm.type" @change="typeChange" class="handle-select mr10 width160">
							<el-option v-for="item in platformTicketBookTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
				<!-- <div class="element">
					<p class="inline">条件查询</p>
					<div class="inline">
						<el-select v-model="searchForm.condition" @change="conditionChange" class="handle-select mr10">
							<el-option v-for="item in conditionOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="inline width220">
						<el-input v-model="searchForm.searchContent" size="medium" placeholder="请输入搜索内容" clearable></el-input>
					</div>
				</div>
				<div class="element">
					<div class="inline">
						
					</div>
				</div> -->
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="createTime" label="时间" min-width="160"></el-table-column>
				<!-- <el-table-column prop="fromUserId" label="转出者ID" width="100" show-overflow-tooltip></el-table-column> -->
				<el-table-column prop="nickName" label="昵称" min-width="150"></el-table-column>
				<el-table-column prop="mobilePhone" label="手机号" min-width="150"></el-table-column>
				<!-- <el-table-column prop="buyerId" label="买家ID" min-width="190"></el-table-column> -->
				<el-table-column prop="toUserId" label="去往ID" min-width="100" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="realName" label="转入者昵称" min-width="150"></el-table-column>
				<el-table-column prop="alipayNum" label="转出者手机号" min-width="170"></el-table-column> -->
				<el-table-column prop="platformTicket" label="数量" min-width="150"></el-table-column>
				<el-table-column prop="type" label="类型" min-width="100">
					<template slot-scope="props">
						{{ props.row.type | platformBookType }}
					</template>
				</el-table-column>
				
				<!-- <el-table-column prop="status" label="交易状态" width="140" fixed="right">
					<template slot-scope="props">
						<span class="ellipsis" :class="textColor(props.row.status)">{{ props.row.status | dealStatusType }}</span>
					</template>
				</el-table-column> -->
				<!-- <el-table-column label="操作" min-width="90" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
					</template>
				</el-table-column> -->
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<div class="placeholderLine20"></div>
		<div class="transferBox">
			<el-form ref="form4Transfer" :model="form4Transfer" :rules="rules4Transfer" label-width="110px" label-position="left">
			  <el-form-item label="转让数量" prop="transferAmount">
			    <el-input type="number" v-model.number="form4Transfer.transferAmount" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="对方区块地址" prop="blockAddress">
			    <el-input v-model="form4Transfer.blockAddress" clearable show-word-limit></el-input>
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
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				form4Transfer:{
					transferAmount:"",
					blockAddress:"",
					safePassword:""
				},
				rules4Transfer:{
					transferAmount: [
						{ required: true, message: '请输入转让数量', trigger: 'blur' },
						{ type: 'number', message: '请输入数字类型', trigger: 'blur' }
					],
					blockAddress: [
						{ required: true, message: '请输入对方区块地址', trigger: 'blur' },
						{  min: 20, max: 34, message: '请填写正确的区块地址', trigger: 'blur' }
					],
					safePassword:[
						{ required: true, message: '请输权限密码', trigger: 'blur' },
						{  min: 1, max: 20, message: '请填写正确的权限密码', trigger: 'blur' }
					]
				},
				url: '',
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					type: '',
					condition: '',
					searchContent: ''
				},
				status:"",
				statusOptions: [],
				platformTicketBookTypeOptions:[],
				conditionOptions: [
					{
						id: "",
						value: "无"
					},
					{
						id: "1",
						value: "买家ID"
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
				checkedMineralDesc: false
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
		computed: {
			
		},
		methods: {
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.platformTicketBookTypeOptions= this.$config.platformTicketBookTypeOptions;
			},
			textColor(status){
				if(status==5){
					return 'red';
				}else if(status == 8){
					return 'green';
				}else if(status==3){
					return 'textAdorn';
				}
			},
			submit4Transfer(formName){
				let _this = this;
				console.log('form4Transfer',_this.form4Transfer)
				if(!_this.$reg.block_address.test(_this.form4Transfer.blockAddress)){
					_this.$message.error("区块地址有误");
					return;
				}
				if(!_this.$reg.safePassword.test(_this.form4Transfer.safePassword)){
					_this.$message.error("权限密码有误");
					return;
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let url = _this.$api.transferPlatformTicket;
						var params = _this.form4Transfer;
						console.log(params,'params');
						_this.$ajax.ajax(url, 'POST', params, function(res){
							// console.log('res',res)
							if (res.code == _this.$api.ERR_OK) { // 200
								_this.$message.success("转让成功");
								_this.currentPage = 1;
								_this.getData();
								_this.$utils.formClear(_this.form4Transfer);
							}else{
								_this.$message.success(res.message);
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			typeChange(val) {
				let _this = this;
				console.log('val', val);
				_this.searchForm.type = val;
				console.log('_this.searchForm',_this.searchForm);
				_this.getData();
			},
			datePickerChange(val){
				let _this = this;
				console.log(val);
				_this.searchForm.machingTime = val;
				_this.getData();
			},
			conditionChange(val) {
				let _this = this;
				console.log('val', val);
				_this.searchForm = _this.$utils.formClear(_this.searchForm);
				_this.searchForm.condition = val;
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					pageNo:_this.currentPage,
					pageSize:_this.pageSize,
					type:_this.searchForm.type
				}
				console.log(params,'params');
				_this.$ajax.ajax(_this.$api.getAssistPlateformTicketAccountBookList, 'GET', params, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
						_this.total = res.data.total;
					}
				})
			},
			searchEvent() {
				let _this = this;
				_this.currentPage = 1;
				console.log('searchForm', _this.searchForm)
				if(_this.searchForm.condition=='选择'){
					
				}else if(_this.searchForm.condition == '订单ID'){
					_this.searchForm.id = _this.searchForm.searchContent;
				}else if(_this.searchForm.condition == '买家ID'){
					_this.searchForm.buyerId = _this.searchForm.searchContent;
				}else if(_this.searchForm.condition == '卖家ID'){
					_this.searchForm.sellerId = _this.searchForm.searchContent;
				}else if(_this.searchForm.condition == '卖家手机号'){
					_this.searchForm.mobilePhone = _this.searchForm.searchContent;
				}
				_this.getData();
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
				this.visibleType = 'detail';
				this.form = row;
				this.detailOrEditVisible = true;
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
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		}
	}
</script>
