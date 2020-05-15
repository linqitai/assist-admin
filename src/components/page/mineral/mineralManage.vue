
<style scoped>
	.transferBox{
		width: 400px;
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
			<el-table :data="tableData" show-summary border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column prop="ID" label="账本ID" min-width="80"></el-table-column>
				<el-table-column prop="date" label="用户ID" min-width="150"></el-table-column>
				<el-table-column prop="date" label="类型" min-width="150"></el-table-column>
				<el-table-column prop="date" label="时间" min-width="150"></el-table-column>
				<el-table-column prop="date" label="正负" min-width="150"></el-table-column>
				<el-table-column prop="ID" label="矿石" min-width="150"></el-table-column>
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
			<div class="transferBox">
        <el-form-item label="回收矿石">
        </el-form-item>
				<el-form ref="form4Transfer" :model="form4Transfer" :rules="rules4Transfer" label-width="110px" label-position="left">
			    <el-form-item label="回收类型" prop="transferAmount">
			      <el-select v-model="form4Transfer.transferType" @change="transferTypeTypeChange" class="handle-select mr10 width160">
			      	<el-option v-for="item in transferTypeOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
			      </el-select>
			    </el-form-item>
				  <el-form-item label="回收数量" prop="transferAmount">
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

		<!-- 详情编辑弹出框 -->
		<el-dialog :title="visibleType=='detail'?'详情':'编辑'" :visible.sync="detailOrEditVisible" fullscreen>
			<el-form ref="form" :model="form" label-width="auto" :inline="true" :disabled="visibleType=='detail'?true:false">
				<el-form-item label="ID">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="买家手机号">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="卖家ID">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="卖家手机号">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="交易类型">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="交易数量">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="交易单价">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="交易状态">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="挂单时间">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="匹配时间">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="放币时间">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="form.address" class="width400"></el-input>
				</el-form-item>
				<el-form-item label="付款截图">
					<div class="imageBox">
						<el-image class="item" :preview-src-list="imagesList" v-for="item in imagesList" :key="item" :src="item" fit="cover"
						 lazy></el-image>
					</div>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="detailOrEditVisible = false">取 消</el-button> -->
				<el-button type="default" icon="el-icon-edit" @click="cancelDealBtn">取消交易</el-button>
				<el-button type="primary" icon="el-icon-edit" @click="sellerSureBtn">帮卖方确认</el-button>
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
				imagesList: [
					'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
					'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
				],
				images: [{
						id: '1',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
					{
						id: '2',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
					{
						id: '3',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
					{
						id: '4',
						url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					},
				],
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
				adressWidth: '200px',
				idx: -1,
				checkedMineralDesc: false,
        form4Transfer:{
          transferType:8,
        	transferAmount:"",
        	mobilePhone:"",
        	safePassword:""
        },
        transferTypeOptions:[{
          id: 8,
          value: "竞拍服务商"
        },{
          id: 10,
          value: "矿机异常"
        },{
          id: 11,
          value: "账号异常"
        },{id:12,value:'系统回收'}],
        rules4Transfer:{
          transferType: [
        	{ required: true, message: '请选择回收类型', trigger: 'blur' },
        	{ type: 'number', message: '请选择回收类型', trigger: 'blur' }
          ],
        	transferAmount: [
        		{ required: true, message: '请输入回收数量', trigger: 'blur' },
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
			},
      transferTypeTypeChange(val){
        let _this = this;
        console.log('val', val);
        _this.form4Transfer.transferType = val;
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
			},
      submit4Transfer(formName){
      	let _this = this;
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
      			let url = _this.$api.recycleMineral;
      			var params = _this.form4Transfer;
      			_this.$ajax.ajax(url, 'POST', params, function(res){
      				if (res.code == _this.$api.ERR_OK) { // 200
      					_this.$message.success("转让成功");
      					_this.currentPage = 1;
      					_this.getData();
      				}else{
      					_this.$message.error(res.message);
      				}
      			})
      		} else {
      			return false;
      		}
      	});
      },
			sellerSureBtn(){
				this.$confirm('此操作将帮卖方确认, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '确认成功'
					});
					this.detailOrEditVisible = false;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '我再考虑考虑'
					});
				});
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
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData();
			},
			handleSizeChange(val) {
				console.log('size', val)
			},
			getData() {
				if (process.env.NODE_ENV === 'development') {
					this.url = '/ms/table/list';
				};
				this.searchForm.condition = this.$route.query.condition;
				this.searchForm.parentID = this.$route.query.id;
				this.searchForm.searchContent = this.$route.query.id;
				this.searchForm.status = this.$route.query.status;
				console.log('searchForm',this.searchForm);
				this.tableData = [{
					ID: 1,
					date: '2016-05-02',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1518 弄',
					zip: 200333
				}, {
					ID: 2,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333
				}, {
					ID: 3,
					date: '2016-05-01',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1519 弄',
					zip: 200333
				}, {
					ID: 4,
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1516 弄',
					zip: 200333
				}, {
					ID: 5,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333
				}, {
					ID: 6,
					date: '2016-05-01',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1519 弄',
					zip: 200333
				}, {
					ID: 7,
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1516 弄',
					zip: 200333
				}, {
					ID: 8,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333,
					remark: "上海市普陀区金沙江路 1517 弄上弄上弄上"
				}, {
					ID: 9,
					date: '2016-05-03',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1516 弄',
					zip: 200333
				}, {
					ID: 10,
					date: '2016-05-04',
					name: '王小虎',
					region: '上海',
					city: '普陀区',
					address: '上海市普陀区金沙江路 1517 弄',
					zip: 200333,
					remark: "上海市普陀区金沙江路 1517 弄上弄上弄上"
				}]
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
				console.log("此处要转跳到矿石流通记录表")
				console.log('row.ID',row.ID)
				this.$router.push({path:'circulationRecords',query:{condition:'矿石账本ID',id:row.ID}})
				// this.visibleType = 'detail';
				// this.idx = index;
				// const item = this.tableData[index];
				// this.form = {
				// 	name: item.name,
				// 	date: item.date,
				// 	address: item.address
				// }
				// this.detailOrEditVisible = true;
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
