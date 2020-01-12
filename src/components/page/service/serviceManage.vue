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
					<div class="inline">
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">添 加</el-button>
					</div>
				</div>
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="ID" min-width="80"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="120"></el-table-column>
				<el-table-column prop="userName" label="姓名" min-width="120"></el-table-column>
				<el-table-column prop="userType" label="角色" min-width="120">
					<template slot-scope="scope">
						{{scope.row.userType | getUserType}}
					</template>
				</el-table-column>
				<el-table-column prop="telephone" label="手机号" min-width="120"></el-table-column>
				</el-table-column>
				<el-table-column label="操作" width="140" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>

		<!-- 详情编辑弹出框 -->
		<el-dialog :title="visibleType=='add'?'添加':'编辑'" :visible.sync="addlOrEditVisible" width="340px">
			<el-form ref="form" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="姓名" prop="name" required>
					<el-input v-model="form.name" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="userType" required>
					<el-select v-model="form.userType" @change="userTypeChange" class="handle-select mr10 width200">
						<el-option v-for="item in userTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" prop="phone" required>
					<el-input v-model="form.phone" class="width200" maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="微信号" prop="weixin" required>
					<el-input v-model="form.weixin" class="width200"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteRow">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				url: '',
				tableData: [],
				currentItemsCount:'',
				total: 400,
				pageIndex: 1,
				pageSizes: '',
				pageSize: '',
				multipleSelection: [],
				searchForm: {
					order: "",
					condition: '',
					searchContent: '',
				},
				userTypeOptions: [{
						id: "0",
						value: "管理员"
					},
					{
						id: "1",
						value: "客服"
					},
				],
				visibleType: 'add',
				addlOrEditVisible: false,
				delVisible: false,
				form: {
					name: '',
					userType: '',
					phone: '',
					weixin: ''
				},
				rules: {
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 16,
							message: '长度在 2 到 16 个字符',
							trigger: 'blur'
						}
					],
					userType: [{
							required: true,
							message: '请选择角色',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 16,
							message: '长度在 2 到 16 个字符',
							trigger: 'blur'
						}
					],
					phone: [{
							required: true,
							message: '请填写手机号',
							trigger: 'blur'
						},
						{
							min: 11,
							max: 11,
							message: '长度在 11 个字符',
							trigger: 'blur'
						}
					],
					weixin: [{
							required: true,
							message: '请填写微信号',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 1~20 个字符',
							trigger: 'blur'
						}
					],
				},
				idx: -1,
				deleteId:'',
				checkedMineralDesc: false,
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
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			userTypeChange(val) {
				console.log('val', val)
			},
			conditionChange(val) {
				console.log('val', val)
			},
			searchEvent() {
				this.pageIndex = 1;
				console.log('searchForm', this.searchForm)

				// this.getList();
			},
			// 分页导航
			handleCurrentChange(val) {
				this.pageIndex = val;
				this.getData();
			},
			handleSizeChange(val) {
				console.log('size', val)
			},
			insert() {
				let _this = this;
				var params = {
					userName: _this.form.name,
					password: '666666',
					telephone: _this.form.phone,
					weiChart: _this.form.weixin,
					userType: _this.form.userType
				}
				let url = "";
				if(_this.visibleType=='add'){
					url = _this.$api.insertAdminUser;
					// _this.pageIndex=1;
				}else{
					url = _this.$api.editAdminUser;
					params.id = _this.form.id,
					delete params.password
				}
				_this.$ajax.ajax(url, 'POST', params, function(res) {
					console.log('res', res);
					if(res.code == _this.$api.ERR_OK){
						_this.addlOrEditVisible = false;
						_this.$message.success(`${_this.visibleType=='add'?'添加':'修改'} ${_this.form.name} 信息成功`);
						_this.getData();
					}
				})
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					pageNo: this.pageIndex,
					pageSize: this.pageSize,
				}
				_this.$ajax.ajax(_this.$api.getAdminUserPageList, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						let list = res.data.list;
						console.log('list', list);
						_this.currentItemsCount = list.length;
						_this.tableData = list;
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
			addBtn() {
				this.visibleType = 'add';
				this.addlOrEditVisible = true;
				this.form = {
					name: '',
					userType: '',
					phone: '',
					weixin: ''
				}
			},
			handleEdit(index, row) {
				this.visibleType = 'edit';
				// this.idx = index;
				// const item = this.tableData[index];
				this.form = {
					id:row.id,
					name: row.userName,
					userType: row.userType,
					phone: row.telephone,
					weixin: row.weiChart
				}
				this.addlOrEditVisible = true;
			},
			handleDelete(index,row) {
				console.log('index', index);
				this.delVisible = true;
				this.deleteId = row.id;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 保存编辑
			saveBtn() {
				// this.$set(this.tableData, this.idx, this.form);
				this.insert();
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				_this.$ajax.ajax(_this.$api.deletedAdminUserByUserId + _this.deleteId, 'POST', null, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						// let list = res.data.list;
						// console.log('list', list);
						// _this.tableData = list;
						// _this.total = res.data.total;
						_this.$message.success('删除成功');
						_this.delVisible = false;
						if(_this.currentItemsCount==1&&_this.pageIndex>1){
							_this.pageIndex=_this.pageIndex-1;
						}
						_this.getData();
					}
				})
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}
</style>
