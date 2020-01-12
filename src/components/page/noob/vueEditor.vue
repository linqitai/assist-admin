<template>
    <div>
        <div class="crumbs margL10">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>新手指南管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{type=='edit'?'编辑指南':'新增指南'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
			<div class="element margT10">
				<p class="inline">标题</p>
				<div class="inline margL10">
					<el-input v-model="form.title"></el-input>
				</div>
			</div>
            <quill-editor class="margT10" ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
				type:'edit',
				form:{
					title:'',
					content: ''
				},
                editorOption: {
                    placeholder: '请编写公告内容'
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
		created(){
			console.log('created')
		},
        methods: {
			initData(){
				let type = this.$route.query.type;
				console.log('type',type);
				this.type = type;
				if(type=='edit'){
					let stringNotice = localStorage.getItem('noticeRow');
					console.log('stringNotice',stringNotice);
					let noticeRow = JSON.parse(stringNotice);
					console.log('noticeRow',noticeRow);
					this.form = {
						title: noticeRow.title||'',
						content: noticeRow.content || ''
					}
				}else{
					this.form = {
						title: '',
						content: ''
					}
				}
				
			},
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            submit(){
                console.log(this.form);
                this.$message.success('提交成功！');
				this.$router.push('noticeManage')
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
	.ql-editor{
		min-height: 400px !important;
	}
</style>