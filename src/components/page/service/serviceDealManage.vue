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
				<el-table-column prop="id" label="ID" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="realName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
				<el-table-column prop="mobilePhone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="wechartNum" label="微信号" min-width="120"></el-table-column>
        <el-table-column prop="dsPassword" label="动态密码" min-width="120"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
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
				<el-form-item label="手机号" prop="mobilePhone" required>
					<el-input v-model="form.mobilePhone" class="width200" maxlength="11"></el-input>
				</el-form-item>
        <el-form-item label="备注" prop="remark" required>
        	<el-input v-model="form.remark" class="width200"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-switch @change="isShowChange" v-model="form.isShow" active-text="是" inactive-text="否">
          </el-switch>
        </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
			</span>
		</el-dialog>

    <el-dialog title="编辑" :visible.sync="editVisible" width="340px">
    	<el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="备注" prop="remark" required>
        	<el-input v-model="form.remark" class="width200"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-switch @change="isShowChange" v-model="form.isShow" active-text="是" inactive-text="否">
          </el-switch>
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
        editVisible:false,
				delVisible: false,
				form: {
					mobilePhone: '',
          remark: '',
          isShow:false
				},
				rules: {
					mobilePhone: [{
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
          remark: [{
          		required: true,
          		message: '请填写备注',
          		trigger: 'blur'
          	},
          	{
          		min: 0,
          		max: 20,
          		message: '长度在 0~20 个字符',
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
			// console.log("created")
			this.initData();
			this.getData();
		},
		computed: {},
		methods: {
			initData() {
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
			},
      isShowChange(val) {
        // console.log('isShowChange', val);
        this.form.isShow = val;
      },
			checkedMineralDescChange() {
				// console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			userTypeChange(val) {
				// console.log('val', val)
			},
			conditionChange(val) {
				// console.log('val', val)
			},
			searchEvent() {
				this.pageIndex = 1;
				this.getData();
			},
			// 分页导航
			handleCurrentChange(val) {
				this.pageIndex = val;
				this.getData();
			},
			handleSizeChange(val) {
				// console.log('size', val)
			},
			insert() {
				let _this = this;
				var params = {
					mobilePhone: _this.form.mobilePhone,
          remark:_this.form.remark,
          isShow:_this.form.isShow == true ? 1 : 0,
				}
				let url = "";
				if(_this.visibleType=='add'){
					url = _this.$api.insertServiceUser;
					// _this.pageIndex=1;
				}else{
					url = _this.$api.updateServiceUser;
					params.id = _this.form.id;
				}
				_this.$ajax.ajax(url, 'POST', params, function(res) {
					// console.log('res', res);
					if(res.code == _this.$api.ERR_OK){
						_this.addlOrEditVisible = false;
            _this.editVisible = false;
						_this.$message.success(`${_this.visibleType=='add'?'添加':'修改'} 信息成功`);
						_this.getData();
					}else{
            _this.$message.error(res.message);
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
				_this.$ajax.ajax(_this.$api.getServiceUserPageList, 'GET', params, function(res) {
					// console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						let list = res.data.list;
						// console.log('list', list);
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
					phone: '',
          remark: '',
				}
			},
			handleEdit(index, row) {
				this.visibleType = 'edit';
				// this.idx = index;
				// const item = this.tableData[index];
				this.form = {
					id:row.id,
          remark:row.remark
				}
				this.editVisible = true;
			},
			handleDelete(index,row) {
				// console.log('index', index);
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
				_this.$ajax.ajax(_this.$api.deletedServiceUserById + _this.deleteId, 'POST', null, function(res) {
					// console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						// let list = res.data.list;
						// // console.log('list', list);
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
