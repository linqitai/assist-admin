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
			width: 150px;
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
			<el-table :data="tableData" border stripe class="table" ref="multipleTable" style="width: 100%">
				<el-table-column type="expand">
				  <template slot-scope="props">
						<div class="flexBox">
							<div class="flexBoxLeft" v-if="props.row.pic">
                <el-image
                    style="width: 60px; height: 80px"
                    v-for="(item,index) in props.row.headPic.split('|')" :src="item" :key="index"
                    :preview-src-list="props.row.headPic.split('|')">
                  </el-image>
                <el-image
                    style="width: 60px; height: 80px"
                    v-for="(item,index) in props.row.pic.split('|')" :src="item" :key="index"
                    :preview-src-list="props.row.pic.split('|')">
                  </el-image>
							</div>
							<div class="flexBoxRight">
								<div>用户ID：{{props.row.userId}}</div>
								<div>标题：{{props.row.title}}</div>
								<div>故事：{{props.row.story||'--'}}</div>
							</div>
						</div>
				  </template>
				</el-table-column>
				<el-table-column prop="id" label="ID" min-width="30" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="提交时间" min-width="160"></el-table-column>
				<el-table-column prop="realName" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="昵称" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobilePhone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="needMineral" label="需要多少矿石" min-width="100"></el-table-column>
        <el-table-column prop="needTicket" label="需要多少券" min-width="100"></el-table-column>
        <el-table-column prop="getedTicket" label="已经筹到多少券" min-width="120"></el-table-column>
        <el-table-column prop="beHelpTimes" label="被帮扶次数" min-width="80"></el-table-column>
        <el-table-column prop="teamCalculationPower" label="团队算力" min-width="90"></el-table-column>
        <el-table-column prop="remark" label="驳回原因" min-width="200"></el-table-column>
        <el-table-column label="状态" width="100">
        	<template slot-scope="scope">
        		{{scope.row.status | filterStatus}}
        	</template>
        </el-table-column>
        <el-table-column label="是否显示" width="120" fixed="right">
        	<template slot-scope="scope">
        		<el-switch
        		  v-model="scope.row.isShow"
        		  active-color="#ffae00"
        		  inactive-color="#c7c7c7"
        		  active-text="是"
        		  inactive-text="否"
        		  @change="isShowChange(scope.row)">
        		</el-switch>
        	</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link> |
            <!-- <el-button type="text" icon="el-icon-view" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
          	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-link type="primary" @click="deleteRaiseByRaiseId(scope.row)">删除</el-link>
          </template>
        </el-table-column>
        <!-- <el-table-column label="设置" width="120" fixed="right">
          <template slot-scope="scope">
            <el-select v-model="scope.row.status" @change="statusChange">
              <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column> -->
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

				<el-form-item label="用户名">
					<el-input v-model="form.nickName"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="form.realName"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="form.mobilePhone"></el-input>
				</el-form-item>
        <el-form-item label="图片张数">
        	<el-input v-model="form.picNum"></el-input>
        </el-form-item>
        <div class="placeholderLine10"></div>
				<el-form-item label="所需券">
					<el-input v-model="form.needTicket"></el-input>
				</el-form-item>
        <el-form-item label="所需矿石">
        	<el-input v-model="form.needMineral"></el-input>
        </el-form-item>
				<el-form-item label="团队算力">
					<el-input v-model="form.teamCalculationPower"></el-input>
				</el-form-item>
				<el-form-item label="标题">
					<el-input v-model="form.title"></el-input>
				</el-form-item>
        <div class="placeholderLine10"></div>
				<el-form-item label="故事">
					<el-input v-model="form.story"
            class="width800"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 16}">
          </el-input>
				</el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" @change="statusChange">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div class="placeholderLine10"></div>
        <el-form-item label="驳回原因">
        	<el-input v-model="form.remark"
            class="width800"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3}">
          </el-input>
        </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer center">
				<!-- <el-button @click="detailOrEditVisible = false">取 消</el-button> -->
        <el-button type="primary" icon="el-icon-finished" @click="saveEdit" v-show="visibleType=='edit'">确 定</el-button>
				<!-- <el-button type="primary" icon="el-icon-edit" @click="operateBtn">冻结</el-button> -->
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
				checkedMineralDesc: false,
        picList:'',
        url:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        srcList:[
                  'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                  'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ]
			}
		},
		components: {
			searchCondition
		},
    filters: {
    	filterStatus(val) {
    		//0-待审核 1-审核通过 2-排队中 3-筹款中 4-筹款结束
    		var result = '';
    		if (val == 0) {
    			result = '待审核';
    		}else if (val == 1) {
    			result = '审核通过';
    		}else if (val == 2) {
    			result = '排队中';
    		}else if (val == 3) {
    			result = '筹款中';
    		}else if (val == 4) {
    			result = '筹款结束';
    		}else if (val == 5) {
					result = '投票中';
        }else if (val == 6) {
          result = '待拜访';
        }else if (val == 7) {
          result = '被驳回';
        }
    		return result;
    	}
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
				this.currentPage = 1;
				this.orderOptions = this.$config.orderOptions;
				this.statusOptions = this.$config.statusOptions;
				this.activedOptions = this.$config.activedOptions4Serach;
			},
			checkedMineralDescChange() {
				//console.log('checkedMineralDesc', this.checkedMineralDesc)
			},
			activedChange(val){
				this.currentPage = 1;
				this.getData();
			},
      handleEdit(index, row) {
        this.visibleType = 'edit';
        this.form = row;
        this.detailOrEditVisible = true;
      },
      saveEdit() {
        let _this = this;
        var params = {
        	id:_this.form.id,
          title:_this.form.title,
          story:_this.form.story,
          needTicket:_this.form.needTicket,
          needMineral:_this.form.needMineral,
          picNum:_this.form.picNum,
          remark:_this.form.remark
        }
        _this.$ajax.ajax(_this.$api.updateRaiseInfo, 'POST', params, function(res){
        	// console.log('res',res)
        	if (res.code == _this.$api.ERR_OK) { // 200
        		_this.$message.success('操作成功');
            this.detailOrEditVisible = false;
        	}
        })
      },
			statusChange(val) {
				let _this = this;
				var params = {
					status:val,
					raiseId:_this.form.id
				}
				_this.$ajax.ajax(_this.$api.updateStatus, 'POST', params, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success('操作成功');
					}
				})
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
				//console.log('size', val)
				this.currentPage = 1;
				this.pageSize = val;
				this.getData();
			},
      deleteRaiseByRaiseId(item){
        let _this = this;
        _this.$confirm(`您确定要将ID为${item.id}的帮扶筹删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	var params = {
        		raiseId:item.id
        	}
        	_this.$ajax.ajax(_this.$api.deleteRaiseByRaiseId, 'POST', params, function(res){
        		// //console.log('res',res)
        		if (res.code == _this.$api.ERR_OK) { // 200
        			 _this.$message.success('操作成功');
               _this.getData();
        		}else{
        	    _this.$message.error('操作失败');
        	  }
        	})
        }).catch(() => {

        });
      },
			getData() {
				let _this = this;
				//console.log('searchForm',this.searchForm);
				var params = {
					pageNo:_this.currentPage,
					pageSize:_this.pageSize,
					/* actived: _this.searchForm.actived || 0,
					date: _this.searchForm.date,
					mobilePhone: _this.searchForm.mobilePhone */
				}
				_this.$ajax.ajax(_this.$api.getAssistRaiseListPage, 'GET', params, function(res){
					// //console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						 let list = res.data.list;
             for(let i=0;i<list.length;i++){
               list[i].isShow = list[i].isShow?true:false;
             }
             _this.tableData = list;
						_this.total = res.data.total;

					}
				})

			},
      getPicArray(getPicArray){
        let _this = this;
        let picArr = getPicArray.split('|');
        let picList = [];
        for(let i = 0;i<picArr.length;i++) {
          let item = {
            id:i,
            img:picArr[i]
          }
        }
        picList.push(item);
        //_this.picList = picList;
        return picList;
      },
      isShowChange(row){
      	let _this = this;
      	var params = {
      		isShow:row.isShow?1:0,
      		raiseId:row.id
      	}
      	_this.$ajax.ajax(_this.$api.updateIsShow, 'POST', params, function(res){
      		// console.log('res',res)
      		if (res.code == _this.$api.ERR_OK) { // 200
      			_this.$message.success('操作成功');
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
					//console.log("params",params);
					_this.$ajax.ajax(_this.$api.updateUserActivedByUserId, 'POST', params, function(res){
						//console.log('updateUserActivedByUserId')
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
					//console.log("params",params);
					_this.$ajax.ajax(_this.$api.updateUserActivedByUserId, 'POST', params, function(res){
						//console.log('updateUserActivedByUserId')
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
				//console.log('ID',ID);
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
