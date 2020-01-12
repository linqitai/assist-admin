<style scoped lang="scss">
	.container{
		overflow-y: auto;
		position: absolute;
		top: 2.5rem;
		bottom: 0;
	}
	// .editor{
	// 	height: 200px !important;
	// }
    .editor-btn{
        margin-top: 20px;
    }
	.ql-editor{
		min-height: 200px !important;
	}
	.ql-container{
		min-height: 200px !important;
	}
	.selectType{
		margin-top: 0.625rem;
	}
	.answerBox{
		margin-top: 0.625rem;
		.answer{
			margin-top: 0.625rem;
		}
	}
</style>
<template>
	<div class="operateBox">
		<div class="crumbs margL10">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-calendar"></i>投票管理</el-breadcrumb-item>
				<el-breadcrumb-item>{{type=='edit'?'编辑投票':'新增投票'}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form :model="form" :rules="rules" ref="form" label-width="auto" class="demo-ruleForm margT10">
				<el-form-item label="标题" prop="title">
					<el-input v-model="form.title" placeholder='请输入投票标题'></el-input>
				</el-form-item>
				<el-form-item label="截止时间" prop="cutOffDate">
					<el-date-picker class="width200" type="datetime" placeholder="选择时间" v-model="form.cutOffDate" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="问题" prop="question">
					<quill-editor class="editor" ref="myTextEditor" v-model="form.question" :options="editorOption"></quill-editor>
				</el-form-item>
				<el-form-item label="选择类型" prop="questoinType">
					<el-radio-group v-model="form.questoinType" @change="questoinTypeChange">
						<el-radio :label="1">单选</el-radio>
						<el-radio :label="2">多选</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="问题答案" prop="answer">
					<!-- <div class="gray">请输入所让选择的答案,多个答案之间用';'符号隔开</div> -->
				    <el-input class="answer" type="textarea" v-model="form.answer" placeholder="请输入所让选择的答案,多个答案之间用';'符号隔开"></el-input>
				</el-form-item>
				<el-button class="editor-btn" type="primary" @click="submit('form')">提交</el-button>
			</el-form>
			<!-- <div class="element margT10">
				<p class="inline">标题</p>
				<div class="inline margL10">
					<el-input v-model="form.title" class="width400"></el-input>
				</div>
			</div>
			<div class="element margT10">
				<p class="inline">设置投票截止时间</p>
				<div class="inline margL10">
					<el-date-picker class="width200" type="datetime" placeholder="选择时间" v-model="form.cutOffDate" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
				</div>
			</div>
			<quill-editor class="editor margT10" ref="myTextEditor" v-model="form.question" :options="editorOption"></quill-editor>
			<div class="selectType">
				<div>选择类型:</div>
				<el-radio-group class="margT10" v-model="form.questoinType" @change="questoinTypeChange">
					<el-radio :label="1">单选</el-radio>
					<el-radio :label="2">多选</el-radio>
				</el-radio-group>
			</div>
			<div class="answerBox">
				<div class="text answer">问题答案:</div>
				<el-input class="answer" type="textarea" v-model="form.answer" placeholder="请输入所让选择的答案,多个答案之间用';'号隔开"></el-input>
			</div> -->
			<!-- <el-button class="editor-btn" type="primary" @click="submit">提交</el-button> -->
		</div>
	</div>
</template>

<script>
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
	import {
		quillEditor
	} from 'vue-quill-editor';
	
	export default {
		name: 'editor',
		data: function() {
			return {
				type: 'edit',
				form: {
					createDate: '2019-10-10',
					cutOffDate: '2019-10-17',
					title: '会员对平台帮扶困难家庭的理念认可度的投票',
					question: '<p>为了使平台的理念得到落实，现平台想向大家了解是否认可以下帮扶方案：</p>2020年2月1号起，会员们都有机会得到一份的保障金，这份保障基金每月至少发放给一名所需会员，发放给：得了重疾需要一笔救助金的会员（需要医院证明，省市代理亲自到现场审核，一切出行费用由平台报销）......<p>',
					questoinType: '单选',
					answer: ""
				},
				rules: {
					cutOffDate: [{
						required: true,
						message: '请选择时间',
						trigger: 'change'
					}],
					title: [{
							type: 'string',
							required: true,
							message: '请填写标题',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 1 到 20 个字符',
							trigger: 'blur'
						}
					],
					question: [{
							type: 'string',
							required: true,
							message: '请填写问题',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 300,
							message: '长度在 3 到 300 个字符',
							trigger: 'blur'
						}
					],
					questoinType: [{
						type: 'number',
						required: true,
						message: '请选择类型',
						trigger: 'blur'
					}],
					answer: [{
						required: true,
						message: '请填写答案',
						trigger: 'blur'
					}]
				},
				editorOption: {
					placeholder: '请编写问题内容'
				}
			}
		},
		components: {
			quillEditor
		},
		mounted() {
			console.log('mounted');
			this.initData();
			// this.initData();
		},
		created() {
			console.log('created')
		},
		methods: {
			submit(formName) {
				let _this = this;
				console.log('_this.form.title',_this.form.title)
				let allIsChinese = _this.$utils.allIsChinese(_this.form.title);
				console.log('allIsChinese',allIsChinese);
				if(!allIsChinese){
					_this.$message('标题只能为中文');
					return;
				}
				let letterLen = _this.$utils.getLetterLength(_this.form.question);
				console.log('letterLen',letterLen)
				if(letterLen>5){
					_this.$message('问题中所填写内容出现的字母太多，该地方请少出现字母')
					return;
				}
				if(_this.$utils.getLetterLength(_this.form.answer)>5){
					_this.$message('答案中所填写内容出现的字母太多，该地方请少出现字母')
					return;
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log('form',_this.form)
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				// console.log(this.form);
				// this.$message.success('提交成功！');
				// this.$router.push('noticeManage')
			},
			initData() {
				let type = this.$route.query.type;
				console.log('type', type);
				this.type = type;
				if (type == 'edit') {
					let stringVote = localStorage.getItem('voteRow');
					console.log('stringVote', stringVote);
					let voteRow = JSON.parse(stringVote);
					console.log('stringVote', stringVote);
					this.form = {
						createDate: '2019-10-10',
						cutOffDate: '2019-10-17',
						title: '会员对平台帮扶困难家庭的理念认可度的投票',
						question: '<p>为了使平台的理念得到落实，现平台想向大家了解是否认可以下帮扶方案：</p>2020年2月1号起，会员们都有机会得到一份的保障金，这份保障基金每月至少发放给一名所需会员，发放给：得了重疾需要一笔救助金的会员（需要医院证明，省市代理亲自到现场审核，一切出行费用由平台报销）......<p>',
						questoinType: '单选',
						answer: '1;2;3',
					}
				} else {
					this.form = {
						createDate: '',
						cutOffDate: '',
						title: '',
						question: '<p>',
						questoinType: '',
						answer: ''
					}
				}

			},
			questoinTypeChange(val) {
				console.log('val', val);
			},
			onEditorChange({
				editor,
				html,
				text
			}) {
				this.form.content = html;
			},
		}
	}
</script>
