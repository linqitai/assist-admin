<style scoped lang="scss">
	.treeBox{
		width: 800px;
	}
	.custom-tree-node {
	    flex: 1;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    font-size: 14px;
	    padding-right: 8px;
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
				<div class="element">
					<div class="inline">
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">添加一级菜单</el-button>
					</div>
				</div>
			</search-condition>
			<div class="treeBox">
				<el-tree ref="Tree" :data="menuData" :props="defaultProps" node-key="id" 
				 default-expand-all>
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ data.id }} {{ data.menuName }} {{ data.menuUrl }} {{ data.menuType | levelType }} {{ data.menuLevel | menuType }}</span>
						<span>
							<el-button type="text" size="mini" @click="treeAppend(data)">
								添加
							</el-button>
							<el-button type="text" size="mini" @click="treeRemove(node, data)">
								删除
							</el-button>
						</span>
					</span>
				</el-tree>
			</div>
			<!-- <el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="ID" min-width="80"></el-table-column>
				<el-table-column prop="parentId" label="父级菜单Id" min-width="100"></el-table-column>
				<el-table-column prop="menuName" label="菜单名" min-width="120"></el-table-column>
				<el-table-column prop="menuUrl" label="菜单URL" min-width="200"></el-table-column>
				<el-table-column prop="menuLevel" label="菜单等级" min-width="120">
					<template slot-scope="scope">
						{{scope.row.menuLevel | levelType}}
					</template>
				</el-table-column>
				<el-table-column prop="menuType" label="菜单类型" min-width="120">
					<template slot-scope="scope">
						{{scope.row.menuType | menuType}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="140" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
					</template>
				</el-table-column>
			</el-table> -->
			<!-- <div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div> -->
		</div>

		<!-- 详情编辑弹出框 -->
		<el-dialog :title="visibleType=='add'?'添加':'编辑'" :visible.sync="addlOrEditVisible" width="500px">
			<el-form ref="form" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="父级菜单ID">
					<el-input v-model="form.parentId" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="菜单名" prop="menuName" required>
					<el-input v-model="form.menuName" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="菜单URL" prop="menuUrl" required>
					<el-input v-model="form.menuUrl" class="width300"></el-input>
				</el-form-item>
				<el-form-item label="菜单等级" prop="menuLevel" required>
					<!-- <el-input v-model="form.menuLevel" class="width200"></el-input> -->
					<el-select v-model="form.menuLevel" class="handle-select mr10 width200">
						<el-option v-for="item in menuLevelOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单类型" prop="menuType" required>
					<!-- <el-input v-model="form.menuType" class="width200"></el-input> -->
					<el-select v-model="form.menuType" class="handle-select mr10 width200">
						<el-option v-for="item in menuTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<span class="dialog-footer center">
					<el-button type="primary" icon="el-icon-finished" @click="submitForm('form')">确 定</el-button>
				</span>
			</el-form>
			
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
				// defaultExpandedKeys:[1,2],
				defaultCheckKeys: [],
				menuData: [{
					id: 1,
					menuName: '1',
					menuUrl: '/menuManage',
					menuLevel:'0',
					menuType:'0',
					children: [{
						id: 11,
						menuName: '11',
						menuUrl: '/menuManage/11'
					}, {
						id: 12,
						menuName: '12',
						menuUrl: '/menuManage/12'
					}]
				}, {
					id: 2,
					menuName: '2',
					menuUrl: '/roleManage',
					menuLevel:'0',
					menuType:'0',
					children: [{
						id: 21,
						menuName: '21',
						menuUrl: '/roleManage/21',
						children: [{
							id: 211,
							menuName: '211',
							menuUrl: '/roleManage/211'
						}, {
							id: 212,
							menuName: '212',
							menuUrl: '/roleManage/212'
						}]
					}, {
						id: 22,
						menuName: '22',
						menuUrl: '/roleManage/22'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'menuName'
				},
				url: '',
				tableData: [],
				currentItemsCount: '',
				total: 400,
				pageIndex: 1,
				pageSizes: '',
				pageSize: '',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					order: "",
					condition: '',
					searchContent: '',
				},
				menuLevelOptions: [{
						id: "0",
						value: "一级"
					},
					{
						id: "1",
						value: "二级"
					},
					{
						id: "2",
						value: "三级"
					}
				],
				menuTypeOptions: [{
						id: "0",
						value: "导航类菜单"
					},
					{
						id: "1",
						value: "接口类菜单"
					},
				],
				visibleType: 'add',
				addlOrEditVisible: false,
				delVisible: false,
				form: {
					parentId: '',
					menuName: '',
					menuUrl: '',
					menuLevel: '',
					menuType: ''
				},
				rules: {
					menuName: [{
							required: true,
							message: '请输入菜单名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '长度在 2 到 10 个字符',
							trigger: 'blur'
						}
					],
					menuUrl: [{
						required: true,
						message: '请填写菜单URL',
						trigger: 'blur'
					}, {
						min: 2,
						max: 50,
						message: '长度在 2 到 50 个字符',
						trigger: 'blur'
					}],
					menuLevel: [{
						required: true,
						message: '请填写菜单等级',
						trigger: 'blur'
					}],
					menuType: [{
						required: true,
						message: '请选择菜单类型',
						trigger: 'blur'
					}]
				},
				idx: -1,
				checkedMineralDesc: false,
				deleteId: '',
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
			addBtn() {
				this.visibleType = 'add';
				this.addlOrEditVisible = true;
				this.form = {
					parentId: '',
					menuName: '',
					menuUrl: '',
					menuLevel: '',
					menuType: ''
				}
			},
			treeAppend(data) {
				console.log("data:", data);
				console.log("id:", data.id);
				this.visibleType = 'add';
				this.addlOrEditVisible = true;
				this.form = {
					parentId: data.id,
					menuName: '',
					menuUrl: '',
					menuLevel: '',
					menuType: ''
				}
				// const newChild = { id: id++, label: 'testtest', children: [] };
				// if (!data.children) {
				//   this.$set(data, 'children', []);
				// }
				// data.children.push(newChild);
			},

			treeRemove(node, data) {
				console.log("node:", node);
				console.log("data:", data);
				console.log("id:", data.id);
				this.deleteId = data.id;
				// const parent = node.parent;
				this.delVisible = true;
				// const children = parent.data.children || parent.data;
				// const index = children.findIndex(d => d.id === data.id);
				// children.splice(index, 1);
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				_this.$ajax.ajax(_this.$api.deletedMenuByMenuId + _this.deleteId, 'POST', null, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						// let list = res.data.list;
						// console.log('list', list);
						// _this.tableData = list;
						// _this.total = res.data.total;
						_this.$message.success('删除成功');
						_this.delVisible = false;
						// if (_this.currentItemsCount == 1 && _this.pageIndex > 1) {
						// 	_this.pageIndex = _this.pageIndex - 1;
						// }
						_this.getData();
					}
				})
			},
			handleNodeClick(data) {
				console.log('data:', data);
			},
			handleCheckChange(data, checked, indeterminate) {
				console.log(data, checked, indeterminate);
			},
			initData() {
				// this.pageSizes = this.$config.pageSizes;
				// this.pageSize = this.$config.pageSize;
				this.pageSize = 200;
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			roleChange(val) {
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
			editBtn() {
				this.visibleType = "edit";
			},
			// 分页导航
			handleCurrentChange(val) {
				this.pageIndex = val;
				this.getData();
			},
			handleSizeChange(val) {
				console.log('size', val)
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					pageNo: this.pageIndex,
					pageSize: this.pageSize,
				}
				_this.$ajax.ajax(_this.$api.getMenuPageList, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						let list = res.data.list;
						
						_this.menuData = _this.$utils.getMenuTreeList(list)
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
				// this.idx = index;
				// const item = this.tableData[index];
				this.form = {
					id: row.id,
					parentId: row.parentId,
					menuName: row.menuName,
					menuUrl: row.menuUrl,
					menuLevel: row.menuLevel,
					menuType: row.menuType
				}
				this.addlOrEditVisible = true;
			},
			handleDelete(index, row) {
				console.log('ID', row.id);
				this.delVisible = true;
				this.deleteId = row.id;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			submitForm(formName) {
				let _this = this;
				_this.$refs[formName].validate((valid) => {
					if (valid) {
						_this.saveBtn();
					} else {
						_this.$message("请根据提示纠正所填写信息");
						return false;
					}
				});
			},
			// 保存编辑
			saveBtn() {
				let _this = this;
				var params = {
					parentId: _this.form.parentId,
					menuName: _this.form.menuName,
					menuUrl: _this.form.menuUrl,
					menuLevel: _this.form.menuLevel,
					menuType: _this.form.menuType,
				}
				let url = "";
				if (_this.visibleType == 'add') {
					url = _this.$api.insertMenu;
					// _this.pageIndex=1;
				} else if (_this.visibleType == 'edit') {
					url = _this.$api.updateMenu;
					params.id = _this.form.id
				}
				_this.$ajax.ajax(url, 'POST', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) {
						_this.addlOrEditVisible = false;
						_this.$message.success(`${_this.visibleType=='add'?'添加':'修改'} ${_this.form.menuName} 信息成功`);
						_this.getData();
					}
				})
			},
		}
	}
</script>
