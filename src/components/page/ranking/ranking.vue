<style lang="scss" scoped>
	.el-card__body{padding: 10px !important;}
	.titleCard {
		margin-bottom: 10px;
	}
	.list{
		.item{
			font-size: 0.875rem;
			color: #646464;
			margin: 5px 0;
			border-bottom: 1px solid #c7c7c7;
			overflow: hidden;
			justify-content: space-between;
			align-content: center;
			align-items: center;
			display: flex;
			flex-direction: row;
			cursor: pointer;
			span{
				margin-left: 5px;
				float: left;
				&::first-child{
					margin-left: 0px;
				}
			}
			i{
				float: right;
				font-size: 10px;
			}
		}
	}
</style>
<template>
	<div class="ranking">
		<div class="titleCard">总排名</div>
		<el-row :gutter="10">
			<el-col :span="allRankingSpan">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>推广注册人数排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="teamateNumList" border stripe class="table" style="width: 100%" @row-click="toUserManage">
            <el-table-column prop="userId" label="用户ID" min-width="50" show-overflow-tooltip></el-table-column>
						<el-table-column prop="nickName" label="用户昵称" min-width="50" show-overflow-tooltip></el-table-column>
						<el-table-column prop="realName" label="姓名" min-width="40" show-overflow-tooltip></el-table-column>
						<el-table-column prop="mobilePhone" label="手机号" min-width="40" show-overflow-tooltip></el-table-column>
						<el-table-column prop="num" label="人数" min-width="20"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
      <el-col :span="allRankingSpan">
      	<el-card shadow="hover" class="mgb20">
      		<div slot="header" class="clearfix">
      			<span>无效直推排名</span>
      			<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      		</div>
      		<el-table :data="noRealNameNumList" border stripe class="table" style="width: 100%" @row-click="toUserManage">
            <el-table-column prop="userId" label="用户ID" min-width="50" show-overflow-tooltip></el-table-column>
      			<el-table-column prop="nickName" label="用户昵称" min-width="50" show-overflow-tooltip></el-table-column>
      			<el-table-column prop="realName" label="姓名" min-width="40" show-overflow-tooltip></el-table-column>
      			<el-table-column prop="mobilePhone" label="手机号" min-width="40" show-overflow-tooltip></el-table-column>
      			<el-table-column prop="num" label="人数" min-width="20"></el-table-column>
      		</el-table>
      	</el-card>
      </el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				allRankingSpan: 12,
				shareList:[
					{
						ID:1,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:2,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:3,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:4,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:5,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:6,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:7,
						name:'张三',
						phone:'13958777878',
						count:'181'
					},
					{
						ID:8,
						name:'张三',
						phone:'13958777878',
						count:'181'
					}
				],
        teamateNumList:[],
        noRealNameNumList:[],
			}
		},
    created() {
      let _this = this;
      _this.getRanking();
      _this.getRanking4NoRealNameNum();
    },
		methods:{
      getRanking(){
      	let _this = this;
      	var params = {
      		pageNo: 1,
      		pageSize: 10,
      		type:'teamate_num'
      	}
      	_this.$ajax.ajax(_this.$api.getRanking, 'GET', params, function(res) {
      		if (res.code == _this.$api.ERR_OK) {
            _this.teamateNumList = res.data.list;
      		}
      	})
      },
      getRanking4NoRealNameNum(){
        let _this = this;
        var params = {
          pageNo: 1,
          pageSize: 10,
        }
        _this.$ajax.ajax(_this.$api.getRanking4NoRealNameNum, 'GET', params, function(res) {
          if (res.code == _this.$api.ERR_OK) {
            _this.noRealNameNumList = res.data.list;
          }
        })
      },
			toMineralManage(row, column, event){
				this.$router.push({path:'mineralManage',query:{condition:'用户ID',id:row.ID}})
				// this.$router.push({path:'userManage',query:{condition:'上级ID',id:id}})
			},
			toUserManage(row, column, event){
				this.$router.push({path:'userManage',query:{condition:'上级ID',id:row.ID}})
				// this.$router.push({path:'userManage',query:{condition:'上级ID',id:id}})
			},
			toContributionManage(row, column, event){
				console.log("row",row);
				this.$router.push({path:'contributionManage',query:{condition:'用户ID',id:row.ID}})
			},
			toContributionManage4sub(row, column, event){
				console.log("row",row);
				this.$router.push({path:'contributionManage',query:{condition:'用户ID',id:row.ID,status:'-'}})
			},
			toContributionManage4add(row, column, event){
				this.$router.push({path:'contributionManage',query:{condition:'用户ID',id:row.ID,status:'+'}})
			}
		}
	}
</script>
