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
		<div class="titleCard">每日排名</div>
		<el-row :gutter="6">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>推广排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%" @row-click="toUserManage">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="35"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="55"></el-table-column>
						<el-table-column prop="count" label="人数" min-width="30"></el-table-column>
					</el-table>
					<!-- <div class="list">
						<div class="item" v-for="item in shareList" :key="item.ID" @click="toUserManage(item.ID)">
							<span>用户ID:{{item.ID}}</span>
							<span>姓名:{{item.name}}</span>
							<span>手机号:{{item.phone}}</span>
							<span>人数:{{item.count}}</span>
							<i class="el-icon-arrow-right"></i>
						</div>
					</div> -->
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>所加贡献值排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%" @row-click="toContributionManage4add">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="35"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="55"></el-table-column>
						<el-table-column prop="count" label="贡献值" min-width="30"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>所减贡献值排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%" @row-click="toContributionManage4sub">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="35"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="55"></el-table-column>
						<el-table-column prop="count" label="贡献值" min-width="30"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
		<div class="titleCard">总排名</div>
		<el-row :gutter="20">
			<el-col :span="allRankingSpan">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>推广排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%" @row-click="toUserManage">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="40"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="50"></el-table-column>
						<el-table-column prop="count" label="人数" min-width="40"></el-table-column>
					</el-table>
					<!-- <div class="list">
						<div class="item" v-for="item in shareList" :key="item.ID" @click="toContributionManage(item.ID,'-')">
							<span>用户ID:{{item.ID}}</span>
							<span>姓名:{{item.name}}</span>
							<span>手机号:{{item.phone}}</span>
							<span>贡献值:{{item.count}}</span>
							<i class="el-icon-arrow-right"></i>
						</div>
					</div> -->
				</el-card>
			</el-col>
			<el-col :span="allRankingSpan">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>拥有矿石排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%" @row-click="toMineralManage">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="40"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="50"></el-table-column>
						<el-table-column prop="count" label="矿石" min-width="40"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="allRankingSpan">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>拥有贡献值排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%" @row-click="toContributionManage">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="35"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="50"></el-table-column>
						<el-table-column prop="count" label="贡献值" min-width="30"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="allRankingSpan">
				<el-card shadow="hover" class="mgb20">
					<div slot="header" class="clearfix">
						<span>拥有算力排名</span>
						<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
					</div>
					<el-table :data="shareList" border stripe class="table" style="width: 100%">
						<el-table-column prop="ID" label="用户ID" min-width="30"></el-table-column>
						<el-table-column prop="name" label="姓名" min-width="35"></el-table-column>
						<el-table-column prop="phone" label="手机号" min-width="55"></el-table-column>
						<el-table-column prop="count" label="算力" min-width="30"></el-table-column>
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
				]
			}
		},
		methods:{
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
