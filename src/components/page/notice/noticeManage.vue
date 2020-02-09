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
						<el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">添 加</el-button>
					</div>
				</div>
				<!-- <div class="element">
					<p class="inline">是否发布</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width120">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
				</div> -->
				<!-- <div class="element">
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="选择日期" v-model="searchForm.date" value-format="yyyy/MM/dd"></el-date-picker>
					</div>
				</div> -->
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="ID" width="80"></el-table-column>
				<el-table-column prop="createTime" label="日期"  min-width="180"></el-table-column>
				<el-table-column label="类型"  min-width="120">
					<template slot-scope="scope">
						{{scope.row.type | noticeType}}
					</template>
				</el-table-column>
				<el-table-column prop="noticeTitle" label="标题" show-overflow-tooltip min-width="200"></el-table-column>
				<el-table-column label="是否发布" width="120" fixed="right">
					<template slot-scope="scope">
						<el-switch
						  v-model="scope.row.isPublish"
						  active-color="#ffae00"
						  inactive-color="#c7c7c7"
						  active-text="是"
						  inactive-text="否"
						  @change="isPublishChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleDelete(scope.row)">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 详情弹出框 -->
		<el-dialog title="详情" :visible.sync="detailVisible" width="420px">
			<el-form ref="form" :model="form" label-width="auto">
				<el-form-item label="日期">
					<label for="">{{form.createTime}}</label>
				</el-form-item>
				<el-form-item label="标题">
					<label for="">{{form.noticeTitle}}</label>
				</el-form-item>
				<el-form-item label="内容" v-if="form.type==0">
					<div v-html="form.noticeContent"></div>
				</el-form-item>
				<img class="selectedImg" :src="form.imgUrl" v-if="form.type==1"/>
			</el-form>
		</el-dialog>
		<el-dialog :title="visibleType=='add'?'添加':'编辑'" :visible.sync="addOrEditVisible" width="600px">
			<el-form ref="form" :model="form" label-width="auto">
				<el-form-item label="标题">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<div v-html="form.content"></div>// 你要展示的内容
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="addOrEditVisible = false">取 消</el-button> -->
				<el-button type="primary" icon="el-icon-edit" @click="sureBtn">确认</el-button>
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
		<el-dialog title="回复留言" :visible.sync="dialogFormVisible4reply">
		  <el-input v-model="replyContent" autocomplete="off"></el-input>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible4reply = false">取 消</el-button>
		    <el-button type="primary" @click="sureReplyEvent">确 定</el-button>
		  </div>
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
				url: '',
				tableData: [],
				total: 400,
				pageSizes:[8, 10, 12, 14],
				pageSize:8,
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					date:'',
					status: '',
					condition: '',
					searchContent: ''
				},
				status:"",
				statusOptions: [{
						id: "0",
						value: "否"
					},
					{
						id: "1",
						value: "是"
					}
				],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				visibleType: 'detail',
				addOrEditVisible: false,
				detailVisible:false,
				delVisible: false,
				form: {
					title: '',
					content: '',
					dateTime: '',
					isPublish: false
				},
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
				dialogFormVisible4reply: false,
				replyContent:'',
				id:''
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
		mounted() {
			console.log("mounted")
			this.initData();
			this.getData();
		},
		computed: {
		},
		methods: {
			isPublishChange(row){
				let _this = this;
				console.log('isPublish',row.isPublish);
				var params = {
					id:row.id,
					isPublish:row.isPublish?1:0,
				}
				_this.$ajax.ajax(_this.$api.updateNotice, 'POST', params, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success('操作成功');
					}
				})
			},
			getColor(status) {
			  return status == "0" ? "red" : status == "1" ? "green" : "";
			},
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
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
				this.currentPage = 1;
				console.log('searchForm', this.searchForm)

				this.getData();
			},
			sureReplyEvent(){
				this.dialogFormVisible4reply = false;
				console.log('replyContent',this.replyContent)
			},
			sureBtn(){
				this.addOrEditVisible = false;
				// this.$confirm('此操作将帮卖方确认, 是否继续?', '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	this.$message({
				// 		type: 'success',
				// 		message: '确认成功'
				// 	});
				// 	this.addOrEditVisible = false;
				// }).catch(() => {
				// 	this.$message({
				// 		type: 'info',
				// 		message: '我再考虑考虑'
				// 	});
				// });
				
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
					this.addOrEditVisible = false;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '我再考虑考虑'
					});
				});
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
				let _this = this;
				var params = {
					pageNo:_this.currentPage,
					pageSize:_this.pageSize
				}
				_this.$ajax.ajax(_this.$api.getNoticePageList, 'GET', params, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						let list = res.data.list;
						list.forEach((item,index)=>{
							list[index].isPublish = item.isPublish?true:false;
							/* console.log(index,'index');
							console.log(item.isPublish,'item.isPublish'); */
						})
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
			handleDetail(index, row) {
				this.visibleType = 'detail';
				this.detailVisible = true;
				this.form = row;
			},
			addBtn() {
				window.open('/#/operateNotice?type=add','_blank')
				// this.$router.push({path:'/operateNotice',query:{type:'add'}});
			},
			handleEdit(index, row) {
				console.log('editRow',row);
				localStorage.setItem('noticeRow',JSON.stringify(row));
				// this.$router.push({path:'/operateNotice',query:{type:'edit'}});
				window.open('/#/operateNotice?type=edit','_blank');
			},
			handleDelete(row) {
				this.id = row.id;
				console.log('ID', this.id);
				this.delVisible = true;
			},
			// 确定删除
			deleteRow() {
				let _this = this;
				_this.$ajax.ajax(_this.$api.deletedNotice + _this.id,'POST', null, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success('删除成功');
						_this.delVisible = false;
						_this.getData();
					}
				})
				
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
		}
	}
</script>

<style scoped lang="scss">
	.table{
		.selectedImg{
			width: 300px;
		}
	}
	.el-form-item{
		margin-bottom: 10px !important;
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
