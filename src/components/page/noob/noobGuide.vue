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
				<div class="element">
					<p class="inline">是否发布</p>
					<div class="inline">
						<el-select v-model="searchForm.status" @change="statusChange" class="handle-select mr10 width120">
							<el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
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
				<el-table-column prop="ID" label="ID" width="80"></el-table-column>
				<el-table-column prop="date" label="创建时间"  min-width="120"></el-table-column>
				<el-table-column prop="date" label="修改时间"  min-width="120"></el-table-column>
				<el-table-column prop="date" label="标题" show-overflow-tooltip min-width="200"></el-table-column>
				<el-table-column prop="date" label="内容" show-overflow-tooltip min-width="200"></el-table-column>
				
				
				<el-table-column label="操作" min-width="150" align="center" fixed="right">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
						<i class="placeholderVertical">|</i>
						<el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
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
		<el-dialog title="详情" :visible.sync="detailVisible" width="420px">
			<el-form ref="form" :model="form" label-width="auto">
				<el-form-item label="创建时间">
					<label for="">{{form.date}}</label>
				</el-form-item>
				<el-form-item label="修改时间">
					<label for="">{{form.date}}</label>
				</el-form-item>
				<el-form-item label="标题">
					<label for="">{{form.title}}</label>
				</el-form-item>
				<el-form-item label="内容">
					<div v-html="form.content"></div>
				</el-form-item>
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
				replyContent:''
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
			isPublishChange(row){
				console.log('isPublish',row.isPublish);
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
				this.pageIndex = 1;
				console.log('searchForm', this.searchForm)

				// this.getList();
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
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				if (process.env.NODE_ENV === 'development') {
					this.url = '/ms/table/list';
				};
				// this.$axios.post(this.url, {
				//     page: this.cur_page
				// }).then((res) => {
				//     this.tableData = res.data.list;
				// })
				this.tableData = [{
					ID: 1,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:1,
				}, {
					ID: 2,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:0,
				}, {
					ID: 3,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
				}, {
					ID: 4,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:1,
				}, {
					ID: 5,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:0,
				}, {
					ID: 6,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:1,
				}, {
					ID: 7,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:0,
				}, {
					ID: 8,
					date: '2016-05-01',
					title:'投票通知',
					content:'<i>请大家认真投票</i>',
					isPublish:0,
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
				this.visibleType = 'detail';
				this.detailVisible = true;
				this.form = row;
				// this.idx = index;
				// console.log('index',index)
				// console.log('row.id',row.ID)
				// this.$store.commit('setMerchantId',row.ID)
				// console.log('getMerchantId',this.$store.state.merchantId)
				// this.$router.push('/shopOrderManage')
			},
			addBtn() {
				window.open('/#/operateGuide?type=add','_blank')
				// this.$router.push({path:'/operateGuide',query:{type:'add'}});
				// this.visibleType = 'add';
				// this.addOrEditVisible = true;
				// this.form={
				// 	title: '',
				// 	content: '',
				// 	isPublish: false
				// }
			},
			handleEdit(index, row) {
				console.log('editRow',row);
				localStorage.setItem('noticeRow',JSON.stringify(row));
				// this.$router.push({path:'/operateGuide',query:{type:'edit'}});
				window.open('/#/operateGuide?type=edit','_blank')
				// this.visibleType = 'edit';
				// this.idx = index;
				// const item = this.tableData[index];
				// this.form = {
				// 	name: item.name,
				// 	date: item.date,
				// 	address: item.address
				// }
				// this.addOrEditVisible = true;
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
				this.addOrEditVisible = false;
				this.$message.success(`修改 ${this.form.name} 信息成功`);
			},
			// 确定删除
			deleteRow() {
				this.tableData.splice(this.idx, 1);
				this.$message.success('删除成功');
				this.delVisible = false;
				this.addOrEditVisible = false;
			}
		}
	}
</script>

<style scoped>
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
