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
				<div class="element">
					<div class="inline">
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn()">添加矿机</el-button>
					</div>
				</div>
				<div class="element">
					<p class="inline">版本号</p>
					<div class="inline">
						<el-select v-model="searchForm.versionNo" @change="versionChangeAndSearch" class="handle-select mr10 width120">
							<el-option v-for="item in machineVersionNoOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
				<div class="element">
					<p class="inline">是否开卖</p>
					<div class="inline">
						<el-select v-model="searchForm.sellOrNot" @change="versionChangeAndSearch" class="handle-select mr10 width120">
							<el-option v-for="item in sellOrNotOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
			</search-condition>
			<el-table :data="tableData" row-key="ID" :tree-props="{children: 'children',hasChildren: 'hasChildren'}" border
			 stripe class="table" style="width: 100%">
				<el-table-column prop="id" label="ID" width="80"></el-table-column>
				<!-- <el-table-column prop="date" label="日期"  width="120"></el-table-column> machineVersionType-->
				<el-table-column prop="versionNo" label="矿机版本" min-width="90">
					<template slot-scope="scope">
						{{scope.row.versionNo}}
					</template>
				</el-table-column>
				<el-table-column prop="tag" label="矿机标签" min-width="100">
					<template slot-scope="scope">
						<span :class="getColor(scope.row.tag)">{{scope.row.tag | machineTagType}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="type" label="矿机类型" min-width="100">
					<template slot-scope="scope">
						{{scope.row.type | machineTypeType}}
					</template>
				</el-table-column>
				<el-table-column prop="price" label="售价" min-width="80"></el-table-column>
				<el-table-column prop="totalOutput" label="矿机总产量" min-width="110"></el-table-column>
				<el-table-column prop="calculationPower" label="矿机算力" min-width="110"></el-table-column>
				<el-table-column prop="allRuntime" label="总运行时间/h" min-width="110"></el-table-column>
				<el-table-column prop="limitBuy" label="每人限购" min-width="100"></el-table-column>
				<el-table-column prop="inventory" label="库存" min-width="100"></el-table-column>
				<el-table-column prop="sellOrNot" label="是否开卖" min-width="100" fixed="right">
					<template slot-scope="scope">
						{{scope.row.sellOrNot | isOrNo}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<!-- <el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<i class="placeholderVertical">|</i> -->
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="placeholderLine20"></div>
			<div class="transferBox">
				<!-- <div>赠送矿机</div> -->
				<el-form ref="form4Transfer" :model="form4Transfer" :rules="rules4Transfer" label-width="110px" label-position="left">
				  <el-form-item label="矿机类型" prop="type">
				  	<el-select v-model="form4Transfer.type" class="handle-select mr10 width200">
				  		<el-option v-for="item in typeOptions4Give" :key="item.id" :label="item.value" :value="item.id"></el-option>
				  	</el-select>
				  </el-form-item>
				  <el-form-item label="矿机标签" prop="tag">
				  	<el-select v-model="form4Transfer.tag" class="handle-select mr10 width200">
				  		<el-option v-for="item in tagOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
				  	</el-select>
				  </el-form-item>
				  <el-form-item label="对方手机号" prop="mobilePhone">
				    <el-input v-model="form4Transfer.mobilePhone" clearable :maxlength="maxLen4Phone"></el-input>
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
		<!-- 添加编辑弹出框 -->
		<el-dialog :title="visibleType=='add'?'添加矿机':'编辑矿机'" v-dialogDrag :visible.sync="addlOrEditVisible" width="500px">
			<!--:rules="rules" -->
			<el-form ref="form" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="矿机版本" prop="version">
					<el-select v-model="form.versionNo" class="handle-select mr10 width200">
						<el-option v-for="item in versionOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="矿机标签" prop="tag">
					<el-select v-model="form.tag" class="handle-select mr10 width200">
						<el-option v-for="item in tagOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="矿机类型" prop="type">
					<el-select v-model="form.type" class="handle-select mr10 width200">
						<el-option v-for="item in typeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="售价" prop="price">
					<el-input v-model="form.price" class="width200" maxlength="5" :placeholder="rules.price[0].message"></el-input>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="矿机总产量" prop="totalOutput">
					<el-input v-model="form.totalOutput"  class="width200" maxlength="5" :placeholder="rules.totalOutput[0].message"></el-input>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="矿机算力" prop="calculationPower">
					<el-input v-model="form.calculationPower" class="width200" maxlength="4" :placeholder="rules.calculationPower[0].message"></el-input>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="总运行时间" prop="allRuntime">
					<el-input v-model="form.allRuntime"  class="width200" maxlength="5" :placeholder="rules.allRuntime[0].message"></el-input>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="每人限购" prop="limitBuy">
					<el-input v-model="form.limitBuy" class="width200" maxlength="2" :placeholder="rules.limitBuy[0].message"></el-input>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="库存" prop="inventory">
					<el-input v-model="form.inventory"  class="width200" :placeholder="rules.inventory[0].message"></el-input>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-form-item label="是否开卖" prop="sellOrNot">
					<el-select v-model="form.sellOrNot" class="handle-select mr10 width200">
						<el-option v-for="item in isOrNoOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine16"></div>
				<el-button class="editor-btn" icon="el-icon-check" type="primary" @click="submit('form')">确认</el-button>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
			</span> -->
		</el-dialog>
		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px" v-dialogDrag center>
			<div class="del-dialog-cnt">删除后不可恢复，是否确定删除？</div>
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
        maxLen4Phone:11,
				form4Transfer:{
					mobilePhone:"",
					type:"",
					tag:"",
					safePassword:""
				},
				rules4Transfer:{
					type: [
						{ required: true, message: '请选择矿机类型', trigger: 'blur' },
						{ type: 'number', message: '请选择矿机类型', trigger: 'blur' }
					],
					tag: [
						{ required: true, message: '请选择矿机标签', trigger: 'blur' },
						{ type: 'number', message: '请选择矿机标签', trigger: 'blur' }
					],
					mobilePhone: [
						{ required: true, message: '请输入对方手机号', trigger: 'blur' },
						{ min: 11, max: 11, message: '请填写正确的手机号', trigger: 'blur' }
					],
					safePassword:[
						{ required: true, message: '请输权限密码', trigger: 'blur' },
						{ min: 1, max: 20, message: '请填写正确的权限密码', trigger: 'blur' }
					]
				},
				formLabelPosition:'left',
				detailVisible:false,
				form: {
					version: 1,
					tag:0,
					type: 0,
					price: '',
					totalOutput: '',
					calculationPower:'',
					allRuntime:'',
					limitBuy: '',
					inventory: '',
					sellOrNot: 0
				},
				rules: {
					versionNo: [{
						type: 'number',
						required: true,
						message: '请选择矿机版本号',
					}],
					tag: [{
						type: 'number',
						required: true,
						message: '请选择矿机标签',
					}],
					type: [{
						type: 'number',
						required: true,
						message: '请选择矿机类型',
					}],
					price: [{
						required: true,
						message: '请填写矿机售价',
					}],
					totalOutput: [{
						required: true,
						message: '请填写矿机总产量',
					}],
					calculationPower: [{
						required: true,
						message: '请填写矿机算力',
					}],
					allRuntime: [{
						required: true,
						message: '请填写小时数',
					}],
					limitBuy: [{
						required: true,
						message: '请填写1到3位数字',
					}],
					inventory: [{
						required: true,
						message: '请填写矿机库存',
					}],
					sellOrNot: [{
						type: 'number',
						required: true,
						message: '请选择是否开卖',
					}]
				},
				url: '',
				tableData: [],
				tableData1: [],
				searchForm: {
					versionNo:6,
					sellOrNot:''
				},
				status: "",
				isOrNoOptions:[],
				tagOptions:[],
				typeOptions:[],
				typeOptions4Give:[],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				visibleType: 'add',
				detailOrEditVisible: false,
				addlOrEditVisible: false,
				addlOrEditCityVisible: false,
				delVisible: false,
				adressWidth: '200px',
				checkedMineralDesc: false,
				dialogFormVisible4reply: false,
				versionOptions:[],
				machineVersionNoOptions:[],
				sellOrNotOptions:[],
				id:''
			}
		},
		filters: {
			filterStatus(val) {
				var result = '';
				if (val == 0) {
					result = '未处理';
				} else if (val == 1) {
					result = '已处理';
				}
				return result;
			}
		},
		components: {
			searchCondition
		},
		created() {
			//console.log("created")
			this.initData();
			this.getData();
		},
		computed: {

		},
		methods: {
			getColor(value) {
				if(value == 0){
					return "";
				}else if(value == 1){
					return "green"
				}else if(value == 2){
					return "red"
				}
			},
			submit4Transfer(formName){
				let _this = this;
				if(!_this.$reg.phone.test(_this.form4Transfer.mobilePhone)){
					_this.$message.error("手机号有误");
					return;
				}
				if(!_this.$reg.safePassword.test(_this.form4Transfer.safePassword)){
					_this.$message.error("权限密码有误");
					return;
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let url = _this.$api.giveMyMachine;
						var params = _this.form4Transfer;
						_this.$ajax.ajax(url, 'POST', params, function(res){
							if (res.code == _this.$api.ERR_OK) { // 200
								_this.$message.success("操作成功");
								//_this.$utils.formClear(_this.form4Transfer);
							}else{
								_this.$message.error(res.message);
							}
						})
					} else {
						return false;
					}
				});
			},
			submit(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//console.log('form', _this.form)
						let params = {
							versionNo:_this.form.versionNo,
							tag:_this.form.tag,
							type:_this.form.type,
							price:_this.form.price,
							totalOutput:_this.form.totalOutput,
							calculationPower:_this.form.calculationPower,
							allRuntime:_this.form.allRuntime,
							limitBuy:_this.form.limitBuy,
							inventory:_this.form.inventory,
							sellOrNot:_this.form.sellOrNot
						};
						//console.log('params',params);
						let url = '';
						if(_this.visibleType=='add'){
							url = _this.$api.insertAssistMiningMachine;
						}else if(_this.visibleType=='edit'){
							params.id=_this.form.id;
							url = _this.$api.updateAssistMiningMachine;
						}
						_this.$ajax.ajax(url, 'POST', params, function(res) {
							//console.log('res', res);
							if (res.code == _this.$api.ERR_OK) {
								_this.addlOrEditVisible = false;
								_this.$message.success(`${_this.visibleType=='add'?'添加':'修改'} 成功`);
								_this.getData();
							}
						})
					} else {
						//console.log('error submit!!');
						return false;
					}
				});
				// //console.log(this.form);
				// this.$message.success('提交成功！');
				// this.$router.push('noticeManage')
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					versionNo:_this.searchForm.versionNo,
					sellOrNot:_this.searchForm.sellOrNot
				}
				_this.$ajax.ajax(_this.$api.getAssistMiningMachineList, 'GET', params, function(res) {
					//console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data;
						// _this.menuData = _this.$utils.getMenuTreeList(list)
					}
				})
			},
			getDataByStatus(params) {
				let _this = this;
				_this.$ajax.ajax(_this.$api.getCityAgentListMoreInfo, 'GET', params, function(res) {
					//console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
						_this.total = res.data.size;
						// _this.menuData = _this.$utils.getMenuTreeList(list)
					}
				})
			},
			// 保存编辑
			saveBtn() {
				this.addlOrEditVisible = false;
				this.$message.success(`${this.visibleType=='add'?'添加':'修改'} ${this.form.name} 信息成功`);
			},
			initData() {
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.versionOptions = this.$config.versionOptions;
				this.machineVersionNoOptions = this.$config.machineVersionNoOptions;
				this.isOrNoOptions = this.$config.isOrNoOptions;
				this.tagOptions = this.$config.machineTagOptions;
				this.typeOptions = this.$config.machineTypeOptions;
				this.typeOptions4Give = this.$config.machineTypeOptions4Give;
				this.sellOrNotOptions = this.$config.isOrNoOptions
			},
			searchEvent() {
				this.pageIndex = 1;
				// //console.log('searchForm', this.searchForm);
				// this.getData()
				this.getData();
			},
			versionChangeAndSearch(val) {
				//console.log('val', val)
				this.status = val;
				this.getData();
			},

			// 分页导航
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData();
			},
			handleSizeChange(val) {
				//console.log('size', val)
			},
			search() {
				this.is_search = true;
			},
			handleDetail(index, row) {
				this.visibleType = 'detail';
				this.form = row;
				this.detailVisible = true;
				//console.log('detailVisible',this.detailVisible);
				// this.idx = index;
				// //console.log('index',index)
				// //console.log('row.id',row.ID)
				// this.$store.commit('setMerchantId',row.ID)
				// //console.log('getMerchantId',this.$store.state.merchantId)
				// this.$router.push('/shopOrderManage')
			},
			addBtn() {
				this.visibleType = 'add';
				this.addlOrEditVisible = true;
				/* this.form = {
					version:1,
					tag:0,
					type:0,
					price:'',
					totalOutput:'',
					calculationPower:'',
					allRuntime:'',
					limitBuy:'',
					inventory:'',
					sellOrNot:0
				} */
				//this.getProvinceJson();
			},
			handleEdit(index, row) {
				let _this = this;
				this.visibleType = 'edit';
				this.addlOrEditVisible = true;
				//console.log('row', row)
				this.form = row
			},
			handleDelete(index,row) {
				//console.log('row.id', row.id);
				this.form.id = row.id;
				this.delVisible = true;
			},
			// 保存编辑
			saveEdit() {
				// this.$set(this.tableData, this.idx, this.form);
				this.detailOrEditVisible = false;
				this.$message.success(`修改 ${this.form.name} 信息成功`);
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				_this.$ajax.ajax(_this.$api.deleteAssistMiningMachine + _this.form.id, 'POST', null, function(res) {
					//console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success(`删除成功`);
						_this.delVisible = false;
						_this.getData();
						// _this.tableData = res.data.list;
						// _this.total = res.data.size;
						// _this.menuData = _this.$utils.getMenuTreeList(list)
					}
				})
			}
		}
	}
</script>
