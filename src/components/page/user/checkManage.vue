<style scoped lang="scss">
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
		.flexBox{
			display: flex;
			.flexBoxLeft{
				flex: 0 0 410px;
			}
			.flexBoxRight{
				flex: 1;
			}
		}
		.gesturePic{
			width: 240px;
		}
		.realName{
			text-align: left;
			padding-left: 86px;
			font-weight: bold;
			font-size: 16px;
			letter-spacing: 1px;
		}
		.idCardPic{
			width: 400px;
		}
		.idCard{
			text-align: right;
			padding-right: 70px;
			font-weight: bold;
			font-size: 18px;
			letter-spacing: 1px;
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
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="注册日期" v-model="searchForm.date" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div>
				<div class="element">
					<p class="inline">审核状态</p>
					<div class="inline">
						<el-select v-model="searchForm.actived" @change="activedChange" placeholder="选择审核状态" class="handle-select mr10 width160">
							<el-option v-for="item in activedOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
				<div class="element">
					<p class="inline">手机号</p>
					<div class="inline width160">
						<el-input v-model="searchForm.mobilePhone" size="medium" placeholder="请输入手机号" clearable></el-input>
					</div>
				</div>
			</search-condition>
			<!-- <div class="handle-box">
				<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select>
				<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
			</div> -->
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column type="expand">
				  <template slot-scope="props">
						<div class="flexBox">
							<div class="flexBoxLeft">
								<div class="realName">{{props.row.realName}}</div>
								<img class="idCardPic" :src="props.row.idCardPic"/>
								<div class="idCard">{{props.row.idCard}}</div>
							</div>
							<div class="flexBoxRight">
								<div>用户ID：{{props.row.userId}}</div>
								<div>审核人ID：{{props.row.checkerId}}</div>
								<div>备注：{{props.row.remark||'--'}}</div>
								<!-- <img class="gesturePic" :src="props.row.gesturePic"/> -->
							</div>
						</div>
				  </template>
				</el-table-column>
				<el-table-column prop="id" label="ID" min-width="60" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="parentId" label="上级ID" min-width="100" show-overflow-tooltip></el-table-column> -->
				<el-table-column label="注册日期" min-width="80">
					<template slot-scope="scope">
						{{scope.row.registerTime | getDateYMD}}
					</template>
				</el-table-column>
				<el-table-column prop="realName" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="idCard" label="身份证号" min-width="120" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column label="是否实名" min-width="80">
					<template slot-scope="scope">
						{{scope.row.actived | activedType}}
					</template>
				</el-table-column> -->
				<el-table-column prop="mobilePhone" label="手机号" min-width="120"></el-table-column>
				<el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actived" label="审核状态" min-width="80">
					<template slot-scope="scope">
						{{scope.row.actived | activedType}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="140" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handlePass(scope.$index, scope.row)">通过</el-link>
						<i class="placeholderVertical">|</i>
						<el-button type="text" @click="handleRefuse(scope.$index, scope.row)">驳回</el-button>
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
		<el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible" fullscreen>
			<el-form ref="form" :model="form" label-width="auto" :inline="true" :disabled="visibleType=='detail'?true:false">
				<el-form-item label="注册时间">
					<el-date-picker type="datetime" placeholder="选择日期" v-model="form.registerTime" value-format="yyyy-MM-dd hh:mm:ss" class="width200" :disabled="true"></el-date-picker>
				</el-form-item>
				<el-form-item label="上级ID">
					<el-input v-model="form.parentId"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="form.nickName"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="form.realName"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="form.mobilePhone"></el-input>
				</el-form-item>
				<el-form-item label="是否激活">
					<el-input v-model="form.actived"></el-input>
				</el-form-item>
				<el-form-item label="支付宝">
					<el-input v-model="form.alipayNum"></el-input>
				</el-form-item>
				<el-form-item label="微信号">
					<el-input v-model="form.wechartNum"></el-input>
				</el-form-item>
				<div class="placeholderLine10"></div>
				<el-form-item label="上周拥有矿石">
					<el-input v-model="form.lastWeekMineral"></el-input>
				</el-form-item>
				<el-form-item label="当前拥有矿石">
					<el-input v-model="form.thisWeekMineral"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结矿石">
					<el-input v-model="form.temporaryFreezeMineral"></el-input>
				</el-form-item>
				<div class="placeholderLine10"></div>
				<el-form-item label="待释放矿石">
					<el-input v-model="form.toBeReleasedMineral"></el-input>
				</el-form-item>
				<el-form-item label="贡献值">
					<el-input v-model="form.contributionValue"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结贡献值">
					<el-input v-model="form.temporaryFreezeContribution"></el-input>
				</el-form-item>
				<div class="placeholderLine10"></div>
				<el-form-item label="算力">
					<el-input v-model="form.calculationPower"></el-input>
				</el-form-item>
				<el-form-item label="平台券">
					<el-input v-model="form.platformTicket"></el-input>
				</el-form-item>
				<el-form-item label="临时冻结平台券">
					<el-input v-model="form.temporaryFreezePlatformTicket"></el-input>
				</el-form-item>
				<div class="placeholderLine10"></div>
				<el-form-item label="买入次数">
					<el-input v-model="form.buyingTimes"></el-input>
				</el-form-item>
				<el-form-item label="卖出次数">
					<el-input v-model="form.sellingTimes"></el-input>
				</el-form-item>
				<el-form-item label="区块地址">
					<el-input v-model="form.blockAddress"></el-input>
				</el-form-item>
				<el-form-item label="被打小报告次数">
					<el-input v-model="form.beComlaintTimes"></el-input>
				</el-form-item>
				<el-form-item label="被冻结账号次数">
					<el-input v-model="form.beFrozenTimes"></el-input>
				</el-form-item>
				<el-form-item label="账号状态">
					<el-input v-model="form.accountStatus"></el-input>
				</el-form-item>
				<el-form-item label="账号冻结原因">
					<el-input v-model="form.abnormalReason"></el-input>
				</el-form-item>
				<el-form-item label="口号">
					<el-input v-model="form.slogan" class="width400"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="detailOrEditVisible = false">取 消</el-button> -->
				<el-button type="primary" icon="el-icon-edit" @click="operateBtn">冻结</el-button>
				<!-- <el-button type="danger" icon="el-icon-delete" v-show="visibleType=='detail'" @click="handleDelete(form.ID)">删除</el-button> -->
				<!-- <el-button type="primary" icon="el-icon-finished" @click="saveEdit" v-show="visibleType=='edit'">确 定</el-button> -->
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
				total: 400,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm:{
					date:"",
					actived:"",
					condition: '',
					searchContent: '',
				},
				activedOptions:[],
				orderOptions: [],
				conditionOptions: [],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,
				visibleType: 'detail',
				detailOrEditVisible: false,
				delVisible: false,
				form: {},
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
				this.currentPage = 1;
				this.orderOptions = this.$config.orderOptions;
				this.conditionOptions = this.$config.conditionOptions;
				this.activedOptions = this.$config.activedOptions4Serach;
			},
			checkedMineralDescChange() {
				console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			activedChange(val){
				this.currentPage = 1;
				this.getData();
			},
			conditionChange(val) {
				console.log('val', val)
				if(val == 0){
					
				}
			},
			searchEvent() {
				this.currentPage = 1;
				this.getData();
			},
			operateBtn() {
				//这里需要根据账号状态来判断是冻结还是解冻
				this.$message("此功能尚未开通")
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
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				console.log('searchForm',this.searchForm);
				var params = {
					pageNo:_this.currentPage,
					pageSize:_this.pageSize,
					actived: _this.searchForm.actived || 0,
					date: _this.searchForm.date,
					mobilePhone: _this.searchForm.mobilePhone
				}
				_this.$ajax.ajax(_this.$api.getAssistUserInfoPageList, 'GET', params, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
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
			handlePass(index, row) {
				let _this = this;
				_this.$confirm(`您确定要将${row.realName}审核通过吗?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					var params = {
						userId:row.userId,
						actived: 1
					}
					console.log("params",params);
					_this.$ajax.ajax(_this.$api.updateUserActivedByUserId, 'POST', params, function(res){
						console.log('updateUserActivedByUserId')
						if (res.code == _this.$api.ERR_OK) { // 200
							_this.getData();
							 _this.$message({
								type: 'success',
								message: '已通过!'
							 });
						}
					})
				}).catch(() => {
					
				});
			},
			handleRefuse(index, row) {
				let _this = this;
				_this.$prompt('请告诉对方拒绝的理由', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消'
				}).then(({ value }) => {
					var params = {
						userId:row.userId,
						actived: 2,
						remark: _this.$utils.clearSpecialStrict(value)
					}
					console.log("params",params);
					_this.$ajax.ajax(_this.$api.updateUserActivedByUserId, 'POST', params, function(res){
						console.log('updateUserActivedByUserId')
						if (res.code == _this.$api.ERR_OK) { // 200
							_this.getData();
							 _this.$message({
								type: 'success',
								message: '已拒绝!'
							 });
						}
					})
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '取消输入'
				  });       
				});
			},
			handleDelete(ID) {
				console.log('ID',ID);
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
