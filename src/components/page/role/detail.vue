<template>
	<div class="table">
		<!-- <div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i>用户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div> -->
		<div class="container">
			<div>
				<!-- 角色:{{ getType(form.roleName) }} -->
				角色: {{ form.roleName | getUserType }}
			</div>
			<div>
				角色code: {{ form.roleCode?form.roleCode:"--" }}
			</div>
			<div>
				角色类型: {{ form.roleType?form.roleType:"--" }}
			</div>
			<div>
				角色描述: {{ form.roleDesc?form.roleDesc:"--" }}
			</div>
			<div class="margT10">
				<el-divider content-position="left">设置权限</el-divider>
				<el-tree :data="menuData" show-checkbox :props="defaultProps" node-key="id" :default-checked-keys="defaultCheckKeys"
				 default-expand-all :expand-on-click-node="false" getCheckedKeys="getCheckedKeys" @node-click="handleNodeClick" @check-change="handleCheckChange">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ data.id }} {{ data.menuName }} {{ data.menuUrl }} {{ data.menuType | levelType }} {{ data.menuLevel | menuType }}</span>
					</span>
				</el-tree>
				<div class="placeholderLine"></div>
				<el-button icon="el-icon-add" type="primary" size="medium" :loading="loading4SaveAuth" @click="saveAuth">保存所选权限</el-button>
				<el-divider content-position="left">当前权限浏览</el-divider>
				<el-table :data="menuListByRoleId" border stripe class="table" style="width: 100%">
					<el-table-column prop="id" label="ID" min-width="50"></el-table-column>
					<el-table-column prop="parentId" label="父级菜单Id" min-width="100"></el-table-column>
					<el-table-column prop="menuName" label="菜单名" min-width="180"></el-table-column>
					<el-table-column prop="menuUrl" label="菜单URL" min-width="280"></el-table-column>
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
							
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				// defaultExpandedKeys:[1,2],
				defaultCheckKeys: [],
				menuData: [],
				defaultProps: {
					children: 'children',
					label: 'menuName'
				},
				url: '',
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm:{
					order:"",
					condition: '',
					searchContent: '',
				},
				roleTypeOptions: [{
						id: "0",
						value: "管理角色"
					},
					{
						id: "1",
						value: "普通角色"
					},
				],
				roleOptions: [{
						id: "0",
						value: "管理员"
					},
					{
						id: "1",
						value: "客服总管"
					},
				],
				visibleType: 'add',
				addlOrEditVisible: false,
				addlAuthVisible: false,
				detailVisible:false,
				delVisible: false,
				form: {
					roleName: '',
					roleDesc: '',
					roleType: '0',
					roleCode: ''
				},
				rules: {
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 16,
							message: '长度在 2 到 16 个字符',
							trigger: 'blur'
						}
					]
				},
				idx: -1,
				checkedMineralDesc: false,
				menuListByRoleId:[],
				deleteType:'',
				roleMenuList:[],
				loading4SaveAuth:false,
				isRenderCheckedTree:false
			}
		},
		components: {
			searchCondition
		},
		created() {
			console.log("created");
			this.initData();
			this.getAllMenuData();
		},
		computed: {
		},
		methods: {
			getAllMenuData() {
				let _this = this;
				var params = {
					pageNo: this.pageIndex,
					pageSize: 200,
				}
				_this.$ajax.ajax(_this.$api.getMenuPageList, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						var listOld = res.data.list;
						var listNew = [];
						console.log('listOld', listOld);
						// const newChild = { id: id++, label: 'testtest', children: [] };
						// if (!data.children) {
						//   this.$set(data, 'children', []);
						// }
						// data.children.push(newChild);
						var menuList = [];
						var newChild = {};
						var menuListIndex=[];
						for(var i = 0 ; i < listOld.length ; i++){
							if(listOld[i].parentId == null){
								// console.log('listOld[i].id',listOld[i].id);
								menuList.push(listOld[i]);
								menuListIndex.push(listOld[i].id);
								// const index = listNew.findIndex(d => d.id === listOld[i].id);
								// listNew = listNew.splice(index,1);
								// listNew = listOld.filter((item) => (item.id!=listOld[i].id));
							}
						}
						//console.log('menuListIndex',menuListIndex);
						listNew = listOld.filter((item) => !menuListIndex.includes(item.id));
						// console.log('listNew',listNew);
						// console.log('menuList',menuList);
						for(let i = 0; i < listNew.length; i++){
							// console.log('listNew[i].parentId',listNew[i].parentId);
							for(let j = 0; j < menuList.length; j++){
								// console.log('menuList[j].id',menuList[j].id);
								if(listNew[i].parentId == menuList[j].id){
									if (!menuList[j].children) {
									  // _this.$set(menuList[j], 'children', []);
									  menuList[j].children = [];
									}
									menuList[j].children.push(listNew[i]);
									//console.log('menuList[j]',menuList[j])
								}
							}
						}
						// console.log('menuListNew',menuList);
						_this.menuData=menuList;
						_this.initailB();
						_this.getMenuListByRoleId();
					}
				})
			},
			initailB(){
				let _this = this;
				_this.isRenderCheckedTree = false;
				_this.roleMenuList = [];
			},
			treeRemove(node, data) {
				// console.log("node:", node);
				// console.log("data:", data);
				// console.log("id:", data.id);
				const parent = node.parent;
				// const children = parent.data.children || parent.data;
				// const index = children.findIndex(d => d.id === data.id);
				// children.splice(index, 1);
			},
			getCheckedKeys(data){
				console.log('getCheckedKeys',data);
			},
			handleNodeClick(data) {
				console.log('handleNodeClick:', data);
			},
			treeCheck(data){
				console.log("check",data);
			},
			handleCheckChange(data, checked, indeterminate) {
				// console.log(data, checked, indeterminate);
				// console.log('data.id',data.id);
				let _this = this;
				console.log('defaultCheckKeys', this.defaultCheckKeys);
				if(_this.isRenderCheckedTree){
					let params = {
						roleId: _this.form.id,
						menuId: data.id
					}
					console.log('data.id',data.id);
					let index = _this.roleMenuList.findIndex(function(d,index){
						console.log('d.menuId',d.menuId,'data.id',data.id);
						if(d.menuId == data.id){
							return index;
						}
					});
					console.log('index',index);
					if(index==-1){
						_this.roleMenuList.push(params);
					}else{
						_this.roleMenuList.splice(index, 1);
						console.log('_this.roleMenuList',_this.roleMenuList);
					}
					console.log('intoisRenderCheckedTreetrue')
				}else{
					let params = {
						roleId: _this.$route.query.roleId,
						menuId: data.id
					}
					console.log('data',data);
					console.log('params',params);
					_this.roleMenuList.push(params);
					console.log('intoisRenderCheckedTreefalse')
				}
				
				// console.log('params', params);
				// let index = _this.roleMenuList.findIndex(d => d.menuId == data.id)
				// console.log('index',index)
				// if(index){
				// 	_this.roleMenuList.splice(index, 1);
				// }else{
				// 	_this.roleMenuList.push(params);
				// }
				// _this.roleMenuList.filter(function (item, index, self) {
				//   return self.indexOf(item) == index;
				 
				// });
				console.log('this.roleMenuList',_this.roleMenuList);
			},
			// getType(val){
			// 	return this.$utils.getUserType(val)
			// },
			saveAuth(){
				let _this = this;
				_this.loading4SaveAuth = true;
				console.log('this.roleMenuList',this.roleMenuList);
				let params = {
					roleMenuList:_this.roleMenuList
				}
				_this.$ajax.ajax4List(_this.$api.insertAdminRoleMenu, 'POST', JSON.stringify(params), function(res) {
					console.log('res', res);
					_this.loading4SaveAuth = false;
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success("保存成功");
						_this.defaultCheckKeys = [];
						_this.initailB();
						_this.detailVisible = false;
						// _this.getMenuListByRoleId();
					}
				})
			},
			getMenuListByRoleId(){
				let _this = this;
				_this.$ajax.ajax(_this.$api.getMenuListByRoleId + _this.$route.query.roleId, 'GET', null, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.menuListByRoleId = res.data;
						console.log('_this.menuListByRoleId',_this.menuListByRoleId);
						// 这里需要进行ID获取成数组
						// let defaultCheckKeys = [];
						// _this.menuListByRoleId.forEach(function(element){
						// 	defaultCheckKeys.push(element.id);
						// });
						// _this.defaultCheckKeys = defaultCheckKeys;
						console.log('_this.defaultCheckKeys',_this.defaultCheckKeys);
						setTimeout(function(){
							_this.isRenderCheckedTree = true;
						},1000);
					}
				})
			},
			handleDetail(index, row){
				let _this = this;
				_this.detailVisible = true;
				_this.defaultCheckKeys = [];
				_this.form = row;
				_this.initailB();
				this.getAllMenuData();
			},
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.defaultCheckKeys = [];
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			roleChange(val){
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
				this.currentPage = val;
				this.getData();
			},
			handleSizeChange(val) {
				console.log('size', val)
			},
			
			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				if (process.env.NODE_ENV === 'development') {
					this.url = '/ms/table/list';
				};
				
				let _this = this;
				var params = {
					pageNo: this.pageIndex,
					pageSize: this.pageSize,
				}
				_this.$ajax.ajax(_this.$api.getAdminRolePageList, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						let list = res.data.list;
						//console.log('list', list);
						_this.tableData = list;
						_this.total = res.data.total;
					}
				})
				
				
				// this.tableData = [{
				// 	id: 1,
				// 	roleName: '管理',
				// 	roleDesc: '王小虎2016-05-02',
				// 	roleType: '0',
				// 	roleCode: 200333
				// }]
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
				this.form={
					roleName: '',
					roleDesc: '',
					roleType: '',
					roleCode: ''
				}
			},
			handleEdit(index, row) {
				this.visibleType = 'edit';
				this.form = {
					id:row.id,
					roleName: row.roleName,
					roleDesc: row.roleDesc,
					roleType: row.roleType,
					roleCode: row.roleCode
				}
				this.addlOrEditVisible = true;
			},
			handleDelete(index, row) {
				this.form = {
					id:row.id
				}
				this.deleteType = 'role';
				this.delVisible = true;
			},
			handleDeleteRoleMenu(){
				this.form = {
					id:row.id
				}
				this.deleteType = 'roleMenu';
				this.delVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			sureEvent() {
				let _this = this;
				var params = {
					roleName: _this.form.roleName,
					roleDesc: _this.form.roleDesc,
					roleType: _this.form.roleType,
					roleCode: _this.form.roleCode
				}
				let url = "";
				if(_this.visibleType=='add'){
					url = _this.$api.insertAdminRole;
					// _this.pageIndex=1;
				}else if(_this.visibleType == 'edit'){
					url = _this.$api.updateAdminRole;
					params.id = _this.form.id
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
			// 保存编辑
			saveBtn() {
				this.sureEvent();
				// this.$set(this.tableData, this.idx, this.form);
				// this.addlOrEditVisible = false;
				// this.$message.success(`${this.visibleType=='add'?'添加':'修改'} ${this.form.name} 信息成功`);
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				if(_this.deleteType=='role'){
					_this.$ajax.ajax(_this.$api.deletedAdminRole + _this.form.id, 'POST', null, function(res) {
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
				}else{
					_this.$ajax.ajax(_this.$api.deletedAdminRole + _this.form.id, 'POST', null, function(res) {
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
