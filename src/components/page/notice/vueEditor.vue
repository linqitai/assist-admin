
<style scoped lang="scss">
    .editor-btn{
        margin-top: 20px;
    }
	.ql-editor{
		min-height: 400px !important;
	}
	.uploadPicBox{
		position: relative;
		width: 100px;
		height: 100px;
		.iconfont-upload-pic{
			font-size: 100px;
		}
		.selectPicInput{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100px;
			height: 100px;
		}
	}
	.selectedImg{
		width: 300px;
		margin-top: 20px;
	}
</style>
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>公告管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{type=='edit'?'编辑公告':'新增公告'}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
			<div class="element margT10">
				<p class="inline">标题</p>
				<div class="inline margL10">
					<el-input v-model="form.noticeTitle"></el-input>
				</div>
			</div>
			<div class="element margT10">
				<p class="inline">类型</p>
				<div class="inline margL10">
					<el-select v-model="form.type" @change="typeChange" class="handle-select mr10">
						<el-option v-for="item in typOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</div>
			</div>
			<div v-if="addPicShow" class="margT10">
				<div class="uploadPicBox">
					<i class="iconfont iconfont-upload-pic"></i>
					<input accept="image/png,image/jpeg,image/jpg" class="selectPicInput" style="opacity:0" type="file" @change="uploadIMG($event)">
					<!-- <van-button color="#ffae00" size="normal" :block="true" @click="uploadBtn">确认上传以上截图</van-button> -->
				</div>
				<img class="selectedImg" :src="uploadImage"/>
			</div>
            <quill-editor v-if="addTextShow" class="margT10" ref="myTextEditor" v-model="form.noticeContent" :options="editorOption"></quill-editor>
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
					noticeTitle:'',
					type:'',
					noticeContent: '',
					imgUrl:''
				},
                editorOption: {
                    placeholder: '请编写公告内容'
                },
				typOptions:[{id:0,value:'普通'},{id:1,value:'轮播图'}],
				addTextShow:true,
				addPicShow:false,
				uploadImage:''
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
        methods: {
			initData(){
				let _this = this;
				let type = _this.$route.query.type;
				console.log('type',type);
				_this.type = type;
				if(type=='edit'){
					let stringNotice = localStorage.getItem('noticeRow');
					let noticeRow = JSON.parse(stringNotice);
					console.log('noticeRow',noticeRow);
					_this.form = noticeRow;
					console.log("form",_this.form);
					_this.typeChange(noticeRow.type);
				}else{
					_this.form = {
						noticeTitle: '',
						type:0,
						noticeContent: ''
					}
				}
				
			},
			uploadIMG(e) {
				let _this = this;
				console.log('正在解析图片');
				// Toast.clear();
				/* _this.toast = Toast.loading({
				  duration: 3000, // 持续展示 toast
				  closeOnClickOverlay:true,
				  message: "正在解析图片"
				}); */
				let files = e.target.files || e.dataTransfer.files;
				if (!files.length) return;
				console.log("pic_size(MB)", files[0].size / 1024 / 1024);
				if (files[0].size / 1024 / 1024 > 7) {
				   _this.$message('上传图片大小不能超过 7MB');
				} else {
				  console.log('正在获取图片');
				  // _this.toast.message = `正在获取图片`;
				  _this.imgPreview(files[0]);
				}
			},
			//获取图片
			imgPreview(file) {
				let _this = this;
				// _this.toast.message = `正在压缩图片`;
				//判断支不支持FileReader
				if (!file || !window.FileReader) return false;
				if (/^image/.test(file.type)) {
				  //创建一个reader
				  let reader = new FileReader();
				  //将图片转成base64格式
				  reader.readAsDataURL(file);
				  //读取成功后的回调
				  reader.onloadend = function(res) {
					let result = this.result;
					let img = new Image();
					img.src = result;
					console.log('********未压缩前的图片大小(KB)********');
					console.log(result.length / 1024);
					// _this.toast.message = `未压缩前的图片大小 ${result.length / 1024} KB`;
					img.onload = function() {
					  let data = _this.compress(img, 0.1);//调整压缩比例
					  console.log('*******压缩后的图片大小(KB)*******');
					  console.log(data.length / 1024);
					  _this.uploadImage = data;
					  _this.form.imgUrl = data;
					  // _this.toast.message = `压缩后的图片大小 ${data.length / 1024} KB`;
					  // console.log(data);
					  // _this.uploadPicBase64 = data;
					  //执行上传图片接口：updateTransactionImgUrlById
					  // _this.toast.message = `正在上传图片`;
					  /* _this.$ajax.ajax(_this.$api.updateTransactionImgUrlById, 'POST', params, function(res) {
							// console.log('res', res);
							if (res.code == _this.$api.CODE_OK) {
								// _this.toast.message = `图片上传成功`;
								_this.toast.icon = 'success'
								// Toast.clear();
								// _this.$toast(`图片上传成功`);
								_this.showSellerDetailModel = false;
								_this.getData();
							}
					  }) */
					}
				  }
				}
			},
			// 压缩图片
			compress(img, size) {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				let initSize = img.src.length;
				let width = img.width;
				let height = img.height;
				canvas.width = width;
				canvas.height = height;
				// 铺底色
				ctx.fillStyle = '#fff';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, width, height);
				//进行最小压缩
				let ndata = canvas.toDataURL('image/jpeg', size);
				return ndata;
			},
			typeChange(val){
				let _this = this;
				console.log('val',val);
				if(val==0){
					_this.addTextShow=true;
					_this.addPicShow=false;
				}else if(val==1){
					_this.form.type=1;
					_this.uploadImage = _this.form.imgUrl;
					_this.addPicShow=true;
					_this.addTextShow=false;
				}
			},
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            submit(){
				let _this = this;
                console.log(this.form,'form');
				let url = "";
				var params = {
					noticeTitle:_this.form.noticeTitle,
					type:_this.form.type,
				}
				if(_this.form.type==1){
					params.imgUrl = _this.form.imgUrl;
				}else{
					params.noticeContent=_this.form.noticeContent;
				}
				if(_this.type=="edit"){
					params.id=_this.form.id;
					params.isPublish=_this.form.isPublish?1:0,
					url=_this.$api.updateNotice;
				}else if(_this.type=="add"){
					params.isPublish=0;
					url=_this.$api.insertNotice;
				}
				console.log(params,'params');
				_this.$ajax.ajax(url, 'POST', params, function(res){
					// console.log('res',res)
					if (res.code == _this.$api.ERR_OK) { // 200
						_this.$message.success('提交成功！');
						_this.$router.push('noticeManage')
					}
				})
            }
        }
    }
</script>