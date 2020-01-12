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
					<p class="inline">状态</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width120">
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
				<el-table-column prop="id" label="留言ID" width="80" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="date" label="日期"  width="120"></el-table-column> -->
				<!-- <el-table-column prop="userId" label="用户ID" width="150" show-overflow-tooltip></el-table-column> -->
				<el-table-column prop="nickName" label="用户昵称" width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="留言时间" width="160"></el-table-column>
				<el-table-column label="留言类型" min-width="90">
					<template slot-scope="props">
						<span :class="getColor(props.row.messageType)">{{ props.row.messageType | wordType}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="messageTitle" label="留言标题" width="200"></el-table-column>
				<el-table-column prop="messageContent" label="留言内容" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column prop="reply" label="回复内容" show-overflow-tooltip width="200">
					<!-- <template slot-scope="props">
						<span class="ellipsis">{{ props.row.remark }}</span>
					</template> -->
				</el-table-column>
				<el-table-column label="状态" fixed="right" width="80">
					<template slot-scope="props">
						<span :class="getColor(props.row.status)">{{ props.row.status | filterStatus}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="90" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible">
			<el-form ref="form" :model="form" label-width="auto" :inline="false">
				<el-form-item label="用户ID">
					<label for="">{{form.userId}}</label>
				</el-form-item>
				<el-form-item label="用户昵称">
					<label for="">{{form.nickName}}</label>
				</el-form-item>
				<el-form-item label="留言时间">
					<label for="">{{form.createTime}}</label>
				</el-form-item>
				<el-form-item label="留言类型">
					<label for="">{{form.messageType | wordType}}</label>
				</el-form-item>
				<el-form-item label="留言标题">
					<label for="">{{form.messageTitle}}</label>
				</el-form-item>
				<el-form-item label="留言内容" class="block">
					<label for="">{{form.messageContent}}</label>
				</el-form-item>
				<el-form-item label="回复内容" class="block" v-if="isReply">
					<label for="">{{form.reply}}</label>
				</el-form-item>
			</el-form>
			<span class="dialog-footer"  v-if="isReply==''||isReply==null">
				<!-- <el-button @click="detailOdialog-footerrEditVisible = false">取 消</el-button> -->
				<div>
					<el-form ref="form" label-width="auto" :inline="false">
						<el-form-item label="回复内容" class="block">
							<el-input type="textarea" autosize v-model="form.reply"></el-input>
						</el-form-item>
						<el-form-item label="贡献值" class="block" v-if="checked">
							<el-input-number v-model="addContributionValue" @change="handleChange" :min="1" :max="10" label="请填写所要给于奖励的贡献值"></el-input-number>
						</el-form-item>
					</el-form>
					<el-checkbox v-model="checked">是否给于奖励</el-checkbox>
					<div class="placeholderLine10"></div>
					<div class="placeholderLine10"></div>
				</div>
				<el-button type="primary" icon="el-icon-edit" @click="sureReplyEvent(form)">回 复</el-button>
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
			<el-form :model="replyRuleForm" :rules="rules" ref="replyRuleForm" label-width="100px">
				<el-form-item label="回复内容" prop="content">
				    <el-input type="textarea" v-model="replyRuleForm.content" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button @click="dialogFormVisible4reply = false">取 消</el-button>
				    <el-button type="primary" @click="sureReplyEvent('replyRuleForm')">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import searchCondition from "@/components/common/searchCondition.vue";
	export default {
		data() {
			return {
				addContributionValue:1,
				checked: false,
				replyRuleForm: {
					content: '',
				},
				rules: {
					content: [{
							type: 'string',
							required: true,
							message: '请输入回复内容',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 100,
							message: '长度在 2 到 100 个字符',
							trigger: 'blur'
						}
					],
				},
				url: '',
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes:[8, 10, 12, 14],
				pageSize: 8,
				multipleSelection: [],
				searchForm: {
					date: '',
					status: '',
					condition: '',
					searchContent: ''
				},
				status: "",
				statusOptions: [],
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
					status: '',
					name: '',
					address: '',
					leaveWord: ''
				},
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
				dialogFormVisible4reply: false,
				replyContent: '',
				isReply:false,
			}
		},
		filters: {
			filterStatus(val) {
				var result = '';
				if (val == 0) {
					result = '待回复';
				} else if (val == 1) {
					result = '已处理';
				}
				return result;
			}
		},
		components: {
			searchCondition
		},
		mounted() {
			console.log("created")
			this.initData();
			this.getData();
		},
		computed: {
		},
		methods: {
			handleChange(value) {
				console.log(value);
			},
			getColor(status) {
				return status == "0" ? "red" : status == "1" ? "green" : "";
			},
			initData() {
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.statusOptions = this.$config.wordStatusOptions;
			},
			searchEvent() {
				this.pageIndex = 1;
				console.log('searchForm', this.searchForm)
				this.getData();
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					pageNo: _this.pageIndex,
					pageSize: _this.pageSize,
					status:_this.searchForm.status,
				}
				_this.$ajax.ajax(_this.$api.getAssistMessageBoardPageList, 'GET', params, function(res) {
					console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
						_this.total = res.data.total;
						// _this.menuData = _this.$utils.getMenuTreeList(list)
					}
				})
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			statusChange(val) {
				console.log('val', val)
				this.getData();
			},
			conditionChange(val) {
				console.log('val', val)
			},
			sureReplyEvent(form) {
				let _this = this;
				var params = {
					id: _this.form.id,
					userId:_this.form.userId,
					messageType:_this.form.messageType,
					status: 1,
					reply:_this.form.reply,
					addContributionValue:_this.addContributionValue
				}
				if(_this.$utils.hasNull(params)){
					_this.$message({
						type: 'info',
						message: '请填写留言内容'
					});
					return;
				}
				console.log('params', params)
				_this.$ajax.ajax(_this.$api.updateAssistMessageBoard, 'POST', params, function(res) {
					// console.log('res', res);
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.detailOrEditVisible = false;
						_this.$message({
							type: 'success',
							message: '回复成功'
						});
						_this.getData();
					}
				})
			},
			replyBtn(form) {
				this.dialogFormVisible4reply = true;
				this.id = form.id;
				// this.$confirm('此操作将帮卖方确认, 是否继续?', '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	this.$message({
				// 		type: 'success',
				// 		message: '确认成功'
				// 	});
				// 	this.detailOrEditVisible = false;
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
				this.pageIndex = val;
				console.log('this.pageIndex',this.pageIndex)
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
				this.detailOrEditVisible = true;
				this.form = row;
				this.isReply = this.form.reply?true:false;
				// this.idx = index;
				// console.log('index',index)
				// console.log('row.id',row.ID)
				// this.$store.commit('setMerchantId',row.ID)
				// console.log('getMerchantId',this.$store.state.merchantId)
				// this.$router.push('/shopOrderManage')
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
