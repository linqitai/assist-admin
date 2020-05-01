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
					<p class="inline">匹配时间</p>
					<div class="inline">
						<el-date-picker class="width160" @change="datePickerChange" type="date" placeholder="选择日期" v-model="searchForm.machingTime" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div>
				<div class="element">
					<p class="inline">交易状态查询</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width160">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</div>
				</div>
				<div class="element">
					<p class="inline">条件查询</p>
					<div class="inline">
						<el-select v-model="searchForm.condition" @change="conditionChange" class="handle-select mr10">
							<el-option v-for="item in conditionOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="inline width220">
						<el-input v-model="searchForm.searchContent" size="medium" placeholder="请输入搜索内容" clearable></el-input>
					</div>
				</div>
				<div class="element">
					<div class="inline">
						<!-- <el-checkbox v-model="checkedMineralDesc" @change="checkedMineralDescChange">按拥有矿石量降序</el-checkbox> -->
					</div>
				</div>
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="ID" width="50" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="buyerId" label="买家ID" width="190"></el-table-column>
				<el-table-column prop="sellerId" label="卖家ID" width="190"></el-table-column> -->
				<el-table-column prop="nickName" label="卖家昵称" min-width="120"></el-table-column>
				<el-table-column prop="realName" label="卖家姓名" min-width="120"></el-table-column>
				<el-table-column prop="mobilePhone" label="卖家手机号" min-width="120"></el-table-column>
				<el-table-column prop="buyerPhone" label="买家手机号" min-width="120"></el-table-column>
				<el-table-column prop="type" label="交易类型" min-width="100">
					<template slot-scope="props">
						{{ props.row.type | dealType }}
					</template>
				</el-table-column>
				<el-table-column prop="num" label="交易数量" min-width="90"></el-table-column>
				<el-table-column prop="price" label="交易单价" min-width="90"></el-table-column>
				<el-table-column prop="hangBillTime" label="挂单时间" min-width="180"></el-table-column>
				<el-table-column prop="machingTime" label="匹配时间" min-width="180" fixed="right"></el-table-column>
				<el-table-column prop="coinReleaseTime" label="放币时间" min-width="180"></el-table-column>
				<el-table-column prop="status" label="交易状态" min-width="100" fixed="right">
					<template slot-scope="props">
						<span class="ellipsis" :class="textColor(props.row.status)">{{ props.row.status | dealStatusType }}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注" width="200">
					<template slot-scope="props">
						<span class="ellipsis">{{ props.row.remark }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="90" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
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
		<el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible" width="80%">

			<!-- <el-form-item label="备注">
				<el-input type="textarea" v-model="" class="width400"></el-input>
			</el-form-item> -->
			<!-- <el-image class="item" :preview-src-list="imagesList" v-for="item in imagesList" :key="item" :src="item" fit="cover"
			 lazy></el-image> -->
       <el-form ref="form" label-width="auto" :inline="false">
       	<div>ID:{{form.id}}</div>
       	<div>买家ID:{{form.buyerId}}</div>
       	<div>卖家ID:{{form.sellerId}}</div>
       	<div>卖家昵称:{{form.nickName}}</div>
       	<div>卖家姓名:{{form.realName}}</div>
       	<div>卖家手机号:{{form.mobilePhone}}</div>
        <div>买家手机号:{{form.buyerPhone}}</div>
       	<div>交易类型:{{form.type | dealType}}</div>
       	<div>交易数量:{{form.num}}</div>
       	<div>交易单价:{{form.price}}</div>
       	<div class="red">交易状态:{{form.status | dealStatusType}}</div>
       	<div>挂单时间:{{form.hangBillTime}}</div>
       	<div>匹配时间:{{form.machingTime}}</div>
        <div>放币时间:{{form.coinReleaseTime||'--'}}</div>
       	<div>可确认时间:{{form.letSureTime||'--'}}</div>
        <div>可取消时间:{{form.canCancelTime||'--'}}</div>
        <!-- <div>取消交易时间:{{form.canCancelTime||'--'}}</div> -->
       	<div>备注:{{form.remark}}</div>
       	<div>
       		<div>打款凭证:</div>
       		<div v-if="form.status==4 || form.status==5 || form.status==8">
       			<img class="selectedImg" :src="form.imgUrl"/>
       		</div>
       	</div>
        <el-form-item label="交易状态" class="block">
        	 <!-- @change="conditionChange" -->
          <el-select v-model="form4Update.status" @change="status4UpdateChange">
            <el-option v-for="item in statusOptions4Update" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="留言" class="block">
          <el-input v-model="form4Update.remark" size="medium" type="textarea" :rows="2" placeholder="留言内容" clearable></el-input>
        </el-form-item>
       	<el-form-item label="贡献值" class="block" v-if="checked">
       		<el-input-number v-model="addContributionValue" :min="0" :max="10" label="请填写所要给于奖励的贡献值"></el-input-number>
       	</el-form-item>
       </el-form>
       <el-checkbox v-model="checked">是否给于买家奖励</el-checkbox>
       <div class="placeholderLine10"></div>
       <div class="placeholderLine10"></div>
			<span slot="footer" class="dialog-footer center">
				<el-button type="default" icon="el-icon-edit" @click="cancelDealBtn(form)">取消交易</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="sellerSureBtn(form)">帮卖方确认</el-button>
				<el-button type="default" icon="el-icon-edit" @click="saveDealStatusBtn(form)">保存修改</el-button>
        <!-- <el-button v-if="form.status==5" type="default" icon="el-icon-edit" @click="cancelDealBtn(form)">取消交易</el-button> -->
				<!-- <el-button type="primary" icon="el-icon-edit" @click="sellerSureBtn">帮卖方确认</el-button> -->
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
        form4Update:{
          status:2,
          remark:''
        },
        addContributionValue:0,
				url: '',
				tableData: [],
				total: 400,
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					machingTime:'',
					status: '',
					condition: '',
					searchContent: ''
				},
				status:"",
				statusOptions: [],
        statusOptions4Update: [
          {id:0,value:'待付款'},{id:2,value:'待确认'}
        ],
				conditionOptions: [
					{
						id: "",
						value: "无"
					},
					{
						id: "0",
						value: "订单ID"
					},
					{
						id: "1",
						value: "买家ID"
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
					status:'',
					name: '',
					address: ''
				},
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
        checked:false
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
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
				this.statusOptions= this.$config.dealStatusOptions;
			},
			textColor(status){
				if(status==5){
					return 'red';
				}else if(status == 8){
					return 'green';
				}else if(status==3){
					return 'textAdorn';
				}
			},
			checkedMineralDescChange() {
				//console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			datePickerChange(val){
				let _this = this;
				//console.log(val);
				_this.searchForm.machingTime = val;
				_this.currentPage = 1;
				_this.getData();
			},
      status4UpdateChange(val){
        let _this = this;
        //console.log('val', val);
        _this.form4Update.status = val;
      },
			statusChange(val) {
				let _this = this;
				//console.log('val', val);
				_this.searchForm.status = val;
				_this.currentPage = 1;
				//console.log('_this.searchForm',_this.searchForm);
				_this.getData();
			},
			conditionChange(val) {
				let _this = this;
				//console.log('val', val);
				_this.searchForm = _this.$utils.formClear(_this.searchForm);
				_this.searchForm.condition = val;
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				let _this = this;
				var params = {
					pageNo:_this.currentPage,
					pageSize:_this.pageSize,
					status: _this.searchForm.status,
					machingTime:_this.searchForm.machingTime,
					id:_this.searchForm.id,
					buyerId:_this.searchForm.buyerId,
					sellerId:_this.searchForm.sellerId,
					mobilePhone:_this.searchForm.mobilePhone,
				}
				//console.log(params,'params');
				_this.$ajax.ajax(_this.$api.getAssistTransactionListByPage, 'GET', params, function(res){
					// //console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.tableData = res.data.list;
						_this.total = res.data.total;
					}
				})
			},
			searchEvent() {
				let _this = this;
				_this.currentPage = 1;
				//console.log('searchForm', _this.searchForm)
				if(_this.searchForm.condition=='选择'){

				}else if(_this.searchForm.condition == '订单ID'){
					_this.searchForm.id = _this.searchForm.searchContent;
				}else if(_this.searchForm.condition == '买家ID'){
					_this.searchForm.buyerId = _this.searchForm.searchContent;
				}else if(_this.searchForm.condition == '卖家ID'){
					_this.searchForm.sellerId = _this.searchForm.searchContent;
				}else if(_this.searchForm.condition == '卖家手机号'){
					_this.searchForm.mobilePhone = _this.searchForm.searchContent;
				}
				_this.getData();
			},
			sellerSureBtn(form){
        let _this = this;
				_this.$confirm('此操作将帮卖方确认, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          //console.log("sure");
          let params = {
          	id:form.id
          }
          _this.$ajax.ajax(_this.$api.sureDeal4SellerById, 'POST', params, function(res){
          	// //console.log('res',res)
          	if (res.code == _this.$api.ERR_OK) { // 200
          		_this.$message({
          			type: 'success',
          			message: '确认成功'
          		});
          		_this.detailOrEditVisible = false;
          		_this.getData();
          	}else{
          		_this.$message({
          			type: 'info',
          			message: res.message
          		});
          	}
          })
					_this.$message({
						type: 'success',
						message: '确认成功'
					});
					_this.detailOrEditVisible = false;
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '我再考虑考虑'
					});
				});
			},
      saveDealStatusBtn(){
        let _this = this;
        _this.$confirm('此操作将修改此单交易信息与状态, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
        	let params = {
        		id:_this.form.id,
        		status:_this.form4Update.status,
        		remark:_this.form4Update.remark
        	}
        	//console.log('params',params);
        	_this.$ajax.ajax(_this.$api.updateTransactionInfo, 'POST', params, function(res){
        		// //console.log('res',res)
        		if (res.code == _this.$api.ERR_OK) { // 200
        			_this.$message({
        				type: 'success',
        				message: '修改成功'
        			});
        			_this.detailOrEditVisible = false;
        			_this.getData();
        		}else{
        			_this.$message({
        				type: 'info',
        				message: res.message
        			});
        		}
        	})
        }).catch(() => {
        	this.$message({
        		type: 'info',
        		message: '我再考虑考虑'
        	});
        });
      },
			cancelDealBtn(form) {
				let _this = this;
				_this.$confirm('此操作将取消此单交易, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          if(!_this.checked){
            _this.addContributionValue = 0.00;
          }
					let params = {
						id:form.id,
						buyerId:form.buyerId,
						sellerId:form.sellerId,
            addContributionValue:_this.addContributionValue.toFixed(2)
					}
					//console.log('params',params);

					_this.$ajax.ajax(_this.$api.cancelAssistTransactionById, 'POST', params, function(res){
						// //console.log('res',res)
						if (res.code == _this.$api.ERR_OK) { // 200
							_this.$message({
								type: 'success',
								message: '取消成功'
							});
							_this.detailOrEditVisible = false;
							_this.getData();
						}else{
							_this.$message({
								type: 'info',
								message: res.message
							});
						}
					})
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
				//console.log('size', val)
				this.currentPage = 1;
				this.pageSize = val;
				this.getData();
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
				this.form = row;
        this.form4Update.status = row.status;
        this.form4Update.remark = row.remark;
				this.detailOrEditVisible = true;
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
				//console.log('ID', ID);
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
	.selectedImg{
		width: 300px;
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
