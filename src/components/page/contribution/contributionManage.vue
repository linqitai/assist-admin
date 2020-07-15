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
					<p class="inline">日期</p>
					<div class="inline">
						<el-date-picker class="width160" type="date" placeholder="选择日期" v-model="searchForm.date" value-format="yyyy-MM-dd"></el-date-picker>
					</div>
				</div>
				<div class="element">
					<p class="inline">用户ID</p>
					<div class="inline">
						<el-input v-model="searchForm.parentID" size="medium" placeholder="请输入搜索内容" clearable></el-input>
					</div>
				</div>
				<div class="element">
					<p class="inline">正负</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width200">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
				<!-- <div class="element">
					<p class="inline">条件查询</p>
					<div class="inline">
						<el-select v-model="searchForm.condition" @change="conditionChange" class="handle-select mr10">
							<el-option v-for="item in conditionOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="inline width160">
						<el-input v-model="searchForm.searchContent" size="medium" placeholder="请输入搜索内容" clearable></el-input>
					</div>
				</div> -->
			</search-condition>
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="id" label="ID" min-width="50" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userId" label="用户ID" min-width="210"></el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="120"></el-table-column>
				<el-table-column label="类型" min-width="80">
          <template slot-scope="props">
             <!-- | contributionType -->
          	{{ props.row.type | contributionType }}
          </template>
        </el-table-column>
				<el-table-column prop="createTime" label="时间" min-width="150"></el-table-column>
				<el-table-column prop="addOrReduce" label="正负" min-width="60"></el-table-column>
				<el-table-column prop="contributionValue" label="贡献值" min-width="90"></el-table-column>
        <el-table-column prop="currentContributionValue" label="所拥有贡献值" min-width="120"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
      <div class="transferBox">
      	<el-form ref="form4Transfer" :model="form4Transfer" :rules="rules4Transfer" label-width="110px" label-position="left">
          <el-form-item label="转让类型" prop="transferAmount">
            <el-select v-model="form4Transfer.transferType" @change="transferTypeTypeChange" class="handle-select mr10 width160">
            	<el-option v-for="item in transferTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
      	  <el-form-item label="转让数量" prop="transferAmount">
      	    <el-input type="number" v-model.number="form4Transfer.transferAmount" clearable></el-input>
      	  </el-form-item>
      	  <el-form-item label="对方手机号" prop="mobilePhone">
      	    <el-input v-model="form4Transfer.mobilePhone" clearable show-word-limit></el-input>
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
				pageIndex: 1,
				pageSizes:'',
				pageSize:'',
				currentPage: 1,
				multipleSelection: [],
				searchForm: {
					parentID:'',
					date:'',
					status: '',
					condition: '',
					searchContent: ''
				},
				status:"",
				statusOptions: [{
						id: "0",
						value: "+"
					},
					{
						id: "1",
						value: "-"
					}
				],
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
					status:'',
					name: '',
					address: ''
				},
        transferTypeOptions:[{
          id: 2,
          value: "转入"
        },{
          id: 26,
          value: "交易不发短信被投诉"
				},{
          id: 27,
          value: "解冻处罚"
				},{
          id: 28,
          value: "交易超时确认"
				},{
          id: 25,
          value: "线下志愿者奖励"
        },{
          id: 20,
          value: "全球分红"
        },{
          id: 22,
          value: "地推扶持"
        },{
          id: 21,
          value: "优秀领导人扶持"
        },{
          id: 19,
          value: "奖励津贴"
        },{
          id: 14,
          value: "诉讼成功"
        },{
          id: 4,
          value: "建议被采纳"
        },{
          id: 5,
          value: "反馈问题成功"
        }],
		form4Transfer:{
		  transferType:2,
			transferAmount:"",
			mobilePhone:"",
			safePassword:""
		},
		rules4Transfer:{
		  transferType: [
			{ required: true, message: '请选择转让类型', trigger: 'blur' },
			{ type: 'number', message: '请选择转让类型', trigger: 'blur' }
		  ],
			transferAmount: [
				{ required: true, message: '请输入转让数量', trigger: 'blur' },
				{ type: 'number', message: '请输入数字类型', trigger: 'blur' }
			],
			mobilePhone: [
				{ required: true, message: '请输入对方手机号', trigger: 'blur' },
				{ max: 11, message: '请填写正确的手机号', trigger: 'blur' }
			],
			safePassword:[
				{ required: true, message: '请输权限密码', trigger: 'blur' },
				{ min: 1, max: 20, message: '请填写正确的权限密码', trigger: 'blur' }
			]
		},
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
			// data() {
			//     return this.tableData.filter((d) => {
			//         let is_del = false;
			//         for (let i = 0; i < this.del_list.length; i++) {
			//             if (d.name === this.del_list[i].name) {
			//                 is_del = true;
			//                 break;
			//             }
			//         }
			//         if (!is_del) {
			//             if (d.address.indexOf(this.select_cate) > -1 &&
			//                 (d.name.indexOf(this.select_word) > -1 ||
			//                     d.address.indexOf(this.select_word) > -1)
			//             ) {
			//                 return d;
			//             }
			//         }
			//     })
			// }
		},
		methods: {
			initData(){
				this.pageSizes = this.$config.pageSizes;
				this.pageSize = this.$config.pageSize;
			},
			checkedMineralDescChange() {
				//console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			statusChange(val) {
				//console.log('val', val)
			},
			conditionChange(val) {
				//console.log('val', val)
			},
			searchEvent() {
				this.pageIndex = 1;
				//console.log('searchForm', this.searchForm)
				// this.getList();
			},
      transferTypeTypeChange(val){
        let _this = this;
        //console.log('val', val);
        _this.form4Transfer.transferType = val;
      },
      submit4Transfer(formName){
      	let _this = this;
      	////console.log('form4Transfer',_this.form4Transfer)
      	if(!_this.$reg.phone2.test(_this.form4Transfer.mobilePhone)){
      		_this.$message.error("手机号有误");
      		return;
      	}
      	if(!_this.$reg.safePassword.test(_this.form4Transfer.safePassword)){
      		_this.$message.error("权限密码有误");
      		return;
      	}
      	this.$refs[formName].validate((valid) => {
      		if (valid) {
      			let url = _this.$api.insertAssistContributionValue;
      			var params = _this.form4Transfer;
      			////console.log(params,'params');
      			_this.$ajax.ajax(url, 'POST', params, function(res){
      				// //console.log('res',res)
      				if (res.code == _this.$api.ERR_OK) { // 200
      					_this.$message.success("操作成功");
      					_this.currentPage = 1;
      					_this.getData();
      					//_this.$utils.formClear(_this.form4Transfer);
      				}else{
      					_this.$message.error(res.message);
      				}
      			})
      		} else {
      			//console.log('error submit!!');
      			return false;
      		}
      	});
      },
			/* cancelDealBtn() {
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
			}, */
			// 分页导航
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData();
			},
			handleSizeChange(val) {
				//console.log('size', val)
			},
			// 获取 easy-mock 的模拟数据
			getData() {
        let _this = this;
        var params = {
        	pageNo: _this.pageIndex,
        	pageSize: _this.pageSize,
        }
        _this.$ajax.ajax(_this.$api.getAssistContributionValueList, 'GET', params, function(res) {
        	////console.log('res', res);
        	if (res.code == _this.$api.ERR_OK) { // 200
        		let list = res.data.list;
        		////console.log('list', list);
        		_this.currentItemsCount = list.length;
        		_this.tableData = list;
        		_this.total = res.data.total;
        	}
        })
			}
		}
	}
</script>
