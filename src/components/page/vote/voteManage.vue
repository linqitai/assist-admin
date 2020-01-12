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
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">新建</el-button>
					</div>
				</div>
				<div class="element">
					<p class="inline">是否发布</p>
					<div class="inline">
						<el-select v-model="searchForm.isPublish" @change="statusChange" class="handle-select mr10 width120">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
				<!-- <div class="element">
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="选择日期" v-model="searchForm.date" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div> -->
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				 <el-table-column type="expand">
				  <template slot-scope="props">
					<el-table :data="props.row.questionVoList" border stripe class="table" style="width: 90%">
						<el-table-column prop="id" label="ID" width="60"></el-table-column>
						<el-table-column prop="questionTitle" label="选项标题" show-overflow-tooltip min-width="300"></el-table-column>
						<el-table-column prop="questionContent" label="选项内容" show-overflow-tooltip min-width="400"></el-table-column>
						<el-table-column label="操作" min-width="150" align="center" fixed="right">
							<template slot-scope="scope">
								<el-link type="primary" @click="handleEditQuestion(scope.$index, scope.row)">编辑</el-link>
								<i class="placeholderVertical">|</i>
								<el-link type="primary" @click="handleDeleteQuestion(scope.$index, scope.row)">删除</el-link>
							</template>
						</el-table-column>
					</el-table>
				  </template>
				</el-table-column>
				<el-table-column prop="id" label="ID" width="60"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
				<el-table-column prop="deadTime" label="截止时间" min-width="160"></el-table-column>
				<el-table-column prop="voteTitle" label="标题" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
				<el-table-column label="是否发布" min-width="80">
					<template slot-scope="scope">
						{{scope.row.isPublish | isOrNo}}
					</template>
				</el-table-column>
				<el-table-column label="类型" min-width="100">
					<template slot-scope="scope">
						{{scope.row.type | voteType}}
					</template>
				</el-table-column>
				<el-table-column prop="creater" label="创建人"  min-width="120"></el-table-column>
				
				<el-table-column label="操作" min-width="150" align="center">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleAddQuestion(scope.$index, scope.row)">添加选项</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 详情 -->
		<el-dialog title="详情" v-dialogDrag :visible.sync="detailVisible" width="420px">
			<div>
				<div class="voteTitle textTitle">{{voteData.voteTitle}}</div>
				<div class="textAdorn clear" v-show="voteData.deadTime">
					<div class="center">{{voteData.createTime}} ~ {{voteData.deadTime}}</div>
					<!-- <div class="right">{{voteData.deadTime}}</div> -->
				</div>
				<div class="textContent margT3">备注:{{voteData.remark}}</div>
				<div class="question clear hidden">
					<div class="left textAdorn">选择类型 {{voteData.type | voteType}}</div>
					<div class="right textAdorn">是否已发布 {{voteData.isPublish | isOrNo}}</div>
				</div>
				<div class="placeholderLine10"></div>
				<div v-for="item in voteData.questionVoList" :key="item.id" class="clear hidden">
					{{item.questionTitle}}:{{item.num}}票
				</div>
				<div class="placeholderLine20"></div>
			</div>
			<!-- <div class="answer">
				<el-radio v-model="selectedVote" v-for="item in voteData.answer" :label="item.content">{{item.content}}</el-radio>
			</div> -->
		</el-dialog>
		<!-- 添加/编辑 -->
		<el-dialog :title="visibleType=='add'?'新建':'编辑'" :visible.sync="addOrEditVisible" width="400px">
			<el-form ref="form" :model="form" label-width="auto">
				<el-form-item label="标题" prop="voteTitle">
					<el-input v-model="form.voteTitle" placeholder="请填写投票的标题"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-radio-group v-model="form.type">
					    <el-radio :label="1">单选</el-radio>
					    <el-radio :label="2">多选</el-radio>
					  </el-radio-group>
				</el-form-item>
				<el-form-item label="截止时间" prop="deadTime">
					<el-date-picker type="datetime" placeholder="选择时间" 
					v-model="form.deadTime"
					:picker-options="pickerDateTimeOptions"
					default-time="22:00:00"
					value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input class="remark" type="textarea" autosize v-model="form.remark" placeholder="请填写对投票标题的解释文案"></el-input>
				</el-form-item>
				<el-form-item label="是否发布" prop="isPublish">
					<el-switch
					  @change="isPublishChange"
					  v-model="form.isPublish"
					  active-text="是"
					  inactive-text="否">
					</el-switch>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="addOrEditVisible = false">取 消</el-button> -->
				<el-button type="primary" icon="el-icon-edit" @click="sureBtn">确认</el-button>
			</span>
		</el-dialog>
		
		<!-- 添加/编辑question -->
		<el-dialog :title="addOrEditQuestionType=='add'?'新建选项':'编辑选项'" :visible.sync="addOrEditQuestionVisible" width="400px">
			<el-form ref="formQuestion" :rules="rulesQuestion" :model="formQuestion" label-width="auto">
				<el-form-item label="选项标题" prop="questionTitle">
					<el-input v-model="formQuestion.questionTitle" placeholder="请填写选项的标题"></el-input>
				</el-form-item>
				<el-form-item label="选项描述" prop="questionContent">
					<el-input class="remark" type="textarea" autosize v-model="formQuestion.questionContent" placeholder="请填写对选项标题的解释文案"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="addOrEditVisible = false">取 消</el-button> -->
				<el-button type="primary" icon="el-icon-edit" @click="sureQuestionBtn('formQuestion')">确认</el-button>
			</span>
		</el-dialog>
		
		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delQuestionVisible" width="300px" center>
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delQuestionVisible = false">取 消</el-button>
				<el-button type="primary" @click="deleteQuestionRow">确 定</el-button>
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
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				pickerDateTimeOptions: {
				  shortcuts: [{
					text: '3天后',
					onClick(picker) {
					  const date = new Date();
					  date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
					  picker.$emit('pick', date);
					}
				  }, {
					text: '7天后',
					onClick(picker) {
					  const date = new Date();
					  date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
					  picker.$emit('pick', date);
					}
				  }]
				},
				selectedVote:'',
				voteData:{
					createDate:'2019-10-10',
					cutOffDate:'2019-10-17',
					title:'会员对平台帮扶困难家庭的理念认可度的投票',
					question:'<p>为了使平台的理念得到落实，现平台想向大家了解是否认可以下帮扶方案：</p>2020年2月1号起，会员们都有机会得到一份的保障金，这份保障基金每月至少发放给一名所需会员，发放给：得了重疾需要一笔救助金的会员（需要医院证明，省市代理亲自到现场审核，一切出行费用由平台报销）......<p>',
					questoinType:'单选',
					answer:[{id:0,content:'看好、支持、认可'},{id:1,content:'没感觉，有待观察'}]
					
				},
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				multipleSelection: [],
				searchForm: {
					isPublish:''
				},
				status:"",
				statusOptions: [],
				visibleType: 'detail',
				addOrEditVisible: false,
				detailVisible:false,
				delVisible: false,
				delQuestionVisible: false,
				form: {
					voteTitle: '',
					deadTime: '',
					type:1,
					remark:'',
					isPublish:true
				},
				id:'',
				addOrEditQuestionVisible:false,
				addOrEditQuestionType:'',
				formQuestion:{
					voteId:'',
					questionTitle:'',
					questionContent:'',
				},
				rulesQuestion: {
					questionTitle: [{
						type: 'string',
						required: true,
						message: '请填写选项标题',
					}],
					questionContent: [{
						type: 'string',
						message: '请填写选项内容',
					}]
				},
			}
		},
		filters:{
			filterStatus(val){
				var result = '';
				if(val == 0){
					result = '未处理';
				}else if(val == 1){
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
			isPublishChange(val){
				console.log('isPublish', val);
				this.form.isPublish = val;
				// if(val==true){
				// 	this.form.isPublish = 1;
				// }else if(val == 0){
				// 	this.form.isPublish = 0;
				// }
			},
			getColor(status) {
			  return status == "0" ? "red" : status == "1" ? "green" : "";
			},
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.statusOptions = this.$config.isRoNoStatus
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
				console.log('searchForm', this.searchForm)
				this.getData();
				// this.getList();
			},
			handleAddQuestion(index, row) {
				let _this = this;
				_this.addOrEditQuestionVisible = true;
				_this.addOrEditQuestionType = 'add';
				_this.formQuestion.voteId = row.id;
			},
			handleEditQuestion(index, row) {
				let _this = this;
				_this.addOrEditQuestionVisible = true;
				_this.addOrEditQuestionType = 'edit';
				_this.formQuestion = row;
			},
			sureQuestionBtn(formName){
				console.log('formQuestion',this.formQuestion);
				let _this = this;
				_this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log('formQuestion', _this.formQuestion)
						let params = {
							voteId:_this.formQuestion.voteId,
							questionTitle:_this.formQuestion.questionTitle,
							questionContent:_this.formQuestion.questionContent,
						}
						let url = '';
						if(_this.addOrEditQuestionType=='add'){
							url = _this.$api.insertAssistQuestion;
						}else if(_this.addOrEditQuestionType=='edit'){
							params.id=_this.formQuestion.id;
							url = _this.$api.updateAssistQuestion;
						}
						_this.$ajax.ajax(url, 'POST', params, function(res) {
							console.log('res', res);
							if (res.code == _this.$api.ERR_OK) {
								_this.addOrEditQuestionVisible = false;
								_this.$message.success(`${_this.addOrEditQuestionType=='add'?'添加':'修改'} 标题选项成功`);
								_this.getData();
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleEdit(index, row) {
				let _this = this;
				_this.visibleType = 'edit';
				_this.addOrEditVisible = true;
				console.log('editRow',row);
				_this.form = row;
				if(row.isPublish == 1){
					_this.form.isPublish = true;
				}else{
					_this.form.isPublish = false;
				}
			},
			sureBtn(){
				console.log('form',this.form);
				let _this = this;
				let userInfo = JSON.parse(localStorage.getItem('_USERINFO_'));
				console.log('userInfo',userInfo);
				var params = {
					voteTitle: _this.form.voteTitle,
					deadTime: _this.form.deadTime,
					creater: userInfo.userName,
					type: _this.form.type,
					isPublish: _this.form.isPublish==true?1:0,
					remark: _this.form.remark,
				}
				console.log('params',params);
				let url = '';
				if(_this.visibleType=='add'){
					url = _this.$api.insertAssistVote;
				}else if(_this.visibleType=='edit'){
					url = _this.$api.updateAssistVote;
					params.id = _this.form.id
				}
				_this.$ajax.ajax(url, 'POST', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.addOrEditVisible = false;
						_this.$message({
							type: 'success',
							message: '操作成功'
						});
						_this.getData();
					}
				})
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
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				// if (process.env.NODE_ENV === 'development') {
				// 	this.url = '/ms/table/list';
				// };
				let _this = this;
				this.tableData = [{
					id: 8,
					createTime: '2016-05-01',
					voteTitle:'投票通知',
					remark:'<i>请大家认真投票</i>',
					isPublish:0,
				}]
				var params = {
					pageNo: _this.pageIndex,
					pageSize: _this.pageSize,
					isPublish: _this.searchForm.isPublish,
				}
				_this.$ajax.ajax(_this.$api.getAssistVoteList, 'GET', params, function(res) {
					// console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						// let list = res.data.list;
						// console.log('list',list);
						// for(let i=0; i<list.length;i++){
						// 	list[i].isPublish==list[i].isPublish==0?false:true;
						// }
						_this.tableData = res.data.list;
						_this.total = res.data.size;
						console.log('_this.tableData',_this.tableData);
					}
				})
			},
			search() {
				this.is_search = true;
			},
			handleDetail(index, row) {
				console.log('row',row);
				this.voteData = row;
				this.visibleType = 'detail';
				this.detailVisible = true;
				
				// this.idx = index;
				// console.log('index',index)
				// console.log('row.id',row.ID)
				// this.$store.commit('setMerchantId',row.ID)
				// console.log('getMerchantId',this.$store.state.merchantId)
				// this.$router.push('/shopOrderManage')
			},
			addBtn() {
				let _this = this;
				this.visibleType = 'add';
				this.addOrEditVisible = true;
				this.$utils.formClear(_this.form);
				//window.open('/#/operateVote?type=add','_blank')
				// this.$router.push({path:'/operateGuide',query:{type:'add'}});
				// this.visibleType = 'add';
				// this.form={
				// 	title: '',
				// 	content: '',
				// 	isPublish: false
				// }
			},
			handleDeleteQuestion(index,row) {
				console.log('ID', row.id);
				let _this = this;
				_this.delQuestionVisible = true;
				_this.formQuestion.id = row.id;
			},
			handleDelete(index,row) {
				console.log('ID', row.id);
				let _this = this;
				_this.id = row.id;
				_this.delVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 保存编辑
			saveEdit() {
				// this.$set(this.tableData, this.idx, this.form);
				this.addOrEditVisible = false;
				this.$message.success(`修改 ${this.form.name} 信息成功`);
			},
			deleteQuestionRow(){
				let _this = this;
				var params = {}
				_this.$ajax.ajax(_this.$api.deleteAssistQuestionById + _this.formQuestion.id, 'POST', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success('删除成功');
						_this.delQuestionVisible = false;
						_this.getData();
					}
				})
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				var params = {}
				_this.$ajax.ajax(_this.$api.deleteAssistVoteById + _this.id, 'POST', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success('删除成功');
						_this.delVisible = false;
						_this.getData();
					}
				})
				// this.tableData.splice(this.idx, 1);
				// this.$message.success('删除成功');
				// this.delVisible = false;
				// this.addOrEditVisible = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '~@/components/page/vote/voteManage.scss';
	.el-form-item{
		margin-bottom: 16px !important;
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
