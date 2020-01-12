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
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addProvinceBtn">添加省代理</el-button>
					</div>
				</div>
				<!-- <div class="element">
					<div class="inline">
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addCityBtn">添加市代理</el-button>
					</div>
				</div> -->
				<div class="element">
					<p class="inline">状态</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChangeAndSearch" class="handle-select mr10 width120">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column type="expand">
				  <template slot-scope="props">
					<el-table :data="props.row.assistCityAgentExtendList" border stripe class="table" style="width: 90%">
						<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
						<el-table-column prop="cityName" label="城市名称" min-width="80"></el-table-column>
						<el-table-column prop="userId" label="用户ID" min-width="80" show-overflow-tooltip></el-table-column>
						<el-table-column prop="realName" label="代理姓名" min-width="100"></el-table-column>
						<el-table-column prop="mobilePhone" label="手机号" min-width="120"></el-table-column>
						<el-table-column prop="platformTicket" label="拥有平台券" min-width="100"></el-table-column>
						<el-table-column prop="isPay" label="是否已缴纳" min-width="100">
							<template slot-scope="scope">
								{{scope.row.isPay | isPayType}}
							</template>
						</el-table-column>
						<el-table-column prop="startTime" label="开拍日期" min-width="150"></el-table-column>
					    <el-table-column prop="endTime" label="截拍日期" min-width="150"></el-table-column>
						<el-table-column label="操作" min-width="150" align="center" fixed="right">
							<template slot-scope="scope">
								<el-link type="primary" @click="handleEdit4CityAgent(scope.$index, scope.row)">编辑</el-link>
								<i class="placeholderVertical">|</i>
								<el-link type="primary" @click="handleDelete4CityAgent(scope.$index, scope.row)">删除</el-link>
							</template>
						</el-table-column>
					</el-table>
				  </template>
				</el-table-column>
				<el-table-column prop="id" label="ID" width="80" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="date" label="日期"  width="120"></el-table-column> -->
				<el-table-column prop="provinceName" label="省市名称" min-width="120"></el-table-column>
				<el-table-column prop="status" label="状态" min-width="80">
					<template slot-scope="scope">
						{{scope.row.status | agencyStatusType}}
					</template>
				</el-table-column>
				<el-table-column prop="userId" label="用户ID" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="realName" label="代理姓名" min-width="120"></el-table-column>
				<el-table-column prop="mobilePhone" label="手机号" min-width="120"></el-table-column>
				<el-table-column prop="platformTicket" label="拥有平台券" min-width="120"></el-table-column>
				<el-table-column prop="isPay" label="是否已缴纳" min-width="100">
					<template slot-scope="scope">
						{{scope.row.isPay | isPayType}}
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="开拍日期" min-width="180"></el-table-column>
				<el-table-column prop="endTime" label="截拍日期" min-width="180"></el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit4ProviceAgent(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleDelete4ProviceAgent(scope.$index, scope.row)">删除</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleAddCityAgent(scope.$index, scope.row)">添加市代理</el-link>
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
		<el-dialog title="详情" v-dialogDrag :visible.sync="detailVisible" width="420px">
			<el-form label-width="auto" :label-position="formLabelPosition">
				<el-form-item label="省市名称">
					<label for="">{{detail4ProvinceAgent.provinceName}}</label>
				</el-form-item>
				<el-form-item label="状态">
					 <!-- | agencyStatusType -->
					<label for="">{{detail4ProvinceAgent.status | agencyStatusType}}</label>
				</el-form-item>
				<el-form-item label="是否已缴纳">
					<label for="">{{detail4ProvinceAgent.isPay | isPayType}}</label>
				</el-form-item>
				<el-form-item label="用户ID">
					<label for="">{{detail4ProvinceAgent.userId}}</label>
				</el-form-item>
				<el-form-item label="代理姓名">
					<label for="">{{detail4ProvinceAgent.realName}}</label>
				</el-form-item>
				<el-form-item label="手机号码">
					<label for="">{{detail4ProvinceAgent.mobilePhone | isNullReturnLine}}</label>
				</el-form-item>
				<el-form-item label="平台券">
					<label for="">{{detail4ProvinceAgent.platformTicket | isNullReturnLine}}</label>
				</el-form-item>
				<el-form-item label="开拍时间">
					<label for="">{{detail4ProvinceAgent.startTime | isNullReturnLine}}</label>
				</el-form-item>
				<el-form-item label="截止时间">
					<label for="">{{detail4ProvinceAgent.endTime | isNullReturnLine}}</label>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 添加编辑弹出框 -->
		<el-dialog :title="dialogTitle4PrivinceAgent=='add'?'添加省代理':'编辑省代理'" v-dialogDrag :visible.sync="addlOrEditVisible4PrivinceAgent" width="500px">
			<!-- <el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content"> -->
			<el-form ref="form4PrivinceAgent" :model="form4PrivinceAgent" :rules="rules" label-width="auto">
				<el-form-item label="省名称" prop="provinceName">
					<el-select v-model="form4PrivinceAgent.provinceName" @change="provinceNameChange" class="handle-select mr10 width200">
						<el-option v-for="item in provinceOptions" :key="item.ProID" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="状态" prop="status">
					<el-select v-model="form4PrivinceAgent.status" @change="statusChange" class="handle-select mr10 width200">
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="代理手机号" prop="mobilePhone">
					<el-input v-model="form4PrivinceAgent.mobilePhone" maxLength="11" class="width200" placeholder="请填写手机号" @blur="searchUserId"></el-input>
				</el-form-item>
				<!-- <el-form-item label="用户Id" prop="userId">
					<el-input v-model="form4PrivinceAgent.userId" class="width200" disabled></el-input>
				</el-form-item> -->
				<div class="placeholderLine20"></div>
				<el-form-item label="开拍日期" prop="startTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form4PrivinceAgent.startTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="截拍日期" prop="endTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form4PrivinceAgent.endTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<div class="placeholderLine10"></div>
				<el-form-item label="是否缴纳" prop="isPay">
					<el-switch v-model="form4PrivinceAgent.isPay" @change="isPayChange" active-color="#13ce66" inactive-color="#c7c7c7"
					 active-text="是" inactive-text="否">
					</el-switch>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="赠送" v-if="dialogTitle4PrivinceAgent=='add'">
					<el-checkbox-group v-model="checkList" @change="checkBoxChange">
					    <el-checkbox label="1">大型矿机</el-checkbox>
					    <el-checkbox label="2">10000平台券</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-button class="editor-btn" icon="el-icon-check" type="primary" @click="submit('form4PrivinceAgent')">确认</el-button>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer center">
				<el-button type="primary" icon="el-icon-finished" @click="saveBtn">确 定</el-button>
			</span> -->
		</el-dialog>
		
		<!-- 添加编辑弹出框 -->
		<el-dialog :title="dialogTitle4CityAgent=='add'?'添加市代理':'编辑市代理'" v-dialogDrag :visible.sync="addlOrEditVisible4CityAgent" width="500px">
			<!-- <el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content"> -->
			<el-form ref="form4CityAgent" :model="form4CityAgent" :rules="rules" label-width="auto">
				<!-- <el-form-item label="省名称" prop="provinceAgentId">
					<el-select v-model="form4CityAgent.provinceAgentId" @change="selectProvinceNameChange" class="handle-select mr10 width200">
						<el-option v-for="item in tableData" :key="item.id" :label="item.provinceName" :value="item.id"></el-option>
					</el-select>
				</el-form-item> -->
				<div class="placeholderLine20"></div>
				<el-form-item label="市名称" prop="cityName">
					<el-input v-model="form4CityAgent.cityName" class="width200"></el-input>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="状态" prop="status">
					<el-select v-model="form4CityAgent.status" @change="statusChange" class="handle-select mr10 width200">
						<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="代理手机号" prop="mobilePhone">
					<el-input v-model="form4CityAgent.mobilePhone" maxLength="11" class="width200" placeholder="请填写手机号" @blur="searchUserIdByCity"></el-input>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="开拍日期" prop="startTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form4CityAgent.startTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="截拍日期" prop="endTime">
					<el-date-picker class="width200" type="datetime" placeholder="选择日期" v-model="form4CityAgent.endTime" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<!-- <div class="placeholderLine20"></div>
				<el-form-item label="用户Id">
					<el-input v-model="form4CityAgent.userId" class="width200"></el-input>
				</el-form-item> -->
				<div class="placeholderLine20"></div>
				<el-form-item label="是否缴纳" prop="isPay">
					<el-switch v-model="form4CityAgent.isPay" @change="isPayChange" active-color="#13ce66" inactive-color="#c7c7c7"
					 active-text="是" inactive-text="否">
					</el-switch>
				</el-form-item>
				<div class="placeholderLine20"></div>
				<el-form-item label="赠送" v-if="dialogTitle4CityAgent=='add'">
					<el-checkbox-group v-model="checkList" @change="checkBoxChange">
					    <el-checkbox label="1">中型矿机</el-checkbox>
					    <el-checkbox label="2">5000平台券</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<div class="placeholderLine10"></div>
				<el-button class="editor-btn" icon="el-icon-check" type="primary" @click="submit4CityAgent('form4CityAgent')">确认</el-button>
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
				checkList:[],
				mobilePhone:'',
				formLabelPosition:'left',
				detailVisible:false,
				form4PrivinceAgent: {
					provinceName:'',
					status: 0,
					startTime: '',
					endTime: '',
					mobilePhone:'',
					userId:'',
					isPay: 0
				},
				form4CityAgent: {
					provinceAgentId:'',
					cityName:'',
					status: 0,
					startTime: '',
					endTime: '',
					mobilePhone:'',
					userId:'',
					isPay: 0
				},
				rules: {
					provinceName: [{
						type: 'string',
						required: true,
						message: '请选择省',
						trigger: 'blur'
					}],
					cityName: [{
						type: 'string',
						required: true,
						message: '请选择市',
						trigger: 'blur'
					}],
					status: [{
						type: 'number',
						required: true,
						message: '请选择状态',
					}],
					startTime: [{
						type: 'string',
						required: true,
						message: '请选择开拍时间',
						trigger: 'blur'
					}],
					endTime: [{
						type: 'string',
						required: true,
						message: '请选择截拍时间',
						trigger: 'blur'
					}],
					userId: [{
						type: 'string',
						required: true,
						message: '请填写用户Id',
						trigger: 'blur'
					}],
					mobilePhone: [{
						type: 'string',
					}, {
						min: 11,
						max: 11,
						message: '长度在 11 个字符',
						trigger: 'blur'
					}],
					masterPhone: [{
						type: 'string',
					}, {
						min: 8,
						max: 11,
						message: '长度在 8 到 11 个字符',
						trigger: 'blur'
					}]
				},
				url: '',
				tableData: null,
				total: 100,
				currentPage: 1,
				pageSize: 8,
				pageSizes: '',
				multipleSelection: [],
				searchForm: {
					date: '',
					status: '',
					condition: '',
					searchContent: ''
				},
				status: "",
				statusOptions: [
				],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				dialogTitle4PrivinceAgent: 'add',
				addlOrEditVisible4PrivinceAgent: false,
				dialogTitle4CityAgent: 'add',
				addlOrEditVisible4CityAgent: false,
				delVisible: false,
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
				dialogFormVisible4reply: false,
				replyContent: '',
				pc: 'province',
				provinceOptions:[],
				id:'',
				detail4ProvinceAgent:''
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
			console.log("created")
			this.initData();
			this.getData();
		},
		computed: {

		},
		methods: {
			initData() {
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.statusOptions = this.$config.agencyStatusOptions;
				this.provinceOptions = this.$config.provinceOptions;
			},
			checkBoxChange(val){
				this.checkList = val;
				console.log('checkList',this.checkList);
			},
			isPayChange(val) {
				console.log('val', val)
			},
			searchUserIdByCity(){
				let _this = this;
				console.log('searchUserId');
				if(!_this.$reg.phone.test(this.form4CityAgent.mobilePhone)){
					_this.$message('手机号格式不对');
					return;
				}
				let params = {
					mobilePhone:_this.form4CityAgent.mobilePhone
				}
				_this.$ajax.ajax(_this.$api.getUserIdByPhone, 'GET', params, function(res) {
					if (res.code == _this.$api.ERR_OK) {
						_this.form4CityAgent.userId = res.data;
						console.log(_this.form4CityAgent,'_this.form4CityAgent')
					}
				})
			},
			searchUserId(){
				let _this = this;
				console.log('searchUserId');
				if(!_this.$reg.phone.test(this.form4PrivinceAgent.mobilePhone)){
					_this.$message('手机号格式不对');
					return;
				}
				let params = {
					mobilePhone:_this.form4PrivinceAgent.mobilePhone
				}
				_this.$ajax.ajax(_this.$api.getUserIdByPhone, 'GET', params, function(res) {
					if (res.code == _this.$api.ERR_OK) {
						_this.form4PrivinceAgent.userId = res.data;
						console.log(_this.form4PrivinceAgent,'_this.form4PrivinceAgent')
					}
				})
			},
			addProvinceBtn() {
				this.checkList = [];
				this.dialogTitle4PrivinceAgent = 'add';
				this.addlOrEditVisible4PrivinceAgent = true;
				this.form4PrivinceAgent = {
					provinceName:'',
					status: 0,
					startTime: '',
					endTime: '',
					isPay: false
				}
				//this.getProvinceJson();
			},
			submit(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// console.log('form4PrivinceAgent', _this.form4PrivinceAgent)
						let params = {
							provinceName:_this.form4PrivinceAgent.provinceName,
							status:_this.form4PrivinceAgent.status,
							userId:_this.form4PrivinceAgent.userId,
							startTime:_this.form4PrivinceAgent.startTime,
							endTime:_this.form4PrivinceAgent.endTime,
							isPay:_this.form4PrivinceAgent.isPay?1:0,
							checkList:_this.checkList.join(',')
						}
						let url = '';
						if(_this.dialogTitle4PrivinceAgent=='add'){
							url = _this.$api.insertProvinceAgent;
						}else if(_this.dialogTitle4PrivinceAgent=='edit'){
							params.id=_this.form4PrivinceAgent.id;
							url = _this.$api.updateProvinceAgent;
						}
						_this.$ajax.ajax(url, 'POST', params, function(res) {
							if (res.code == _this.$api.ERR_OK) {
								_this.addlOrEditVisible4PrivinceAgent = false;
								_this.$message.success(`${_this.dialogTitle4PrivinceAgent=='add'?'添加':'修改'} 信息成功`);
								_this.getData();
							}else{
								_this.$message(res.message);
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submit4CityAgent(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// console.log('form4PrivinceAgent', _this.form4PrivinceAgent)
						let params = {
							provinceAgentId: _this.form4CityAgent.provinceAgentId,
							cityName:_this.form4CityAgent.cityName,
							status:_this.form4CityAgent.status,
							userId:_this.form4CityAgent.userId,
							startTime:_this.form4CityAgent.startTime,
							endTime:_this.form4CityAgent.endTime,
							isPay:_this.form4CityAgent.isPay?1:0,
							checkList:_this.checkList.join(',')
						}
						let url = '';
						if(_this.dialogTitle4CityAgent=='add'){
							url = _this.$api.insertCityAgent;
						}else if(_this.dialogTitle4CityAgent=='edit'){
							params.id=_this.form4CityAgent.id;
							url = _this.$api.updateCityAgent;
						}
						_this.$ajax.ajax(url, 'POST', params, function(res) {
							console.log('res', res);
							if (res.code == _this.$api.ERR_OK) {
								_this.addlOrEditVisible4CityAgent = false;
								_this.$message.success(`${_this.dialogTitle4CityAgent=='add'?'添加':'修改'} 信息成功`);
								_this.getData();
							}else{
								_this.$message(res.message);
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					pageNo: this.currentPage,
					pageSize: this.pageSize
				}
				_this.$ajax.ajax(_this.$api.getAssistProvinceAgentListByPage, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
						_this.total = res.data.total;
						// _this.menuData = _this.$utils.getMenuTreeList(list)
					}
				})
			},
			getDataByStatus(params) {
				let _this = this;
				_this.$ajax.ajax(_this.$api.getCityAgentListMoreInfo, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
						_this.total = res.data.size;
						// _this.menuData = _this.$utils.getMenuTreeList(list)
					}
				})
			},
			// 保存编辑
			saveBtn() {
				// this.$set(this.tableData, this.idx, this.form);
				this.addlOrEditVisible = false;
				this.$message.success(`${this.visibleType=='add'?'添加':'修改'}成功`);
			},
			getColor(status) {
				return status == "0" ? "red" : status == "1" ? "green" : "";
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			searchEvent() {
				this.pageIndex = 1;
				// console.log('searchForm', this.searchForm);
				// this.getData()
				this.getData();
			},
			statusChangeAndSearch(val) {
				console.log('val', val)
				this.status = val;
				this.getData();
			},
			statusChange(val) {
				console.log('val', val)
			},
			selectProvinceNameChange(val){
				console.log('proId',val)
				this.form4CityAgent.provinceAgentId = val;
			},
			provinceNameChange(val){
				console.log('val', val)
			},
			cityNameChange(val) {
				console.log('val', val)
			},
			conditionChange(val) {
				console.log('val', val)
			},
			
			// 分页导航
			handleCurrentChange(val) {
				this.currentPage = val||1;
				this.getData();
			},
			handleSizeChange(val) {
				console.log('size', val)
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
				this.detail4ProvinceAgent = row;
				this.detailVisible = true;
			},
			handleEdit4ProviceAgent(index, row) {
				let _this = this;
				_this.checkList = [];
				this.dialogTitle4PrivinceAgent = 'edit';
				this.addlOrEditVisible4PrivinceAgent = true;
				console.log('row', row)
				this.form4PrivinceAgent = {
					id:row.id,
					provinceName: row.provinceName || '',
					// status: _this.$filters.agencyStatusType(row.status) || '',
					status: parseInt(row.status),
					mobilePhone: row.mobilePhone,
					startTime: row.startTime || '',
					endTime: row.endTime || '',
					isPay: row.isPay==1?true:false,
					userId: row.userId || '',
				}
			},
			handleEdit4CityAgent(index, row){
				let _this = this;
				_this.checkList = [];
				this.dialogTitle4CityAgent = 'edit';
				this.addlOrEditVisible4CityAgent = true;
				console.log('row', row)
				this.form4CityAgent = {
					id:row.id,
					cityName: row.cityName || '',
					status: parseInt(row.status),
					mobilePhone: row.mobilePhone,
					startTime: row.startTime || '',
					endTime: row.endTime || '',
					isPay: row.isPay==1?true:false,
					userId: row.userId || '',
				}
			},
			handleDelete4CityAgent(index,row) {
				console.log('row.id', row.id);
				this.id = row.id;
				this.deleteType = 'cityAgent';
				this.delVisible = true;
			},
			handleAddCityAgent(index,row){
				console.log(row);
				_this.checkList = [];
				this.dialogTitle4CityAgent = "add";
				this.addlOrEditVisible4CityAgent = true;
				this.form4CityAgent.provinceAgentId = row.id;
			},
			handleDelete4ProviceAgent(index,row) {
				console.log('row.id', row.id);
				this.id = row.id;
				this.deleteType = 'provinceAgent';
				this.delVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 保存编辑
			saveEdit() {
				// this.$set(this.tableData, this.idx, this.form);
				this.detailOrEditVisible = false;
				this.$message.success(`修改信息成功`);
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				let url = "";
				if(_this.deleteType == 'provinceAgent'){
					url = _this.$api.deletedProvinceAgent;
				}else if(_this.deleteType == 'cityAgent'){
					url = _this.$api.deletedCityAgent;
				}
				_this.$ajax.ajax(url + _this.id, 'POST', null, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success(`删除成功`);
						_this.delVisible = false;
						_this.getData();
					}
				})
			}
		}
	}
</script>

<style scoped>
	.el-form-item{
		margin-bottom: 0px !important;
	}
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
